import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollView } from 'react-native';
import { Pressable } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '@/components/screen/Screen';
import { ScreenHeader } from '@/components/screen/ScreenHeader';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { Input } from '@/components/inputs/Input';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { TextArea } from '@/components/inputs/TextArea';
import { usePassengerProfile } from '@/features/passenger/profile/hooks/usePassengerProfile';
import { useVerifyAccount } from '../hooks/useVerifyAccount';
import {
  PASSENGER_GENDERS,
  passengerProfileSchema,
  type PassengerProfileFormValues,
} from '@/features/passenger/profile/validation/passenger-profile-schema';
import { selectUser, useAuthStore } from '@/store/auth-store';
import { cn } from '@/utils/cn';
import type { PassengerGender } from '@/types/passenger';
import type { PassengerStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<PassengerStackParamList>;
type Route = RouteProp<PassengerStackParamList, 'VerifyAccount'>;

export function VerifyAccountScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const user = useAuthStore(selectUser);
  const { data: passenger, isLoading } = usePassengerProfile(user?.id ?? '');
  const verify = useVerifyAccount(user?.id ?? '');

  const isVerified = Boolean(passenger?.identityVerified);
  const next = route.params?.next;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerProfileFormValues>({
    resolver: zodResolver(passengerProfileSchema),
    defaultValues: {
      firstName: passenger?.firstName ?? '',
      middleName: passenger?.middleName ?? '',
      lastName: passenger?.lastName ?? '',
      dateOfBirth: passenger?.dateOfBirth ?? '',
      gender: passenger?.gender ?? '',
      phone: passenger?.phone ?? user?.phone ?? '',
      address: passenger?.address ?? '',
      city: passenger?.city ?? '',
      province: passenger?.province ?? '',
      emergencyName: passenger?.emergencyName ?? '',
      emergencyPhone: passenger?.emergencyPhone ?? '',
      emergencyRelation: passenger?.emergencyRelation ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    verify.mutate({ ...values, gender: values.gender as PassengerGender });
  });

  const handleContinue = () => {
    if (next) {
      navigation.replace(next);
      return;
    }
    navigation.goBack();
  };

  if (isLoading || !user) {
    return (
      <Screen>
        <ScreenHeader title="Verify your account" />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-[13px] text-ink-muted">Loading…</Text>
        </View>
      </Screen>
    );
  }

  if (isVerified) {
    return (
      <Screen>
        <ScreenHeader title="Verify your account" />
        <View className="flex-1 px-4 pb-8">
          <View className="mt-8 items-center gap-4">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-success-soft">
              <Feather name="check" size={36} color="#16A34A" />
            </View>
            <View className="items-center gap-1.5">
              <Text className="text-center text-[20px] font-extrabold tracking-tight text-ink">
                Account verified
              </Text>
              <Text className="max-w-sm text-center text-[13px] leading-5 text-ink-secondary">
                Your account is now verified. You can book riders and order groceries.
              </Text>
            </View>
            <Button
              label={next ? 'Continue' : 'Done'}
              size="lg"
              fullWidth
              className="mt-4"
              onPress={handleContinue}
              rightIcon={<Feather name="arrow-right" size={16} color="#FFFFFF" />}
            />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Verify your account" subtitle="Complete your profile to verify" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-4 flex-row items-start gap-3 rounded-2xl border border-warning/30 bg-warning-soft p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-warning">
            <MaterialCommunityIcons name="shield-account" size={20} color="#FFFFFF" />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-[14px] font-bold text-ink">
              Verification required
            </Text>
            <Text className="text-[12.5px] leading-5 text-ink-secondary">
              Booking a rider and using HatodGo Grocery requires a verified account.
              Fill in your Passenger Profile details below to verify.
            </Text>
          </View>
        </View>

        <View className="mt-6 gap-5">
          {/* Personal information */}
          <Card className="gap-4 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="user" size={15} color="#F97316" />
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
                Personal information
              </Text>
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
                  value={field.value}
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
                    <Text className="px-1 text-[12.5px] leading-4 text-danger">
                      {errors.gender.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
          </Card>

          {/* Contact information */}
          <Card className="gap-4 p-4">
            <View className="flex-row items-center gap-2">
              <Feather name="phone" size={15} color="#F97316" />
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
                Contact information
              </Text>
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
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
                Address
              </Text>
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
              <Text className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
                Emergency contact (optional)
              </Text>
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
        </View>

        <View className="mt-7 gap-3">
          <Button
            label={verify.isPending ? 'Verifying…' : 'Verify my account'}
            size="lg"
            fullWidth
            loading={verify.isPending}
            onPress={onSubmit}
            leftIcon={<Feather name="shield" size={16} color="#FFFFFF" />}
          />
          {verify.isError ? (
            <Text className="text-center text-[12.5px] text-danger">
              Verification failed. Please try again.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}