import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
}

interface StatusDonutChartProps {
  data: DonutDataPoint[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-sm font-semibold text-slate-800">
        {payload[0]!.name}: {payload[0]!.value}
      </p>
    </div>
  );
}

export default function StatusDonutChart({ data, height = 240, centerLabel, centerValue }: StatusDonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="85%" paddingAngle={3} strokeWidth={0}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <p className="text-2xl font-bold text-slate-900">{centerValue}</p>}
          {centerLabel && <p className="text-xs font-medium text-slate-500">{centerLabel}</p>}
        </div>
      )}
    </div>
  );
}
