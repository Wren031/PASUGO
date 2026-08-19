import React, { useCallback } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/buttons/Button';
import type { AuthStackParamList } from '@/navigation/types';

import { WelcomeIllustration } from '../components/WelcomeIllustration';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();

  const handleGetStarted = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  const handleLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        contentContainerClassName="flex-grow justify-between px-6 pb-6 pt-4" 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between py-2">
          <Logo size="lg" />
          <Pressable 
            onPress={handleLogin}
            className="rounded-full bg-slate-100 px-4 py-1.5 active:bg-slate-200"
            hitSlop={8}
          >
            <Text className="text-xs font-bold text-slate-800">Sign In</Text>
          </Pressable>
        </View>

        {/* Hero Visual Area - Expanded to let HatodGo shine */}
        <View className="my-auto w-full items-center justify-center py-4">
          <WelcomeIllustration className="w-full max-w-lg" />
        </View>

        {/* Content & Action Area */}
        <View className="w-full max-w-md self-center">
          {/* Main Copy */}
          <View className="mb-6 space-y-2">
            <Text className="text-3xl font-black tracking-tight text-slate-900">
              Your Ride,{' \n'}
              <Text className="text-orange-500">Your Way.</Text>
            </Text>

            <Text className="text-base leading-relaxed text-slate-500">
              Fast, convenient, and reliable rides at your fingertips. Get matched with top-rated drivers near you.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="w-full gap-3">
            <Button
              label="Get Started"
              size="lg"
              fullWidth
              onPress={handleGetStarted}
              rightIcon={<Feather name="arrow-right" size={20} color="#FFFFFF" />}
            />

            <View className="flex-row items-center justify-center pt-1">
              <Text className="text-xs text-slate-400">By continuing you agree to our </Text>
              <Pressable hitSlop={6}>
                <Text className="text-xs font-semibold text-slate-600 underline">Terms</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}