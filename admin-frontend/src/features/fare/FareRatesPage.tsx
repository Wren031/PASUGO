import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  Banknote,
  Bike,
  CircleAlert,
  Clock,
  Loader2,
  MapPin,
  Moon,
  Percent,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/PageHeader"
import { fareService } from "@/lib/services"
import { distanceKm, quoteFare } from "@/lib/fare"
import { peso, pesoPrecise } from "@/lib/format"
import type {
  EveningRate,
  FareConfig,
  FarePeriod,
  VehicleRate,
  VehicleType,
} from "@/lib/types"
import { LOCATIONS } from "@/data/mock/locations"
import {
  EVENING_MAX,
  EVENING_MIN,
  EVENING_STEP,
  SURGE_MAX,
  SURGE_MIN,
  SURGE_STEP,
} from "@/data/mock/fare"

// ---------- metadata & helpers ----------

const VEHICLE_META: Record<
  VehicleType,
  { label: string; icon: React.ComponentType<{ className?: string }>; sampleKm: number; sampleNote: string }
> = {
  motor: { label: "Motorcycle", icon: Bike, sampleKm: 3, sampleNote: "Short city hop" },
}

const PERIOD_META: Record<FarePeriod, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  standard: { label: "Daytime", icon: Sun },
  evening: { label: "Evening", icon: Moon },
}

const SURGE_LABEL = (value: number) =>
  value <= 1
    ? "No surge (1.0×)"
    : value < 1.5
      ? `Low demand (${value.toFixed(1)}×)`
      : value < 2.2
        ? `Peak (${value.toFixed(1)}×)`
        : `High surge (${value.toFixed(1)}×)`

const EVENING_LABEL = (value: number) =>
  value <= 1
    ? "Not applied (1.00×)"
    : `+${Math.round((value - 1) * 100)}% on fare`

const fmtHour = (hour: number) => `${String(hour).padStart(2, "0")}:00`

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour)

function parseNum(value: string): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

// ---------- small presentational pieces ----------

function NumberField({
  id,
  label,
  value,
  onChange,
  min = 0,
  hint,
  prefix,
}: {
  id: string
  label: string
  value: number
  onChange: (n: number) => void
  min?: number
  hint?: string
  prefix?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type="number"
          min={min}
          step="1"
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(parseNum(e.target.value))}
          className={prefix ? "pl-6" : undefined}
        />
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

function PeriodToggle({
  value,
  onChange,
}: {
  value: FarePeriod
  onChange: (p: FarePeriod) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/70 p-1" role="tablist" aria-label="Time of day">
      {(Object.keys(PERIOD_META) as FarePeriod[]).map((period) => {
        const meta = PERIOD_META[period]
        const Icon = meta.icon
        const active = value === period
        return (
          <button
            key={period}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(period)}
            className={
              active
                ? "inline-flex items-center justify-center gap-1.5 rounded-md bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm"
                : "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            }
          >
            <Icon className="size-3.5" />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}

// ---------- page ----------

export default function FareRatesPage() {
  const [saved, setSaved] = useState<FareConfig | null>(null)
  const [draft, setDraft] = useState<FareConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [resetting, setResetting] = useState(false)

  const [calcVehicle, setCalcVehicle] = useState<VehicleType>("motor")
  const [calcPeriod, setCalcPeriod] = useState<FarePeriod>("standard")
  const [pickupIdx, setPickupIdx] = useState<string>("0")
  const [dropoffIdx, setDropoffIdx] = useState<string>("6")

  useEffect(() => {
    fareService.getRates().then((config) => {
      setSaved(config)
      setDraft(config)
      setLoading(false)
    })
  }, [])

  const dirty = useMemo(
    () => !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved]
  )

  const invalid = useMemo(() => {
    if (!draft) return false
    for (const v of ["motor"] as VehicleType[]) {
      const r = draft.vehicle[v]
      if (r.base < 0 || r.perKm < 0 || !Number.isFinite(r.base) || !Number.isFinite(r.perKm)) return true
    }
    return (
      draft.bookingFee < 0 ||
      draft.minFare < 0 ||
      draft.surgeMultiplier < SURGE_MIN ||
      draft.surgeMultiplier > SURGE_MAX ||
      draft.evening.multiplier < EVENING_MIN ||
      draft.evening.multiplier > EVENING_MAX ||
      draft.evening.startHour < 0 ||
      draft.evening.startHour > 23 ||
      draft.evening.endHour < 0 ||
      draft.evening.endHour > 23
    )
  }, [draft])

  const quote = useMemo(() => {
    if (!draft) return null
    const pickup = LOCATIONS[Number(pickupIdx)]!
    const dropoff = LOCATIONS[Number(dropoffIdx)]!
    const km = distanceKm(pickup, dropoff)
    const result = quoteFare(draft, calcVehicle, km, calcPeriod)
    const dayReference = quoteFare(draft, calcVehicle, km, "standard")
    return { pickup, dropoff, km, result, dayReference }
  }, [draft, calcVehicle, calcPeriod, pickupIdx, dropoffIdx])

  const patch = (p: Partial<FareConfig>) => setDraft((prev) => (prev ? { ...prev, ...p } : prev))
  const patchVehicle = (v: VehicleType, p: Partial<VehicleRate>) =>
    setDraft((prev) =>
      prev ? { ...prev, vehicle: { ...prev.vehicle, [v]: { ...prev.vehicle[v], ...p } } } : prev
    )
  const patchEvening = (p: Partial<EveningRate>) =>
    setDraft((prev) => (prev ? { ...prev, evening: { ...prev.evening, ...p } } : prev))

  const handleSave = async () => {
    if (!draft) return
    setBusy(true)
    try {
      const next = await fareService.updateRates(draft)
      setSaved(next)
      setDraft(next)
      toast.success("Fare rates saved. New bookings will use these rates.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save fare rates.")
    } finally {
      setBusy(false)
    }
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      const next = await fareService.resetRates()
      setSaved(next)
      setDraft(next)
      toast.success("Fare rates restored to defaults.")
    } finally {
      setResetting(false)
    }
  }

  if (loading || !draft) {
    return (
      <div className="space-y-6">
        <PageHeader title="Fare Rates" description="Loading rate card…" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-lg border bg-card lg:col-span-2" />
          <div className="h-72 animate-pulse rounded-lg border bg-card" />
        </div>
      </div>
    )
  }

  const daySample = quoteFare(draft, "motor", VEHICLE_META.motor.sampleKm, "standard")
  const eveningSample = quoteFare(draft, "motor", VEHICLE_META.motor.sampleKm, "evening")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fare Rates"
        description="Set the platform rate card — base fares, per-km rates, global fees, surge, and the evening surcharge."
        actions={
          <>
            {dirty && (
              <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                Unsaved changes
              </Badge>
            )}
            <Button variant="outline" onClick={handleReset} disabled={busy || resetting}>
              {resetting ? <Loader2 className="animate-spin" /> : <RotateCcw />} Reset defaults
            </Button>
            <Button onClick={handleSave} disabled={!dirty || invalid || busy}>
              {busy ? <Loader2 className="animate-spin" /> : <Save />} Save rates
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ============ left column ============ */}
        <div className="space-y-4 lg:col-span-2">
          {/* Vehicle rates */}
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bike className="size-4" />
                  </span>
                  Motorcycle rates
                </CardTitle>
                <CardDescription>
                  Base and per-kilometer rates applied to every motorcycle ride.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0">
                Only vehicle class
              </Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="motor-base"
                  label="Base fare"
                  hint="Flat charge per trip."
                  prefix="₱"
                  value={draft.vehicle.motor.base}
                  onChange={(n) => patchVehicle("motor", { base: n })}
                />
                <NumberField
                  id="motor-perkm"
                  label="Per kilometer"
                  hint="Multiplied by trip distance."
                  prefix="₱"
                  value={draft.vehicle.motor.perKm}
                  onChange={(n) => patchVehicle("motor", { perKm: n })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Sample fares · {VEHICLE_META.motor.sampleKm} km {VEHICLE_META.motor.sampleNote}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Sun className="size-3.5" /> Daytime
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{peso(daySample.total)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3.5 py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Moon className="size-3.5" /> Evening
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{peso(eveningSample.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global fees & surge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="size-4 text-muted-foreground" /> Global fees & surge
              </CardTitle>
              <CardDescription>
                Applied on top of the distance fare for every trip, regardless of time of day.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberField
                  id="booking-fee"
                  label="Booking fee (flat per trip)"
                  prefix="₱"
                  value={draft.bookingFee}
                  onChange={(n) => patch({ bookingFee: n })}
                />
                <NumberField
                  id="min-fare"
                  label="Minimum fare (per trip)"
                  prefix="₱"
                  value={draft.minFare}
                  onChange={(n) => patch({ minFare: n })}
                  hint="Trips below this amount are topped up."
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="surge" className="inline-flex items-center gap-1.5 text-sm">
                    <Percent className="size-4 text-muted-foreground" /> Surge multiplier
                  </Label>
                  <Badge variant="secondary" className="font-semibold">
                    {SURGE_LABEL(draft.surgeMultiplier)}
                  </Badge>
                </div>
                <Slider
                  id="surge"
                  value={[draft.surgeMultiplier]}
                  min={SURGE_MIN}
                  max={SURGE_MAX}
                  step={SURGE_STEP}
                  onValueChange={(value) => patch({ surgeMultiplier: Number(value) })}
                  className="py-2"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>1.0× standard</span>
                  <span>2.0× peak</span>
                  <span>3.0× max</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Surge multiplies the base + distance subtotal (including any evening surcharge).
                  Minimum fare is enforced after surge.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Evening rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Moon className="size-4 text-indigo-500" /> Evening rate
              </CardTitle>
              <CardDescription>
                A percentage surcharge applied to trips booked during evening hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="evening" className="inline-flex items-center gap-1.5 text-sm">
                    <Percent className="size-4 text-muted-foreground" /> Evening multiplier
                  </Label>
                  <Badge variant="secondary" className="font-semibold">
                    {EVENING_LABEL(draft.evening.multiplier)}
                  </Badge>
                </div>
                <Slider
                  id="evening"
                  value={[draft.evening.multiplier]}
                  min={EVENING_MIN}
                  max={EVENING_MAX}
                  step={EVENING_STEP}
                  onValueChange={(value) => patchEvening({ multiplier: Number(value) })}
                  className="py-2"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>1.00× standard</span>
                  <span>2.0× +100%</span>
                  <span>3.0× +200%</span>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-xs text-muted-foreground">Active hours</Label>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <Clock className="size-3.5 text-muted-foreground" />
                  Applies from{" "}
                  <span className="font-semibold tabular-nums">{fmtHour(draft.evening.startHour)}</span>
                  {" "}until{" "}
                  <span className="font-semibold tabular-nums">{fmtHour(draft.evening.endHour)}</span>
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Starts at</Label>
                    <Select
                      value={String(draft.evening.startHour)}
                      onValueChange={(v) => v && patchEvening({ startHour: Number(v) })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOUR_OPTIONS.map((hour) => (
                          <SelectItem key={hour} value={String(hour)}>
                            {fmtHour(hour)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Ends at</Label>
                    <Select
                      value={String(draft.evening.endHour)}
                      onValueChange={(v) => v && patchEvening({ endHour: Number(v) })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOUR_OPTIONS.map((hour) => (
                          <SelectItem key={hour} value={String(hour)}>
                            {fmtHour(hour)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {draft.evening.startHour > draft.evening.endHour
                    ? "Crosses midnight — trips between the start hour and late night, and again in the early morning, get the evening rate."
                    : "Trips during this window get the evening rate."}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              Existing bookings keep the fare recorded at booking time. Rates saved here apply to the
              fare calculator, future booking estimates, and generated reports — ready to be backed by a real API via{" "}
              <span className="font-medium text-foreground">fareService</span>.
            </p>
          </div>
        </div>

        {/* ============ calculator sidebar ============ */}
        <Card className="h-fit lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-primary" /> Fare calculator
            </CardTitle>
            <CardDescription>Live preview of what passengers pay.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Vehicle</Label>
                <Select
                  value={calcVehicle}
                  onValueChange={(v) => v && setCalcVehicle(v as VehicleType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["motor"] as VehicleType[]).map((v) => (
                      <SelectItem key={v} value={v}>
                        {VEHICLE_META[v].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Time of day</Label>
                <PeriodToggle value={calcPeriod} onChange={setCalcPeriod} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-emerald-500" /> Pickup
                </Label>
                <Select value={pickupIdx} onValueChange={(v) => v && setPickupIdx(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l, i) => (
                      <SelectItem key={l.name} value={String(i)}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>

              <div className="space-y-1.5">
                <Label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" /> Destination
                </Label>
                <Select value={dropoffIdx} onValueChange={(v) => v && setDropoffIdx(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((l, i) => (
                      <SelectItem key={l.name} value={String(i)} disabled={String(i) === pickupIdx}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {quote && (
              <>
                <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-semibold tabular-nums">{quote.km.toFixed(1)} km</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base fare</span>
                    <span className="tabular-nums">{pesoPrecise(quote.result.base)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Distance ({quote.km.toFixed(1)} km × {peso(draft.vehicle[calcVehicle].perKm)})
                    </span>
                    <span className="tabular-nums">{pesoPrecise(quote.result.distanceCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{pesoPrecise(quote.result.subtotal)}</span>
                  </div>
                  {quote.result.eveningAdjustment !== 0 && (
                    <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                      <span className="inline-flex items-center gap-1">
                        <Moon className="size-3.5" /> Evening rate (
                        {draft.evening.multiplier.toFixed(2)}×)
                      </span>
                      <span className="tabular-nums">+{pesoPrecise(quote.result.eveningAdjustment)}</span>
                    </div>
                  )}
                  {quote.result.surgeAdjustment !== 0 && (
                    <div className="flex justify-between text-amber-600 dark:text-amber-400">
                      <span>Surge ({draft.surgeMultiplier.toFixed(1)}×)</span>
                      <span className="tabular-nums">
                        +{pesoPrecise(quote.result.surgeAdjustment)}
                      </span>
                    </div>
                  )}
                  {quote.result.minimumTopUp > 0 && (
                    <div className="flex justify-between text-sky-600 dark:text-sky-400">
                      <span>Minimum fare top-up</span>
                      <span className="tabular-nums">
                        +{pesoPrecise(quote.result.minimumTopUp)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking fee</span>
                    <span className="tabular-nums">{pesoPrecise(quote.result.bookingFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total fare</span>
                    <span className="text-lg font-bold tabular-nums">
                      {pesoPrecise(quote.result.total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border bg-muted/40 px-3 py-2.5">
                  <p className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>
                      {quote.pickup.name} → {quote.dropoff.name}
                    </span>
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      {quote.result.period === "evening" ? (
                        <>
                          <Moon className="size-3" /> Evening
                        </>
                      ) : (
                        <>
                          <Sun className="size-3" /> Daytime
                        </>
                      )}
                    </span>
                  </p>
                  {quote.result.period === "evening" && quote.result.eveningAdjustment !== 0 && (
                    <p className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>vs daytime fare</span>
                      <span className="font-medium tabular-nums text-indigo-600 dark:text-indigo-400">
                        +{pesoPrecise(quote.result.total - quote.dayReference.total)}
                      </span>
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}