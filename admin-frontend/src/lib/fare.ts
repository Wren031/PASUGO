import type { FareConfig, FarePeriod, FareQuote, GeoPoint, VehicleType } from "@/lib/types"

export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function distanceKm(pickup: GeoPoint, dropoff: GeoPoint): number {
  return Math.round(Math.max(haversineKm(pickup, dropoff), 0.5) * 10) / 10
}

export function isEveningHour(hour: number, config: Pick<FareConfig, "evening">): boolean {
  const { startHour, endHour } = config.evening
  return startHour <= endHour
    ? hour >= startHour && hour < endHour
    : hour >= startHour || hour < endHour
}

export function quoteFare(
  config: FareConfig,
  vehicle: VehicleType,
  km: number,
  period: FarePeriod = "standard"
): FareQuote {
  const rate = config.vehicle[vehicle]
  const base = rate.base
  const distanceCost = Math.round(Math.max(km, 0) * rate.perKm)
  const subtotal = base + distanceCost
  const eveningAdjustment =
    period === "evening" ? Math.round(subtotal * (config.evening.multiplier - 1)) : 0
  const surgeAdjustment = Math.round((subtotal + eveningAdjustment) * (config.surgeMultiplier - 1))
  const afterSurge = subtotal + eveningAdjustment + surgeAdjustment
  const minimumTopUp = Math.max(config.minFare - afterSurge, 0)
  const bookingFee = config.bookingFee
  const total = Math.round(afterSurge + minimumTopUp + bookingFee)

  return {
    vehicle,
    period,
    distanceKm: Math.round(Math.max(km, 0) * 10) / 10,
    base,
    distanceCost,
    subtotal,
    eveningAdjustment,
    surgeAdjustment,
    minimumTopUp,
    bookingFee,
    total,
  }
}
