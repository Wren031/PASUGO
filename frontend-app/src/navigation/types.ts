import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Booking } from '@/types/booking';
import type { AvailableDriver } from '@/types/booking';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type PassengerTabParamList = {
  Home: undefined;
  Trips: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type PassengerStackParamList = {
  PassengerTabs: NavigatorScreenParams<PassengerTabParamList> | undefined;
  SearchDriver: { booking: Booking };
  DriverFound: { booking: Booking; driver: AvailableDriver };
  TripTracking: { booking: Booking; driver: AvailableDriver };
  TripDetails: { booking: Booking };
  ReviewDriver: { booking: Booking };
  Payments: undefined;
  AddPaymentMethod: undefined;
  SavedPlaces: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

export type DriverTabParamList = {
  Home: undefined;
  Trips: undefined;
  Earnings: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type DriverStackParamList = {
  DriverTabs: NavigatorScreenParams<DriverTabParamList> | undefined;
  RideRequest: undefined;
  ActiveTrip: undefined;
  DriverVehicle: undefined;
  DriverReviews: undefined;
  DriverEditProfile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Passenger: NavigatorScreenParams<PassengerStackParamList> | undefined;
  Driver: NavigatorScreenParams<DriverStackParamList> | undefined;
};
