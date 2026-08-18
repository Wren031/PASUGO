import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { DemoCredentials } from '../components/DemoCredentials';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/components/buttons/Button';
import { loginSchema, normalizePhone } from '../validation/auth-schema';
import { useLogin } from '../hooks/useLogin';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { showToast } from '@/store/toast-store';
import type { LoginFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const navigation = useNavigation<Navigation>();
  const login = useLogin();
  const googleSignIn = useGoogleSignIn();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(
      { phone: normalizePhone(values.phone), password: values.password },
      {
        onError: (error: Error) => {
          setError('root', { message: error.message });
          showToast('error', 'Login failed', error.message);
        },
      },
    );
  });

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to book or drive with HatodGo.">
      <View className="gap-5">
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput
              label="Mobile number"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.phone?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <PasswordInput
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.password?.message}
            />
          )}
        />

        <View className="items-end">
          <Text
            onPress={() => navigation.navigate('ForgotPassword')}
            className="text-[13.5px] font-semibold text-primary"
          >
            Forgot password?
          </Text>
        </View>

        {errors.root ? <Text className="text-[12.5px] leading-4 text-danger">{errors.root.message}</Text> : null}

        <Button
          label="Log In"
          size="lg"
          fullWidth
          loading={login.isPending}
          onPress={onSubmit}
          leftIcon={<Feather name="log-in" size={18} color="#FFFFFF" />}
        />

        <View className="flex-row items-center gap-3">
          <View className="h-px flex-1 bg-line" />
          <Text className="text-[12px] font-medium text-ink-muted">or continue with</Text>
          <View className="h-px flex-1 bg-line" />
        </View>

        <Button
          label="Continue with Google"
          size="lg"
          fullWidth
          variant="outline"
          loading={googleSignIn.isPending}
          onPress={() =>
            googleSignIn.mutate(undefined, {
              onError: (error: Error) => {
                showToast('error', 'Google sign in failed', error.message);
              },
            })
          }
          leftIcon={<MaterialCommunityIcons name="google" size={18} color="#4285F4" />}
        />

        <View className="flex-row items-center justify-center gap-1.5 pt-1">
          <Text className="text-[14px] text-ink-secondary">New to HatodGo?</Text>
          <Text
            onPress={() => navigation.navigate('Register')}
            className="text-[14px] font-bold text-primary"
          >
            Create account
          </Text>
        </View>

        <DemoCredentials onFill={(phone, password) => {
          setValue('phone', phone);
          setValue('password', password);
        }} />
      </View>
    </AuthLayout>
  );
}
