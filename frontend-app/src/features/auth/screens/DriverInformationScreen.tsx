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
import { useRegistrationStore } from '@/store/registration-store';
import type { ProfileFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'DriverInformation'>;

export function DriverInformationScreen() {
  const navigation = useNavigation<Navigation>();
  const setProfile = useRegistrationStore((state) => state.setProfile);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '' },
  });

  const onSubmit = handleSubmit((values) => {
    setProfile({ ...values, phone: normalizePhone(values.phone) });
    navigation.navigate('DriverDocuments');
  });

  return (
    <AuthLayout title="Driver information" subtitle="We need your basic information to set up your driver account." onBack={() => navigation.goBack()}>
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

          <Button
            label="Continue"
            size="lg"
            fullWidth
            onPress={onSubmit}
            leftIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
}