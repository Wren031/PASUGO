import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { Button } from '@/components/buttons/Button';
import { forgotPasswordSchema } from '../validation/auth-schema';
import { authService } from '../services/auth-service';
import { showToast } from '@/store/toast-store';
import type { ForgotPasswordFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => {
    clearErrors('root');
    setIsSubmitting(true);

    authService
      .forgotPassword(values.email)
      .then(({ otp }) => {
        showToast('success', 'Reset code sent', 'Check your email for the password reset code.');
        navigation.navigate('ResetPassword', { email: values.email, debugOtp: otp });
      })
      .catch((error: Error) => {
        setError('root', { message: error.message });
        showToast('error', 'Reset failed', error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  });

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your registered email and we will send you a reset code."
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
              returnKeyType="send"
              onSubmitEditing={onSubmit}
              leftIcon={<Feather name="mail" size={18} color="#94A3B8" />}
            />
          )}
        />

        {/* Root Server Error Banner */}
        {errors.root?.message && (
          <View className="flex-row items-center rounded-xl bg-red-50 p-3.5 border border-red-100 gap-2.5">
            <Feather name="alert-circle" size={16} color="#EF4444" />
            <Text className="flex-1 text-xs font-medium text-red-600 leading-4">
              {errors.root.message}
            </Text>
          </View>
        )}

        {/* Action Button */}
        <Button 
          label="Send Reset Code" 
          size="lg" 
          fullWidth 
          loading={isSubmitting}
          onPress={onSubmit} 
          rightIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
        />

        {/* Expiration Note */}
        <View className="flex-row items-center justify-center rounded-xl bg-slate-100/80 p-3 gap-2">
          <Feather name="clock" size={14} color="#64748B" />
          <Text className="flex-1 text-xs leading-5 text-slate-600">
            For security reasons, the reset code will expire after 10 minutes.
          </Text>
        </View>

        {/* Remembered Password Return Link */}
        <View className="flex-row items-center justify-center gap-1.5 pt-2">
          <Text className="text-sm text-slate-500">Remembered your password?</Text>
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
    </AuthLayout>
  );
}