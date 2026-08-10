import { APP } from '@/constants/app';

const symbol = APP.currencySymbol;

export function formatCurrency(amount: number, decimals = 0): string {
  return `${symbol} ${amount.toLocaleString('en-PH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1000) {
    return `${symbol} ${(amount / 1000).toFixed(1)}k`;
  }
  return formatCurrency(amount);
}

export function formatDistance(km: number): string {
  if (km >= 10) return `${km.toFixed(1)} km`;
  return `${km.toFixed(1)} km`;
}

export function formatDuration(min: number): string {
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function formatPhone(phone: string): string {
  return phone;
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function firstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}
