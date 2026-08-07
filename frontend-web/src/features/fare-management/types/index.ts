export interface FareSettings {
  baseFare: number;
  pricePerKm: number;
  pricePerMinute: number;
  bookingFee: number;
  surgeMultiplier: number;
  surgeHours: string;
  holidayRate: number;
  nightRate: number;
  nightHours: string;
  minimumFare: number;
}

export interface FareEstimateInput {
  distanceKm: number;
  durationMin: number;
  night: boolean;
  holiday: boolean;
  surge: boolean;
}

export interface FareEstimate {
  baseFare: number;
  distanceCharge: number;
  timeCharge: number;
  bookingFee: number;
  adjustments: { label: string; amount: number }[];
  total: number;
}
