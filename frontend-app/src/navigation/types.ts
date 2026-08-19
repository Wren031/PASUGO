import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Booking } from '@/types/booking';
import type { AvailableDriver } from '@/types/booking';
import type { SavedPlace } from '@/types/passenger';
import type { PickedLocation } from '@/components/inputs/LocationInput';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  InvitationCode: undefined;
  RegisterAccount: { role: 'passenger' | 'driver' };
  OtpVerification: { debugOtp?: string };
  PassengerProfile: undefined;
  DriverInformation: undefined;
  DriverDocuments: undefined;
  DriverReview: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string; debugOtp?: string };
};

export type PassengerTabParamList = {
  Home: undefined;
  Trips: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type PassengerStackParamList = {
  PassengerTabs: NavigatorScreenParams<PassengerTabParamList> | undefined;
  SelectLocationScreen: SelectLocationScreenParams;
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
  RideBooking: undefined;
  GroceryStores: undefined;
  GroceryStore: { storeId: string };
  GroceryCheckout: undefined;
  GroceryTracking: { orderId: string; storeId: string };
};

export type SelectLocationScreenParams = {
  target: 'pickup' | 'dropoff';
  savedPlaces?: SavedPlace[];
  onSelect?: (location: PickedLocation) => void;
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
