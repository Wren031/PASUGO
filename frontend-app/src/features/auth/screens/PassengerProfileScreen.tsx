import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { Button } from '@/components/buttons/Button';
import { normalizePhone, profileSchema } from '../validation/auth-schema';
import { useCompleteRegistration } from '../hooks/useCompleteRegistration';
import { useRegistrationStore } from '@/store/registration-store';
import { showToast } from '@/store/toast-store';
import type { ProfileFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'PassengerProfile'>;

export function PassengerProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const draft = useRegistrationStore((state) => state.draft);
  const setProfile = useRegistrationStore((state) => state.setProfile);
  const completeRegistration = useCompleteRegistration();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '' },
  });

  const onSubmit = handleSubmit((values) => {
    const profile = { ...values, phone: normalizePhone(values.phone) };
    setProfile(profile);
    completeRegistration.mutate(
      { ...draft, profile },
      {
        onError: (error: Error) => {
          setError('root', { message: error.message });
          showToast('error', 'Registration failed', error.message);
        },
      },
    );
  });

  return (
    <AuthLayout title="Complete your profile" subtitle="Tell us a little about yourself." onBack={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName="pb-8">
        <View className="gap-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                label="Full name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.name?.message}
                leftIcon={<Feather name="user" size={18} color="#94A3B8" />}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneInput label="Mobile number" value={field.value} onChangeText={field.onChange} error={errors.phone?.message} />
            )}
          />

          {errors.root ? <Text className="text-[12.5px] leading-4 text-danger">{errors.root.message}</Text> : null}

          <Button
            label="Finish Setup"
            size="lg"
            fullWidth
            loading={completeRegistration.isPending}
            onPress={onSubmit}
            leftIcon={<Feather name="check" size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
}