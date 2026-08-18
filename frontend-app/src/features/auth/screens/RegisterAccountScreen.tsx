import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/components/buttons/Button';
import { accountSchema } from '../validation/auth-schema';
import { useRegisterAccount } from '../hooks/useRegisterAccount';
import { useGoogleRegister } from '../hooks/useGoogleRegister';
import { showToast } from '@/store/toast-store';
import type { AccountFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'RegisterAccount'>;
type Route = RouteProp<AuthStackParamList, 'RegisterAccount'>;

const stepTitles = {
  passenger: { title: 'Create your account', subtitle: 'Enter your email and a password to get started.' },
  driver: { title: 'Create your driver account', subtitle: 'Enter your email and a password to continue.' },
} as const;

export function RegisterAccountScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const registerAccount = useRegisterAccount();
  const googleRegister = useGoogleRegister();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    registerAccount.mutate(values, {
      onSuccess: (result) => {
        navigation.navigate('OtpVerification', { debugOtp: result.otp });
      },
      onError: (error: Error) => {
        setError('root', { message: error.message });
        showToast('error', 'Registration failed', error.message);
      },
    });
  });

  const handleGoogleRegister = () => {
    googleRegister.mutate(undefined, {
      onSuccess: ({ role }) => {
        navigation.navigate(role === 'driver' ? 'DriverInformation' : 'PassengerProfile');
      },
      onError: (error: Error) => {
        showToast('error', 'Google registration failed', error.message);
      },
    });
  };

  const { title, subtitle } = stepTitles[route.params.role];

  return (
    <AuthLayout title={title} subtitle={subtitle} onBack={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName="pb-8">
        <View className="gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email address"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.email?.message}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Feather name="mail" size={18} color="#94A3B8" />}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput label="Password" value={field.value} onChangeText={field.onChange} error={errors.password?.message} />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordInput
                label="Confirm password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Text className="px-1 text-[12px] leading-4 text-ink-muted">
            Password must be at least 8 characters with uppercase, lowercase and a number.
          </Text>

          {errors.root ? <Text className="text-[12.5px] leading-4 text-danger">{errors.root.message}</Text> : null}

          <Button
            label="Continue"
            size="lg"
            fullWidth
            loading={registerAccount.isPending}
            onPress={onSubmit}
            leftIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
          />

          <View className="flex-row items-center gap-3 py-1">
            <View className="h-px flex-1 bg-line" />
            <Text className="text-[12px] font-medium text-ink-muted">or continue with</Text>
            <View className="h-px flex-1 bg-line" />
          </View>

          <Button
            label="Register with Google"
            size="lg"
            fullWidth
            variant="outline"
            loading={googleRegister.isPending}
            onPress={handleGoogleRegister}
            leftIcon={<MaterialCommunityIcons name="google" size={18} color="#4285F4" />}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
}