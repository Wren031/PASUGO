import { Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/app/store/auth-store';
import AuthLayout from '@/app/layouts/AuthLayout';
import LandingPage from '@/features/landing/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import PassengersPage from '@/features/passengers/pages/PassengersPage';
import PassengerProfilePage from '@/features/passengers/pages/PassengerProfilePage';
import DriversPage from '@/features/drivers/pages/DriversPage';
import DriverProfilePage from '@/features/drivers/pages/DriverProfilePage';
import DriverVerificationPage from '@/features/driver-verification/pages/DriverVerificationPage';
import PassengerVerificationPage from '@/features/passenger-verification/pages/PassengerVerificationPage';
import BookingsPage from '@/features/bookings/pages/BookingsPage';
import BookingDetailsPage from '@/features/bookings/pages/BookingDetailsPage';
import LiveTripsPage from '@/features/live-trips/pages/LiveTripsPage';
import VehiclesPage from '@/features/vehicles/pages/VehiclesPage';
import PaymentsPage from '@/features/payments/pages/PaymentsPage';
import EarningsPage from '@/features/earnings/pages/EarningsPage';
import ReviewsPage from '@/features/reviews/pages/ReviewsPage';
import ComplaintsPage from '@/features/complaints/pages/ComplaintsPage';
import NotificationsPage from '@/features/notifications/pages/NotificationsPage';
import PromotionsPage from '@/features/promotions/pages/PromotionsPage';
import ServiceAreasPage from '@/features/service-areas/pages/ServiceAreasPage';
import FareManagementPage from '@/features/fare-management/pages/FareManagementPage';
import ReportsPage from '@/features/reports/pages/ReportsPage';
import AdminManagementPage from '@/features/admin-management/pages/AdminManagementPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import AuditLogsPage from '@/features/audit-logs/pages/AuditLogsPage';
import AdminLayout from '@/app/layouts/AdminLayout';
import RequireAuth from '@/app/router/RequireAuth';
import PageNotFound from '@/components/common/PageNotFound';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'passengers', element: <PassengersPage /> },
      { path: 'passengers/:id', element: <PassengerProfilePage /> },
      { path: 'drivers', element: <DriversPage /> },
      { path: 'drivers/:id', element: <DriverProfilePage /> },
      { path: 'driver-verification', element: <DriverVerificationPage /> },
      { path: 'passenger-verification', element: <PassengerVerificationPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'bookings/:id', element: <BookingDetailsPage /> },
      { path: 'live-trips', element: <LiveTripsPage /> },
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'earnings', element: <EarningsPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'complaints', element: <ComplaintsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'promotions', element: <PromotionsPage /> },
      { path: 'service-areas', element: <ServiceAreasPage /> },
      { path: 'fare-management', element: <FareManagementPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'admin-management', element: <AdminManagementPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <PageNotFound
          title="Page not found"
          description="The page you are looking for does not exist or has been moved."
          action={
            <NavLink
              to="/"
              className="inline-flex h-10 items-center rounded-lg bg-primary-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Go back home
            </NavLink>
          }
        />
      </div>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
