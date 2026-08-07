import { mockDelay } from '@/utils/mock';
import type { FareEstimate, FareEstimateInput, FareSettings } from '../types';
import { defaultFareSettings } from '../mock/data';

let currentSettings: FareSettings = { ...defaultFareSettings };

export const fareService = {
  async getSettings(): Promise<FareSettings> {
    await mockDelay(300);
    return { ...currentSettings };
  },

  async updateSettings(settings: FareSettings): Promise<FareSettings> {
    await mockDelay(500);
    currentSettings = { ...settings };
    return { ...currentSettings };
  },

  async estimateFare(input: FareEstimateInput): Promise<FareEstimate> {
    await mockDelay(400);
    const settings = currentSettings;
    const distanceCharge = input.distanceKm * settings.pricePerKm;
    const timeCharge = input.durationMin * settings.pricePerMinute;
    let subtotal = settings.baseFare + distanceCharge + timeCharge + settings.bookingFee;
    const adjustments: { label: string; amount: number }[] = [];

    if (input.night) {
      const extra = subtotal * (settings.nightRate - 1);
      adjustments.push({ label: `Night rate (${settings.nightRate}x)`, amount: extra });
      subtotal += extra;
    }
    if (input.holiday) {
      const extra = subtotal * (settings.holidayRate - 1);
      adjustments.push({ label: `Holiday rate (${settings.holidayRate}x)`, amount: extra });
      subtotal += extra;
    }
    if (input.surge) {
      const extra = subtotal * (settings.surgeMultiplier - 1);
      adjustments.push({ label: `Surge pricing (${settings.surgeMultiplier}x)`, amount: extra });
      subtotal += extra;
    }

    const total = Math.max(settings.minimumFare, Math.round(subtotal));

    return {
      baseFare: settings.baseFare,
      distanceCharge,
      timeCharge,
      bookingFee: settings.bookingFee,
      adjustments,
      total,
    };
  },
};
