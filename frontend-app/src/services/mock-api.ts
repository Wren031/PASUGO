import { LANDMARKS } from '@/constants/maps';
import { MOCK_CREDENTIALS } from '@/constants/mock';
import { ApiError, cloneDeep, computeFare, generateId, mockDelay } from '@/utils/mock';
import { estimateDurationMin, haversineKm } from '@/utils/geo';
import { mockData } from './mock-data';
import type { AvailableDriver, Booking, BookingDraft, FareBreakdown, RideRequest } from '@/types/booking';
import type { ChartPoint, Driver, DriverEarningBreakdown, DriverTripEarning, EarningsReport } from '@/types/driver';
import type { AppNotification } from '@/types/notification';
import type { PaymentMethodInfo, PaymentTransaction, TopUpOption, WalletAccount } from '@/types/payment';
import type { Review, ReviewSubmission } from '@/types/review';
import type { RegistrationDraft, RegistrationRole } from '@/features/auth/types';
import type { AuthSession, LoginPayload, User } from '@/types/user';
import type { Vehicle } from '@/types/vehicle';
import type { SavedPlace } from '@/types/passenger';
import type { LatLng } from '@/types/map';
import type { DocumentInfo } from '@/types/common';

const DRIVER_SHARE = 0.8;

const INVITATION_CODES = [
  { code: 'HGO-DRV-2026-001', status: 'ACTIVE', expiresAt: '2026-12-31T23:59:59Z' },
  { code: 'HGO-DRV-2026-002', status: 'ACTIVE', expiresAt: '2026-12-31T23:59:59Z' },
  { code: 'HGO-DRV-2025-001', status: 'EXPIRED', expiresAt: '2025-12-31T23:59:59Z' },
] as const;

const MOCK_OTP_BY_ROLE: Record<RegistrationRole, string> = {
  passenger: '123456',
  driver: '654321',
};

function asUser(record: { id: string; role: 'passenger' | 'driver'; name: string; email: string; phone: string; createdAt: string }): User {
  return {
    id: record.id,
    role: record.role,
    name: record.name,
    email: record.email,
    phone: record.phone,
    createdAt: record.createdAt,
  };
}

function toAvailableDriver(driver: Driver, from: LatLng): AvailableDriver {
  const distanceKm = haversineKm(driver.currentLocation, from);
  return {
    id: driver.id,
    name: driver.name,
    rating: driver.rating,
    trips: driver.totalTrips,
    distanceKm,
    etaMin: Math.max(1, Math.round(distanceKm / 18 * 60) + 1),
    coordinates: driver.currentLocation,
    motorcycle: `${driver.motorcycle.brand} ${driver.motorcycle.model}`,
    plateNumber: driver.motorcycle.plateNumber,
  };
}

function weekDays(): { start: Date; labels: string[] } {
  const today = new Date('2026-08-07T12:00:00');
  const start = new Date(today);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toLocaleDateString('en-PH', { weekday: 'short' });
  });
  return { start, labels };
}

function monthSeries(driverId: string): { months: Date[]; labels: string[] } {
  const months: Date[] = [];
  const labels: string[] = [];
  const now = new Date('2026-08-07T12:00:00');
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d);
    labels.push(d.toLocaleDateString('en-PH', { month: 'short' }));
  }
  return { months, labels };
}

function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const mockApi = {
  // ------------------------------------------------------------------ auth
  async login(payload: LoginPayload): Promise<AuthSession> {
    await mockDelay(700);
    const normalized = payload.phone.replace(/[\s-]/g, '');
    const user = mockData.users.find(
      (u) => u.phone.replace(/[\s-]/g, '') === normalized && u.password === payload.password,
    );
    if (!user) {
      throw new ApiError('Invalid phone number or password.', 401);
    }
    return { token: generateId('tok'), user: asUser(user) };
  },

  async validateInvitationCode(code: string): Promise<{ code: string; status: string; expiresAt: string }> {
    await mockDelay(600);
    const normalized = code.trim().toUpperCase();
    const match = INVITATION_CODES.find((entry) => entry.code === normalized);
    const valid =
      match &&
      match.status === 'ACTIVE' &&
      new Date(match.expiresAt).getTime() >= Date.now();
    if (!match || !valid) {
      throw new ApiError('This invitation code is invalid or has expired.', 400);
    }
    return cloneDeep(match);
  },

  async checkEmailAvailable(email: string): Promise<void> {
    await mockDelay(350);
    const normalized = email.trim().toLowerCase();
    if (mockData.users.some((u) => u.email.toLowerCase() === normalized)) {
      throw new ApiError('An account with this email already exists.', 409);
    }
  },

  async requestOtp(role: RegistrationRole, email: string): Promise<{ otp: string }> {
    await mockDelay(500);
    return { otp: MOCK_OTP_BY_ROLE[role] };
  },

  async verifyOtp(role: RegistrationRole, email: string, otp: string): Promise<void> {
    await mockDelay(600);
    if (otp.trim() !== MOCK_OTP_BY_ROLE[role]) {
      throw new ApiError('The code you entered is incorrect. Please try again.', 400);
    }
  },

  async completeRegistration(draft: RegistrationDraft): Promise<AuthSession> {
    await mockDelay(900);
    const profile = draft.profile;
    if (!profile) {
      throw new ApiError('Profile information is required.', 400);
    }
    const record = {
      id: generateId(draft.role === 'driver' ? 'd' : 'p'),
      role: draft.role,
      name: profile.name,
      email: draft.email,
      phone: profile.phone,
      password: draft.password,
      createdAt: new Date().toISOString(),
    };
    mockData.users.push(record);
    return { token: generateId('tok'), user: asUser(record) };
  },

  async googleSignIn(): Promise<AuthSession> {
    await mockDelay(700);
    return {
      token: generateId('tok'),
      user: {
        id: generateId('p'),
        role: 'passenger',
        name: 'Aiden Reyes',
        email: 'aiden.reyes@gmail.com',
        phone: '0918 000 1122',
        createdAt: new Date().toISOString(),
      },
    };
  },

  async forgotPassword(phone: string): Promise<void> {
    await mockDelay(600);
    const normalized = phone.replace(/[\s-]/g, '');
    const exists = mockData.users.some((u) => u.phone.replace(/[\s-]/g, '') === normalized);
    if (!exists) {
      throw new ApiError('No account found with this phone number.', 404);
    }
    return;
  },

  async demoCredentials(): Promise<{ passenger: string; driver: string; password: string }> {
    await mockDelay(50);
    return {
      passenger: MOCK_CREDENTIALS.passenger.phone,
      driver: MOCK_CREDENTIALS.driver.phone,
      password: MOCK_CREDENTIALS.defaultPassword,
    };
  },

  // ------------------------------------------------------------- passengers
  async getPassengerById(id: string) {
    await mockDelay(250);
    const passenger = mockData.passengers.find((p) => p.id === id);
    if (!passenger) throw new ApiError('Passenger not found.', 404);
    return cloneDeep(passenger);
  },

  async updatePassenger(id: string, patch: Partial<{ name: string; email: string; homeLocation: string; workLocation: string }>) {
    await mockDelay(400);
    const passenger = mockData.passengers.find((p) => p.id === id);
    if (!passenger) throw new ApiError('Passenger not found.', 404);
    Object.assign(passenger, patch);
    return cloneDeep(passenger);
  },

  async addSavedPlace(id: string, place: Omit<SavedPlace, 'id'>) {
    await mockDelay(350);
    const passenger = mockData.passengers.find((p) => p.id === id);
    if (!passenger) throw new ApiError('Passenger not found.', 404);
    passenger.savedPlaces.unshift({ id: generateId('sp'), ...place });
    return cloneDeep(passenger);
  },

  async deleteSavedPlace(id: string, placeId: string) {
    await mockDelay(300);
    const passenger = mockData.passengers.find((p) => p.id === id);
    if (!passenger) throw new ApiError('Passenger not found.', 404);
    passenger.savedPlaces = passenger.savedPlaces.filter((p) => p.id !== placeId);
    return cloneDeep(passenger);
  },

  // ---------------------------------------------------------------- drivers
  async getDriverById(id: string) {
    await mockDelay(250);
    const driver = mockData.drivers.find((d) => d.id === id);
    if (!driver) throw new ApiError('Driver not found.', 404);
    return cloneDeep(driver);
  },

  async updateDriver(id: string, patch: Partial<{ name: string; email: string }>) {
    await mockDelay(400);
    const driver = mockData.drivers.find((d) => d.id === id);
    if (!driver) throw new ApiError('Driver not found.', 404);
    Object.assign(driver, patch);
    return cloneDeep(driver);
  },

  async getNearbyDrivers(from: LatLng, limit = 4): Promise<AvailableDriver[]> {
    await mockDelay(500);
    return mockData.drivers
      .filter((d) => d.availability === 'Available' && d.status === 'Active')
      .map((d) => toAvailableDriver(d, from))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit)
      .map(cloneDeep);
  },

  // --------------------------------------------------------------- bookings
  async createBooking(draft: BookingDraft): Promise<Booking> {
    await mockDelay(700);
    const now = new Date().toISOString();
    const booking: Booking = {
      id: generateId('B'),
      ...draft,
      status: 'Searching Driver',
      bookedAt: now,
      timeline: [
        { id: 'e1', label: 'Booking confirmed', timestamp: now, status: 'done' },
        { id: 'e2', label: 'Searching for drivers', timestamp: now, status: 'current' },
        { id: 'e3', label: 'Driver found', timestamp: now, status: 'pending' },
      ],
      rated: false,
    };
    mockData.bookings.unshift(booking);
    return cloneDeep(booking);
  },

  async getBookingsByPassenger(passengerId: string): Promise<Booking[]> {
    await mockDelay(350);
    return mockData.bookings
      .filter((b) => b.passengerId === passengerId)
      .sort((a, b) => b.bookedAt.localeCompare(a.bookedAt))
      .map(cloneDeep);
  },

  async getBookingById(id: string): Promise<Booking> {
    await mockDelay(250);
    const booking = mockData.bookings.find((b) => b.id === id);
    if (!booking) throw new ApiError('Booking not found.', 404);
    return cloneDeep(booking);
  },

  async cancelBooking(id: string, reason: string): Promise<Booking> {
    await mockDelay(400);
    const booking = mockData.bookings.find((b) => b.id === id);
    if (!booking) throw new ApiError('Booking not found.', 404);
    booking.status = 'Cancelled';
    booking.timeline.push({
      id: `e${booking.timeline.length + 1}`,
      label: 'Trip cancelled',
      description: reason,
      timestamp: new Date().toISOString(),
      status: 'done',
    });
    return cloneDeep(booking);
  },

  async updateBookingStatus(
    id: string,
    status: Booking['status'],
    label: string,
    description?: string,
  ): Promise<Booking> {
    await mockDelay(120);
    const booking = mockData.bookings.find((b) => b.id === id);
    if (!booking) throw new ApiError('Booking not found.', 404);
    booking.status = status;
    const last = booking.timeline[booking.timeline.length - 1];
    booking.timeline.forEach((event) => {
      if (event.status === 'current') event.status = 'done';
    });
    if (last?.label !== label) {
      booking.timeline.push({
        id: `e${booking.timeline.length + 1}`,
        label,
        description,
        timestamp: new Date().toISOString(),
        status: 'current',
      });
    }
    return cloneDeep(booking);
  },

  async markBookingRated(id: string, rating: number): Promise<Booking> {
    await mockDelay(250);
    const booking = mockData.bookings.find((b) => b.id === id);
    if (!booking) throw new ApiError('Booking not found.', 404);
    booking.rated = true;
    booking.ratingValue = rating;
    return cloneDeep(booking);
  },

  // ------------------------------------------------------------------ trips
  async getTripsByDriver(driverId: string): Promise<DriverTripEarning[]> {
    await mockDelay(350);
    return mockData.trips
      .filter((t) => t.driverId === driverId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(cloneDeep);
  },

  async addTripEarning(
    record: Omit<DriverTripEarning, 'id'> & { driverId: string; pickup?: string; dropoff?: string },
  ): Promise<DriverTripEarning> {
    await mockDelay(250);
    const trip: typeof mockData.trips[number] = {
      id: generateId('T'),
      ...record,
      pickup: record.pickup ?? '',
      dropoff: record.dropoff ?? '',
    };
    mockData.trips.unshift(trip);
    return cloneDeep(trip);
  },

  async getDriverEarnings(driverId: string): Promise<EarningsReport> {
    await mockDelay(450);
    const driverTrips = mockData.trips.filter((t) => t.driverId === driverId);

    const aggregate = (trips: DriverTripEarning[]): DriverEarningBreakdown => {
      const total = (key: 'fare' | 'commission' | 'net' | 'bonus') =>
        trips.reduce((sum, t) => sum + t[key], 0);
      const ratings = trips.filter((t) => t.rating > 0).map((t) => t.rating);
      return {
        grossEarnings: Math.round(total('fare')),
        commission: Math.round(total('commission')),
        netEarnings: Math.round(total('net')),
        bonuses: Math.round(total('bonus')),
        trips: trips.length,
        distanceKm: Math.round(trips.reduce((sum, t) => sum + t.distanceKm, 0) * 10) / 10,
        rating: ratings.length
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : driverTrips[0]?.rating ?? 0,
      };
    };

    const today = '2026-08-07';
    const weekStart = weekDays().start.toISOString().slice(0, 10);
    const monthStart = '2026-08-01';
    const isDate = (t: DriverTripEarning, startIso: string) => t.date.slice(0, 10) >= startIso;

    const todayTrips = driverTrips.filter((t) => t.date.slice(0, 10) === today);
    const weekTrips = driverTrips.filter((t) => isDate(t, weekStart));
    const monthTrips = driverTrips.filter((t) => isDate(t, monthStart));

    const weeklyChart: ChartPoint[] = weekDays().labels.map((label, index) => {
      const day = new Date(weekDays().start);
      day.setDate(day.getDate() + index);
      const iso = day.toISOString().slice(0, 10);
      const net = weekTrips
        .filter((t) => t.date.slice(0, 10) === iso)
        .reduce((sum, t) => sum + t.net, 0);
      return { label, value: net };
    });

    const monthlyChart: ChartPoint[] = monthSeries(driverId).months.map((month, index) => {
      const iso = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      const actual = driverTrips
        .filter((t) => t.date.slice(0, 7) === iso)
        .reduce((sum, t) => sum + t.net, 0);
      const seed = driverId.length * 31 + index * 97 + 13;
      const value = actual > 0 ? actual : Math.round(4200 + seeded(seed) * 3400);
      return { label: monthSeries(driverId).labels[index], value };
    });

    return {
      today: aggregate(todayTrips),
      week: aggregate(weekTrips),
      month: aggregate(monthTrips),
      weeklyChart,
      monthlyChart,
      recentTrips: cloneDeep(weekTrips.slice(0, 8)),
    };
  },

  // ---------------------------------------------------------------- requests
  async getPendingRideRequests(driverId: string): Promise<RideRequest[]> {
    await mockDelay(450);
    const driver = mockData.drivers.find((d) => d.id === driverId);
    if (!driver) return [];
    const anchor = driver.currentLocation;
    const candidates = [...mockData.passengers]
      .filter((p) => p.status === 'Active')
      .map((p) => {
        const home = LANDMARKS.find((l) => l.name === p.homeLocation) ?? LANDMARKS[0];
        const work = LANDMARKS.find((l) => l.name === p.workLocation) ?? LANDMARKS[1];
        const distanceKm = Math.max(1, Math.round(haversineKm(anchor, home.coordinates) * 10) / 10);
        const fare = computeFare(home.coordinates, work.coordinates);
        const now = new Date();
        const expires = new Date(now.getTime() + 30 * 1000);
        return {
          id: generateId('req'),
          bookingId: generateId('B'),
          passengerId: p.id,
          passengerName: p.name,
          passengerPhone: p.phone,
          passengerRating: p.rating,
          passengerTrips: p.totalBookings,
          pickup: home.name,
          pickupCoordinates: home.coordinates,
          dropoff: work.name,
          dropoffCoordinates: work.coordinates,
          distanceKm,
          durationMin: estimateDurationMin(distanceKm),
          estimatedFare: fare.total,
          paymentMethod: p.preferredPayment,
          requestedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
    return candidates;
  },

  // --------------------------------------------------------------- payments
  async getPaymentMethods(userId: string): Promise<PaymentMethodInfo[]> {
    await mockDelay(300);
    return mockData.payments.paymentMethods.filter((m) => m.userId === userId).map(cloneDeep);
  },

  async addPaymentMethod(
    userId: string,
    method: Omit<PaymentMethodInfo, 'id' | 'userId'>,
  ): Promise<PaymentMethodInfo[]> {
    await mockDelay(450);
    mockData.payments.paymentMethods.push({ ...method, id: generateId('pm'), userId });
    return mockData.payments.paymentMethods.filter((m) => m.userId === userId).map(cloneDeep);
  },

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<PaymentMethodInfo[]> {
    await mockDelay(300);
    mockData.payments.paymentMethods.forEach((m) => {
      if (m.userId === userId) m.isDefault = m.id === methodId;
    });
    return mockData.payments.paymentMethods.filter((m) => m.userId === userId).map(cloneDeep);
  },

  async getWallet(userId: string): Promise<WalletAccount> {
    await mockDelay(250);
    const wallet = mockData.payments.wallets.find((w) => w.userId === userId);
    return cloneDeep(wallet ?? { userId, balance: 0, currency: 'PHP' });
  },

  async topUpWallet(userId: string, amount: number): Promise<WalletAccount> {
    await mockDelay(500);
    const existing = mockData.payments.wallets.find((w) => w.userId === userId);
    let wallet: WalletAccount;
    if (existing) {
      wallet = existing;
    } else {
      wallet = { userId, balance: 0, currency: 'PHP' };
      mockData.payments.wallets.push(wallet);
    }
    wallet.balance += amount;
    mockData.payments.transactions.unshift({
      id: generateId('tx'),
      userId,
      reference: generateId('HAT'),
      type: 'top-up',
      method: 'Wallet',
      amount,
      status: 'Success',
      date: new Date().toISOString(),
      description: 'Wallet top-up',
    });
    return cloneDeep(wallet);
  },

  async getTransactions(userId: string): Promise<PaymentTransaction[]> {
    await mockDelay(300);
    return mockData.payments.transactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(cloneDeep);
  },

  async topUpOptions(): Promise<TopUpOption[]> {
    await mockDelay(100);
    return [
      { amount: 100, bonus: 0 },
      { amount: 200, bonus: 10 },
      { amount: 500, bonus: 50 },
      { amount: 1000, bonus: 120 },
    ];
  },

  // ---------------------------------------------------------- notifications
  async getNotifications(userId: string): Promise<AppNotification[]> {
    await mockDelay(300);
    return mockData.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(cloneDeep);
  },

  async markNotificationRead(id: string): Promise<void> {
    await mockDelay(150);
    const notification = mockData.notifications.find((n) => n.id === id);
    if (notification) notification.read = true;
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    await mockDelay(250);
    mockData.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
  },

  // ---------------------------------------------------------------- reviews
  async getReviewsForTarget(targetId: string): Promise<Review[]> {
    await mockDelay(350);
    return mockData.reviews
      .filter((r) => r.targetId === targetId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(cloneDeep);
  },

  async submitReview(submission: ReviewSubmission): Promise<Review> {
    await mockDelay(500);
    const review: Review = {
      id: generateId('r'),
      authorName: submission.authorName,
      authorRole: submission.authorRole,
      targetId: submission.targetId,
      targetName: submission.targetName,
      rating: submission.rating,
      comment: submission.comment,
      bookingId: submission.bookingId,
      date: new Date().toISOString(),
    };
    mockData.reviews.unshift(review);
    return cloneDeep(review);
  },

  // --------------------------------------------------------------- vehicles
  async getVehicleByDriverId(driverId: string): Promise<Vehicle> {
    await mockDelay(300);
    const vehicle = mockData.vehicles.find((v) => v.driverId === driverId);
    if (!vehicle) throw new ApiError('Vehicle not found.', 404);
    return cloneDeep(vehicle);
  },

  async getDriverDocuments(driverId: string): Promise<{ label: string; description: string; info: DocumentInfo }[]> {
    await mockDelay(300);
    const driver = mockData.drivers.find((d) => d.id === driverId);
    if (!driver) throw new ApiError('Driver not found.', 404);
    return [
      { label: "Driver's License", description: 'Professional / Non-professional license', info: driver.documents.license },
      { label: 'ORCR', description: 'Official receipt and certificate of registration', info: driver.documents.orcr },
      { label: 'NBI Clearance', description: 'National Bureau of Investigation clearance', info: driver.documents.nbi },
    ];
  },
};

export type FareOptions = { fare: FareBreakdown };
