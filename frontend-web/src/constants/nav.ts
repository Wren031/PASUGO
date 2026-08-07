import type { IconType } from 'react-icons';
import { FiActivity, FiAlertCircle, FiBarChart2, FiBell, FiBookOpen, FiCreditCard, FiDollarSign, FiFileText, FiGrid, FiMap, FiMapPin, FiPercent, FiSettings, FiShield, FiStar, FiTag, FiTruck, FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';

export interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const SIDEBAR_NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', path: '/admin', icon: FiGrid }],
  },
  {
    label: 'User Management',
    items: [
      { label: 'Passengers', path: '/admin/passengers', icon: FiUsers },
      { label: 'Drivers', path: '/admin/drivers', icon: FiUser },
      { label: 'Driver Verification', path: '/admin/driver-verification', icon: FiUserCheck },
      { label: 'Passenger Verification', path: '/admin/passenger-verification', icon: FiShield },
    ],
  },
  {
    label: 'Booking Management',
    items: [
      { label: 'Bookings', path: '/admin/bookings', icon: FiBookOpen },
      { label: 'Live Trip Monitoring', path: '/admin/live-trips', icon: FiMapPin },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Vehicle Management', path: '/admin/vehicles', icon: FiTruck },
      { label: 'Payments', path: '/admin/payments', icon: FiCreditCard },
      { label: 'Earnings & Finance', path: '/admin/earnings', icon: FiDollarSign },
      { label: 'Ratings & Reviews', path: '/admin/reviews', icon: FiStar },
      { label: 'Complaints', path: '/admin/complaints', icon: FiAlertCircle },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Notifications', path: '/admin/notifications', icon: FiBell },
      { label: 'Promotions', path: '/admin/promotions', icon: FiTag },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { label: 'Service Areas', path: '/admin/service-areas', icon: FiMap },
      { label: 'Fare Management', path: '/admin/fare-management', icon: FiPercent },
      { label: 'Reports & Analytics', path: '/admin/reports', icon: FiBarChart2 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Admin Management', path: '/admin/admin-management', icon: FiShield },
      { label: 'System Settings', path: '/admin/settings', icon: FiSettings },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: FiFileText },
    ],
  },
];

export const SIDEBAR_BADGES: Record<string, number> = {
  '/admin/driver-verification': 6,
  '/admin/passenger-verification': 3,
  '/admin/live-trips': 5,
  '/admin/complaints': 4,
};
