import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/buttons/Button';
import { WelcomeIllustration } from '../components/WelcomeIllustration';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { showToast } from '@/store/toast-store';
import type { AuthStackParamList } from '@/navigation/types';
import React from 'react';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<Navigation>();
  const googleSignIn = useGoogleSignIn();

  const handleGoogleSignIn = () => {
    googleSignIn.mutate(undefined, {
      onError: (error: Error) => {
        showToast('error', 'Google sign in failed', error.message);
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-muted">
      <ScrollView contentContainerClassName="flex-grow" showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center px-6 pb-10 pt-14">
          <View className="w-full max-w-md items-center">
            <Logo size="lg" />
            <Text className="mt-2 text-center text-[17px] font-bold text-ink-secondary">
              Your Ride, Your Way.
            </Text>

            <View className="w-full py-4">
              <WelcomeIllustration />
            </View>

            <Text className="text-center text-[15px] leading-6 text-ink-muted">
              Fast, convenient, and reliable rides at your fingertips.
            </Text>

            <View className="mt-8 w-full gap-3">
              <Button
                label="Get Started"
                size="lg"
                fullWidth
                onPress={() => navigation.navigate('Register')}
                leftIcon={<Feather name="arrow-right" size={18} color="#FFFFFF" />}
              />
              <Button
                label="Continue with Google"
                size="lg"
                fullWidth
                variant="outline"
                loading={googleSignIn.isPending}
                onPress={handleGoogleSignIn}
                leftIcon={<MaterialCommunityIcons name="google" size={18} color="#4285F4" />}
              />
              <Button
                label="Log In"
                size="lg"
                fullWidth
                variant="ghost"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}