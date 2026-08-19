import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AuthLayout } from '../components/AuthLayout';
import { useRegistrationStore } from '@/store/registration-store';
import type { RegistrationRole } from '../types';
import type { AuthStackParamList } from '@/navigation/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface RoleOption {
  type: RegistrationRole;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  badge?: string;
  description: string;
}

const registrationOptions: RoleOption[] = [
  {
    type: 'passenger',
    icon: 'account',
    title: 'Passenger',
    description: 'Book fast, reliable rides in seconds to get anywhere in town.',
  },
  {
    type: 'driver',
    icon: 'motorbike',
    title: 'Driver Partner',
    badge: 'Earn with us',
    description: 'Earn on your own schedule by offering safe rides with HatodGo.',
  },
];

export function RegisterRoleScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const setRole = useRegistrationStore((state) => state.setRole);

  const handleSelect = useCallback(
    (role: RegistrationRole) => {
      setRole(role);
      if (role === 'driver') {
        navigation.navigate('InvitationCode');
      } else {
        navigation.navigate('RegisterAccount', { role });
      }
    },
    [navigation, setRole],
  );

  return (
    <AuthLayout
      title="Create account"
      subtitle="Choose how you want to join HatodGo to get started."
      onBack={() => navigation.goBack()}
    >
      <View className="gap-4">
        {/* Flat Role Selection Cards */}
        {registrationOptions.map((option) => (
          <Pressable
            key={option.type}
            onPress={() => handleSelect(option.type)}
            className="flex-row items-center rounded-2xl border border-slate-200 bg-white p-5 active:border-orange-500 active:bg-orange-50/40"
          >
            {/* Icon Container */}
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-orange-100/80">
              <MaterialCommunityIcons name={option.icon} size={26} color="#EA580C" />
            </View>

            {/* Content Details */}
            <View className="ml-4 flex-1 pr-2">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-bold text-slate-900">
                  {option.title}
                </Text>
                {option.badge && (
                  <View className="rounded-full bg-emerald-100 px-2 py-0.5">
                    <Text className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                      {option.badge}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="mt-1 text-xs leading-5 text-slate-500">
                {option.description}
              </Text>
            </View>

            {/* Chevron Indicator */}
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#94A3B8"
            />
          </Pressable>
        ))}

        {/* Bottom Login Link Prompt */}
        <View className="flex-row items-center justify-center gap-1.5 pt-6">
          <Text className="text-sm text-slate-500">Already have an account?</Text>
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