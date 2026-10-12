import type { FareConfig } from "@/lib/types"

export const DEFAULT_FARE_CONFIG: FareConfig = {
  vehicle: {
    motor: { base: 40, perKm: 12 },
  },
  bookingFee: 15,
  minFare: 50,
  surgeMultiplier: 1,
  evening: {
    multiplier: 1.25,
    startHour: 18,
    endHour: 6,
  },
}

export const SURGE_MIN = 1
export const SURGE_MAX = 3
export const SURGE_STEP = 0.1

export const EVENING_MIN = 1
export const EVENING_MAX = 3
export const EVENING_STEP = 0.05
