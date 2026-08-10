import { Pressable, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '@/components/inputs/Input';
import { PhoneInput } from '@/components/inputs/PhoneInput';
import { PasswordInput } from '@/components/inputs/PasswordInput';
import { Button } from '@/components/buttons/Button';
import { registerSchema, normalizePhone } from '../validation/auth-schema';
import { useRegister } from '../hooks/useRegister';
import { showToast } from '@/store/toast-store';
import { cn } from '@/utils/cn';
import type { RegisterFormValues } from '../types';
import type { AuthStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

type RoleOption = 'passenger' | 'driver';

const roleOptions: { value: RoleOption; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; description: string }[] = [
  { value: 'passenger', icon: 'account-outline', label: 'Passenger', description: 'Book rides across the city' },
  { value: 'driver', icon: 'motorbike', label: 'Driver', description: 'Drive and earn with HatodGo' },
];

export function RegisterScreen() {
  const navigation = useNavigation<Navigation>();
  const register = useRegister();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', phone: '', email: '', password: '', confirmPassword: '', role: 'passenger' },
  });

  const role = watch('role');

  const onSubmit = handleSubmit((values) => {
    register.mutate(
      {
        name: values.name,
        phone: normalizePhone(values.phone),
        email: values.email,
        password: values.password,
        role: values.role,
      },
      {
        onError: (error: Error) => {
          setError('root', { message: error.message });
          showToast('error', 'Registration failed', error.message);
        },
      },
    );
  });

  return (
    <AuthLayout title="Create account" subtitle="Join HatodGo as a passenger or a driver." onBack={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerClassName="pb-8">
        <View className="gap-4">
          <View className="flex-row gap-3">
            {roleOptions.map((option) => {
              const selected = role === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setValue('role', option.value)}
                  className={cn(
                    'flex-1 rounded-2xl border bg-white p-4',
                    selected ? 'border-primary bg-primary-soft' : 'border-line',
                  )}
                >
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={24}
                    color={selected ? '#F97316' : '#94A3B8'}
                  />
                  <Text className={cn('mt-2 text-[14px] font-bold', selected ? 'text-primary-dark' : 'text-ink')}>
                    {option.label}
                  </Text>
                  <Text className="mt-0.5 text-[11.5px] leading-4 text-ink-muted">{option.description}</Text>
                </Pressable>
              );
            })}
          </View>

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
                leftIcon={<Feather name="mail" size={18} color="#94A3B8" />}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordInput label="Password" value={field.value} onChangeText={field.onChange} error={errors.password?.message} />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <PasswordInput
                label="Confirm password"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {errors.root ? <Text className="text-[12.5px] leading-4 text-danger">{errors.root.message}</Text> : null}

          <Button
            label="Create Account"
            size="lg"
            fullWidth
            loading={register.isPending}
            onPress={onSubmit}
            leftIcon={<Feather name="user-plus" size={18} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </AuthLayout>
  );
}
