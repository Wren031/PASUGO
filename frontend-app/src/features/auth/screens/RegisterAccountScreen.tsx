import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';

import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/components/buttons/Button';
import { accountSchema } from '../validation/auth-schema';
import { useRegisterAccount } from '../hooks/useRegisterAccount';
import { showToast } from '@/store/toast-store';
import type { AccountFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'RegisterAccount'>;
type Route = RouteProp<AuthStackParamList, 'RegisterAccount'>;

const stepTitles = {
  passenger: { 
    title: 'Create your account', 
    subtitle: 'Enter your email and a password to get started.' 
  },
  driver: { 
    title: 'Create driver account', 
    subtitle: 'Enter your email and a password to continue.' 
  },
} as const;

/** Inline Flat Google Logo SVG */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function RegisterAccountScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const registerAccount = useRegisterAccount();

  const [isGooglePending, setIsGooglePending] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    clearErrors('root');
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

  const handleGoogleSignUp = async () => {
    try {
      setIsGooglePending(true);
      clearErrors('root');
      showToast('info', 'Google Registration', 'Connecting to Google authentication...');
    } catch (error: any) {
      const message = error?.message || 'Failed to sign up with Google';
      setError('root', { message });
      showToast('error', 'Google Auth Error', message);
    } finally {
      setIsGooglePending(false);
    }
  };

  const currentRole = route.params?.role ?? 'passenger';
  const { title, subtitle } = stepTitles[currentRole];

  return (
    <AuthLayout 
      title={title} 
      subtitle={subtitle} 
      onBack={() => navigation.goBack()}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled" 
        contentContainerClassName="pb-8"
      >
        <View className="gap-4">
          {/* Email Address */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email address"
                placeholder="name@example.com"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.email?.message}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
                leftIcon={<Feather name="mail" size={18} color="#94A3B8" />}
              />
            )}
          />

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
                textContentType="newPassword"
                returnKeyType="next"
              />
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordInput
                label="Confirm password"
                placeholder="Re-enter your password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            )}
          />

          {/* Password Requirements Callout Box */}
          <View className="flex-row items-start rounded-xl bg-slate-100/80 p-3 gap-2">
            <Feather name="info" size={15} color="#64748B" style={{ marginTop: 2 }} />
            <Text className="flex-1 text-xs leading-5 text-slate-600">
              Must be at least 8 characters long and contain uppercase, lowercase, and a number.
            </Text>
          </View>

          {/* Root Server Error Banner */}
          {errors.root?.message && (
            <View className="flex-row items-center rounded-xl bg-red-50 p-3.5 border border-red-100 gap-2.5">
              <Feather name="alert-circle" size={16} color="#EF4444" />
              <Text className="flex-1 text-xs font-medium text-red-600 leading-4">
                {errors.root.message}
              </Text>
            </View>
          )}

          {/* Submit Primary Action Button */}
          <View className="pt-2">
            <Button
              label="Continue"
              variant="primary"
              size="lg"
              fullWidth
              loading={registerAccount.isPending}
              onPress={onSubmit}
              rightIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
            />
          </View>

          {/* Flat Divider */}
          <View className="flex-row items-center gap-3 py-0.5">
            <View className="flex-1 h-[1px] bg-slate-200" />
            <Text className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-slate-200" />
          </View>

          {/* Google Sign Up Button */}
          <Button
            label="Sign up with Google"
            variant="outline"
            size="lg"
            fullWidth
            loading={isGooglePending}
            disabled={registerAccount.isPending}
            onPress={handleGoogleSignUp}
            leftIcon={<GoogleIcon size={20} />}
          />

          {/* Bottom Navigation Link */}
          <View className="flex-row items-center justify-center gap-1.5 pt-2">
            <Text className="text-sm text-slate-500">Already have an account?</Text>
            <Pressable
              onPress={() => navigation.navigate('Login')}
              hitSlop={8}
              className="active:opacity-70"
            >
              <Text className="text-sm font-bold text-orange-600">
                Log In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}