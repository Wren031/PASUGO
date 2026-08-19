import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { OtpInput } from '../components/OtpInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/components/buttons/Button';
import { resetPasswordSchema } from '../validation/auth-schema';
import { authService } from '../services/auth-service';
import { showToast } from '@/store/toast-store';
import type { ResetPasswordFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
type Route = RouteProp<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  
  const [debugOtp] = useState(route.params?.debugOtp);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { 
      email: route.params?.email ?? '', 
      otp: '', 
      newPassword: '', 
      confirmPassword: '' 
    },
  });

  const onSubmit = handleSubmit((values) => {
    clearErrors('root');
    setIsSubmitting(true);

    authService
      .resetPassword(values.email, values.otp, values.newPassword)
      .then(() => {
        showToast('success', 'Password reset', 'You can now log in with your new password.');
        navigation.popTo('Login');
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
      title="Choose a new password"
      subtitle={`Enter the 6-digit code sent to ${route.params?.email} and your new password.`}
      onBack={() => navigation.goBack()}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled" 
        contentContainerClassName="pb-8"
      >
        <View className="gap-4">
          {/* Mock OTP Testing Alert Banner */}
          {debugOtp ? (
            <View className="flex-row items-center gap-2.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/80 p-3.5">
              <Feather name="code" size={16} color="#EA580C" />
              <Text className="flex-1 text-xs leading-5 text-orange-950">
                Development OTP Code: <Text className="font-extrabold text-orange-600">{debugOtp}</Text>
              </Text>
            </View>
          ) : null}

          {/* Disabled Readonly Email Input */}
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
                editable={false}
                leftIcon={<Feather name="mail" size={18} color="#94A3B8" />}
              />
            )}
          />

          {/* OTP Code Field */}
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <OtpInput 
                value={field.value} 
                onChange={field.onChange} 
                error={errors.otp?.message} 
              />
            )}
          />

          {/* New Password */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <PasswordInput
                label="New password"
                placeholder="Enter new password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.newPassword?.message}
                textContentType="newPassword"
                returnKeyType="next"
              />
            )}
          />

          {/* Confirm New Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordInput
                label="Confirm new password"
                placeholder="Re-enter new password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            )}
          />

          {/* Password Guidance Callout */}
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

          {/* Submit Reset Button */}
          <View className="pt-2">
            <Button
              label="Reset Password"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onPress={onSubmit}
              rightIcon={<Feather name="check-circle" size={18} color="#FFFFFF" />}
            />
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
}