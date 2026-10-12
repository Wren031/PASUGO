import type { FareConfig, FarePeriod, FareQuote, VehicleType } from "@/lib/types"
import { DEFAULT_FARE_CONFIG, EVENING_MAX, EVENING_MIN } from "@/data/mock/fare"
import { quoteFare } from "@/lib/fare"
import { delay, failure } from "./client"

function validate(config: FareConfig): string | null {
  for (const vehicle of ["motor"] as VehicleType[]) {
    const rate = config.vehicle[vehicle]
    if (!Number.isFinite(rate.base) || rate.base < 0) {
      return `Base fare for ${vehicle} must be zero or greater.`
    }
    if (!Number.isFinite(rate.perKm) || rate.perKm < 0) {
      return `Per-km rate for ${vehicle} must be zero or greater.`
    }
  }
  if (!Number.isFinite(config.bookingFee) || config.bookingFee < 0) {
    return "Booking fee must be zero or greater."
  }
  if (!Number.isFinite(config.minFare) || config.minFare < 0) {
    return "Minimum fare must be zero or greater."
  }
  if (!Number.isFinite(config.surgeMultiplier) || config.surgeMultiplier < 1 || config.surgeMultiplier > 3) {
    return "Surge multiplier must be between 1.0 and 3.0."
  }
  if (
    !Number.isFinite(config.evening.multiplier) ||
    config.evening.multiplier < EVENING_MIN ||
    config.evening.multiplier > EVENING_MAX
  ) {
    return `Evening multiplier must be between ${EVENING_MIN.toFixed(2)} and ${EVENING_MAX.toFixed(2)}.`
  }
  const { startHour, endHour } = config.evening
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    startHour > 23 ||
    endHour < 0 ||
    endHour > 23
  ) {
    return "Evening hours must be whole numbers between 0 and 23."
  }
  return null
}

let currentConfig: FareConfig = structuredClone(DEFAULT_FARE_CONFIG)

export const fareService = {
  async getRates(): Promise<FareConfig> {
    return delay(currentConfig)
  },

  async updateRates(patch: Partial<FareConfig>): Promise<FareConfig> {
    const next: FareConfig = {
      vehicle: { ...currentConfig.vehicle, ...(patch.vehicle ?? {}) },
      bookingFee: patch.bookingFee ?? currentConfig.bookingFee,
      minFare: patch.minFare ?? currentConfig.minFare,
      surgeMultiplier: patch.surgeMultiplier ?? currentConfig.surgeMultiplier,
      evening: { ...currentConfig.evening, ...(patch.evening ?? {}) },
    }
    const error = validate(next)
    if (error) return failure(error)
    currentConfig = next
    return delay(currentConfig, 300)
  },

  async resetRates(): Promise<FareConfig> {
    currentConfig = structuredClone(DEFAULT_FARE_CONFIG)
    return delay(currentConfig, 200)
  },

  async quote(vehicle: VehicleType, km: number, period: FarePeriod = "standard"): Promise<FareQuote> {
    if (!Number.isFinite(km) || km < 0) return failure("Distance must be zero or greater.")
    return delay(quoteFare(currentConfig, vehicle, km, period), 150)
  },
}
