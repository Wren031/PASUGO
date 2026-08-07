import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CHART_COLORS } from '@/constants/app';

export interface BookingBarDataPoint {
  label: string;
  completed: number;
  cancelled: number;
}

interface BookingsBarChartProps {
  data: BookingBarDataPoint[];
  height?: number;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold text-slate-800">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function BookingsBarChart({ data, height = 260 }: BookingsBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }} barGap={4}>
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} dy={6} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F1F5F9' }} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
        <Bar dataKey="completed" name="Completed" fill={CHART_COLORS.orange} radius={[4, 4, 0, 0]} maxBarSize={22} />
        <Bar dataKey="cancelled" name="Cancelled" fill={CHART_COLORS.slate} radius={[4, 4, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
