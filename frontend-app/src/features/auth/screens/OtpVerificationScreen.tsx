import { useState } from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { OtpInput } from '../components/OtpInput';
import { Button } from '@/components/buttons/Button';
import { otpSchema } from '../validation/auth-schema';
import { useRequestOtp, useVerifyOtp } from '../hooks/useOtp';
import { useRegistrationStore } from '@/store/registration-store';
import { showToast } from '@/store/toast-store';
import type { OtpFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type Route = RouteProp<AuthStackParamList, 'OtpVerification'>;

export function OtpVerificationScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const role = useRegistrationStore((state) => state.draft.role);
  const email = useRegistrationStore((state) => state.draft.email);
  const verify = useVerifyOtp();
  const requestOtp = useRequestOtp();
  const [debugOtp, setDebugOtp] = useState(route.params.debugOtp);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = handleSubmit((values) => {
    verify.mutate(values.otp, {
      onSuccess: () => {
        navigation.navigate(role === 'driver' ? 'DriverInformation' : 'PassengerProfile');
      },
      onError: (error: Error) => {
        setError('otp', { message: error.message });
        showToast('error', 'Verification failed', error.message);
      },
    });
  });

  const handleResend = () => {
    requestOtp.mutate(undefined, {
      onSuccess: (result) => {
        setDebugOtp(result.otp);
        showToast('success', 'Code sent', `A new verification code was sent to ${email}.`);
      },
      onError: (error: Error) => {
        showToast('error', 'Resend failed', error.message);
      },
    });
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit code sent to ${email}.`} onBack={() => navigation.goBack()}>
      <View className="gap-5">
        {debugOtp ? (
          <View className="flex-row items-center gap-2.5 rounded-2xl border border-dashed border-primary bg-primary-soft p-4">
            <Feather name="info" size={18} color="#F97316" />
            <Text className="flex-1 text-[13px] leading-5 text-primary-dark">
              Mock OTP: <Text className="font-bold">{debugOtp}</Text>
            </Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="otp"
          render={({ field }) => (
            <OtpInput value={field.value} onChange={field.onChange} error={errors.otp?.message} />
          )}
        />

        <View className="flex-row items-center justify-center gap-1.5">
          <Text className="text-[13.5px] text-ink-secondary">Didn't receive the code?</Text>
          <Text
            onPress={handleResend}
            className="text-[13.5px] font-bold text-primary"
          >
            Resend code
          </Text>
        </View>

        <Button
          label="Verify"
          size="lg"
          fullWidth
          loading={verify.isPending}
          onPress={onSubmit}
          leftIcon={<Feather name="check" size={18} color="#FFFFFF" />}
        />
      </View>
    </AuthLayout>
  );
}