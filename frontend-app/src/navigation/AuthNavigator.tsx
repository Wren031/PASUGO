import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@/features/auth/screens/WelcomeScreen';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { RegisterRoleScreen } from '@/features/auth/screens/RegisterRoleScreen';
import { InvitationCodeScreen } from '@/features/auth/screens/InvitationCodeScreen';
import { RegisterAccountScreen } from '@/features/auth/screens/RegisterAccountScreen';
import { OtpVerificationScreen } from '@/features/auth/screens/OtpVerificationScreen';
import { PassengerProfileScreen } from '@/features/auth/screens/PassengerProfileScreen';
import { DriverInformationScreen } from '@/features/auth/screens/DriverInformationScreen';
import { DriverDocumentsScreen } from '@/features/auth/screens/DriverDocumentsScreen';
import { DriverReviewScreen } from '@/features/auth/screens/DriverReviewScreen';
import { ForgotPasswordScreen } from '@/features/auth/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/features/auth/screens/ResetPasswordScreen';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterRoleScreen} />
      <Stack.Screen name="InvitationCode" component={InvitationCodeScreen} />
      <Stack.Screen name="RegisterAccount" component={RegisterAccountScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="PassengerProfile" component={PassengerProfileScreen} />
      <Stack.Screen name="DriverInformation" component={DriverInformationScreen} />
      <Stack.Screen name="DriverDocuments" component={DriverDocumentsScreen} />
      <Stack.Screen name="DriverReview" component={DriverReviewScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}