import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthLayout } from '../components/AuthLayout';
import { useRegistrationStore } from '@/store/registration-store';
import { cn } from '@/utils/cn';
import type { RegistrationRole } from '../types';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const registrationOptions: { type: RegistrationRole; icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; description: string }[] = [
  {
    type: 'passenger',
    icon: 'account-outline',
    title: 'Register as Passenger',
    description: 'Create an account and book rides.',
  },
  {
    type: 'driver',
    icon: 'motorbike',
    title: 'Register as Driver',
    description: 'Register as a driver and provide your required documents.',
  },
];

export function RegisterRoleScreen() {
  const navigation = useNavigation<Navigation>();
  const setRole = useRegistrationStore((state) => state.setRole);

  const handleSelect = (role: RegistrationRole) => {
    setRole(role);
    if (role === 'driver') {
      navigation.navigate('InvitationCode');
    } else {
      navigation.navigate('RegisterAccount', { role });
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Choose how you want to join HatodGo."
      onBack={() => navigation.goBack()}
    >
      <View className="gap-4">
        {registrationOptions.map((option) => (
          <Pressable
            key={option.type}
            onPress={() => handleSelect(option.type)}
            className="flex-row items-center gap-4 rounded-2xl border border-line bg-white p-5 active:bg-primary-soft"
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
              <MaterialCommunityIcons name={option.icon} size={26} color="#F97316" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-ink">{option.title}</Text>
              <Text className="mt-1 text-[12.5px] leading-4 text-ink-muted">{option.description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#94A3B8" />
          </Pressable>
        ))}
      </View>
    </AuthLayout>
  );
}