import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export function useDashboardStats() {
  return useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardService.getStats });
}

export function useBookingAnalytics() {
  return useQuery({ queryKey: ['dashboard', 'bookings'], queryFn: dashboardService.getBookingAnalytics });
}

export function useRevenueTrend() {
  return useQuery({ queryKey: ['dashboard', 'revenue'], queryFn: dashboardService.getRevenueTrend });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: dashboardService.getRecentActivities,
    refetchInterval: 30_000,
  });
}

export function useLiveDrivers() {
  return useQuery({
    queryKey: ['dashboard', 'live-drivers'],
    queryFn: dashboardService.getLiveDrivers,
    refetchInterval: 15_000,
  });
}

export function useTopDrivers() {
  return useQuery({ queryKey: ['dashboard', 'top-drivers'], queryFn: dashboardService.getTopDrivers });
}

export function useLatestBookings() {
  return useQuery({ queryKey: ['dashboard', 'latest-bookings'], queryFn: dashboardService.getLatestBookings });
}
