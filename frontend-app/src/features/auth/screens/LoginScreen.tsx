import React, { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/components/buttons/Button';
import { loginSchema } from '../validation/auth-schema';
import { useLogin } from '../hooks/useLogin';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { LoginFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const REMEMBERED_EMAIL_KEY = 'hatodgo-remembered-email';
const REMEMBERED_PASSWORD_KEY = 'hatodgo-remembered-password';

/** Flat Google Icon SVG */
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

export function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const login = useLogin();

  const [rememberMe, setRememberMe] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Load remembered Email AND Password on component mount
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(REMEMBERED_EMAIL_KEY),
      AsyncStorage.getItem(REMEMBERED_PASSWORD_KEY),
    ]).then(([email, password]) => {
      if (email || password) {
        if (email) setValue('email', email, { shouldValidate: false });
        if (password) setValue('password', password, { shouldValidate: false });
        setRememberMe(true);
      }
    });
  }, [setValue]);

  // Save or clear both Email and Password on login submit
  const onSubmit = handleSubmit((values) => {
    clearErrors('root');
    if (rememberMe) {
      AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
      AsyncStorage.setItem(REMEMBERED_PASSWORD_KEY, values.password);
    } else {
      AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
      AsyncStorage.removeItem(REMEMBERED_PASSWORD_KEY);
    }

    login.mutate(
      { email: values.email, password: values.password },
      {
        onError: (error: Error) => {
          setError('root', { message: error.message });
          showToast('error', 'Login failed', error.message);
        },
      },
    );
  });

  const handleGoogleLogin = async () => {
    try {
      setIsGooglePending(true);
      clearErrors('root');
      showToast('info', 'Google Login', 'Connecting to Google authentication...');
    } catch (error: any) {
      const message = error?.message || 'Failed to sign in with Google';
      setError('root', { message });
      showToast('error', 'Google Auth Error', message);
    } finally {
      setIsGooglePending(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to book or drive with HatodGo."
      onBack={() => navigation.goBack()}
    >
      <View className="gap-5">
        {/* Email Field */}
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

        {/* Password Field */}
        <View className="gap-1.5">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.password?.message}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            )}
          />

          {/* Remember Me + Forgot Password Row */}
          <View className="flex-row items-center justify-between pt-1">
            <Pressable
              onPress={() => setRememberMe((v) => !v)}
              hitSlop={8}
              className="flex-row items-center gap-2 active:opacity-70"
            >
              <View
                className={cn(
                  'h-5 w-5 items-center justify-center rounded-md border-2',
                  rememberMe ? 'border-orange-600 bg-orange-600' : 'border-slate-300 bg-white',
                )}
              >
                {rememberMe ? <Feather name="check" size={13} color="#FFFFFF" /> : null}
              </View>
              <Text className="text-sm font-medium text-slate-600">Remember me</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={8}
              className="active:opacity-70"
            >
              <Text className="text-xs font-semibold text-orange-600">
                Forgot password?
              </Text>
            </Pressable>
          </View>
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

        {/* Primary Log In Button */}
        <Button
          label="Log In"
          variant="primary"
          size="lg"
          fullWidth
          loading={login.isPending}
          onPress={onSubmit}
          rightIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
        />

        {/* Flat Divider */}
        <View className="flex-row items-center gap-3 py-0.5">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        {/* Google Log In Button */}
        <Button
          label="Continue with Google"
          variant="outline"
          size="lg"
          fullWidth
          loading={isGooglePending}
          disabled={login.isPending}
          onPress={handleGoogleLogin}
          leftIcon={<GoogleIcon size={20} />}
        />

        {/* Register / Sign Up Navigation Link */}
        <View className="flex-row items-center justify-center gap-1.5 pt-2">
          <Text className="text-sm text-slate-500">New to HatodGo?</Text>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            hitSlop={8}
            className="active:opacity-70"
          >
            <Text className="text-sm font-bold text-orange-600">
              Create account
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}