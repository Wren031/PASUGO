import { Text, View, ScrollView, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { TextArea } from '@/components/inputs/TextArea';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import {
  PASSENGER_GENDERS,
  passengerProfileSchema,
  type PassengerProfileFormValues as ProfileFormSchema,
} from '@/features/passenger/profile/validation/passenger-profile-schema';
import { normalizePhone } from '../validation/auth-schema';
import { useCompleteRegistration } from '../hooks/useCompleteRegistration';
import { useRegistrationStore } from '@/store/registration-store';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { PassengerGender } from '@/types/passenger';
import type { PassengerProfileFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'PassengerProfile'>;

export function PassengerProfileScreen() {
  const navigation = useNavigation<Navigation>();
  const draft = useRegistrationStore((state) => state.draft);
  const setProfile = useRegistrationStore((state) => state.setProfile);
  const completeRegistration = useCompleteRegistration();

  const saved = draft.profile && 'firstName' in draft.profile ? draft.profile : null;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(passengerProfileSchema),
    defaultValues: {
      firstName: saved?.firstName ?? '',
      middleName: saved?.middleName ?? '',
      lastName: saved?.lastName ?? '',
      dateOfBirth: saved?.dateOfBirth ?? '',
      gender: saved?.gender ?? '',
      phone: saved?.phone ?? '',
      address: saved?.address ?? '',
      city: saved?.city ?? '',
      province: saved?.province ?? '',
      emergencyName: saved?.emergencyName ?? '',
      emergencyPhone: saved?.emergencyPhone ?? '',
      emergencyRelation: saved?.emergencyRelation ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    const profile: PassengerProfileFormValues = {
      ...values,
      name: [values.firstName, values.middleName, values.lastName].filter(Boolean).join(' '),
      phone: normalizePhone(values.phone),
      gender: values.gender as PassengerGender,
    };
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
    <AuthLayout title="Complete your profile" subtitle="Provide your Passenger Profile details to get verified." onBack={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName="pb-8">
        <View className="gap-5">
          {/* Personal information */}
          <Card className="gap-4 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="user" size={15} color="#F97316" />
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">Personal information</Text>
            </View>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input
                  label="First name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.firstName?.message}
                  autoCapitalize="words"
                  placeholder="Juan"
                />
              )}
            />
            <Controller
              control={control}
              name="middleName"
              render={({ field }) => (
                <Input
                  label="Middle name (optional)"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.middleName?.message}
                  autoCapitalize="words"
                  placeholder="Santos"
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <Input
                  label="Last name"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.lastName?.message}
                  autoCapitalize="words"
                  placeholder="Dela Cruz"
                />
              )}
            />
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <Input
                  label="Date of birth"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.dateOfBirth?.message}
                  placeholder="YYYY-MM-DD"
                  keyboardType="numbers-and-punctuation"
                />
              )}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <View className="gap-2">
                  <Text className="px-1 text-[14px] font-semibold text-ink">Gender</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {PASSENGER_GENDERS.map((option: PassengerGender) => {
                      const selected = field.value === option;
                      return (
                        <Pressable
                          key={option}
                          onPress={() => field.onChange(option)}
                          className={cn(
                            'rounded-full border px-4 py-2',
                            selected ? 'border-primary bg-primary-soft' : 'border-line bg-white',
                          )}
                        >
                          <Text
                            className={cn(
                              'text-[12.5px] font-semibold',
                              selected ? 'text-primary-dark' : 'text-ink-secondary',
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {errors.gender?.message ? (
                    <Text className="px-1 text-[12.5px] leading-4 text-danger">{errors.gender.message}</Text>
                  ) : null}
                </View>
              )}
            />
          </Card>

          {/* Contact information */}
          <Card className="gap-4 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="phone" size={15} color="#F97316" />
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">Contact information</Text>
            </View>
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
          </Card>

          {/* Address */}
          <Card className="gap-4 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="map-pin" size={15} color="#F97316" />
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">Address</Text>
            </View>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextArea
                  label="Street address"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.address?.message}
                  placeholder="123 Rizal Ave., Barangay San Isidro"
                />
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <Input
                  label="City"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.city?.message}
                  placeholder="Manila"
                />
              )}
            />
            <Controller
              control={control}
              name="province"
              render={({ field }) => (
                <Input
                  label="Province"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.province?.message}
                  placeholder="Metro Manila"
                />
              )}
            />
          </Card>

          {/* Emergency contact */}
          <Card className="gap-4 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="alert-circle" size={15} color="#F97316" />
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">Emergency contact (optional)</Text>
            </View>
            <Controller
              control={control}
              name="emergencyName"
              render={({ field }) => (
                <Input
                  label="Full name"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.emergencyName?.message}
                  autoCapitalize="words"
                  placeholder="Maria Dela Cruz"
                />
              )}
            />
            <Controller
              control={control}
              name="emergencyPhone"
              render={({ field }) => (
                <Input
                  label="Contact number"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.emergencyPhone?.message}
                  keyboardType="phone-pad"
                  placeholder="0917 123 4567"
                />
              )}
            />
            <Controller
              control={control}
              name="emergencyRelation"
              render={({ field }) => (
                <Input
                  label="Relationship"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  error={errors.emergencyRelation?.message}
                  autoCapitalize="words"
                  placeholder="Spouse / Parent / Sibling"
                />
              )}
            />
          </Card>

          {errors.root ? <Text className="px-1 text-[12.5px] leading-4 text-danger">{errors.root.message}</Text> : null}

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