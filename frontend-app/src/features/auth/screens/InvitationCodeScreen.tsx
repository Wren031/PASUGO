import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { Button } from '@/components/buttons/Button';
import { invitationCodeSchema } from '../validation/auth-schema';
import { useValidateInvitationCode } from '../hooks/useValidateInvitationCode';
import { useRegistrationStore } from '@/store/registration-store';
import { showToast } from '@/store/toast-store';
import type { InvitationCodeFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'InvitationCode'>;

export function InvitationCodeScreen() {
  const navigation = useNavigation<Navigation>();
  const validate = useValidateInvitationCode();
  const setInvitationCode = useRegistrationStore((state) => state.setInvitationCode);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InvitationCodeFormValues>({
    resolver: zodResolver(invitationCodeSchema),
    defaultValues: { invitationCode: '' },
  });

  const onSubmit = handleSubmit((values) => {
    const code = values.invitationCode.trim().toUpperCase();
    validate.mutate(code, {
      onSuccess: () => {
        setInvitationCode(code);
        navigation.navigate('RegisterAccount', { role: 'driver' });
      },
      onError: (error: Error) => {
        setError('invitationCode', { message: error.message });
        showToast('error', 'Invitation code invalid', error.message);
      },
    });
  });

  return (
    <AuthLayout
      title="Invitation code"
      subtitle="Enter the invitation code you received to register as a driver."
      onBack={() => navigation.goBack()}
    >
      <View className="gap-4">
        <Controller
          control={control}
          name="invitationCode"
          render={({ field }) => (
            <Input
              label="Invitation code"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.invitationCode?.message}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="HGO-DRV-XXXX-XXX"
              leftIcon={<Feather name="key" size={18} color="#94A3B8" />}
            />
          )}
        />

        <View className="flex-row items-start gap-2.5 rounded-2xl border border-line bg-white p-4">
          <MaterialCommunityIcons name="information-outline" size={20} color="#F97316" />
          <Text className="flex-1 text-[12.5px] leading-4 text-ink-secondary">
            Invitation codes are issued by HatodGo to approved drivers. If you don't have one, contact our support team.
          </Text>
        </View>

        <Button
          label="Continue"
          size="lg"
          fullWidth
          loading={validate.isPending}
          onPress={onSubmit}
          leftIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
        />
      </View>
    </AuthLayout>
  );
}