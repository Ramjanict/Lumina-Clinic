"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { money } from "@/lib/slots";
import type { SeriesPoint } from "@/lib/types";

function dayLabel(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function VisitsChart({ data }: { data: SeriesPoint[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e6eef5" vertical strokeDasharray="4 6" horizontal={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => dayLabel(String(value))}
            tick={{ fill: "#7b8b99", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            yAxisId="appointments"
            allowDecimals={false}
            tick={{ fill: "#7b8b99", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <YAxis yAxisId="earnings" orientation="right" hide />
          <Tooltip
            labelFormatter={(value) => dayLabel(String(value))}
            formatter={(value, name) => [
              name === "earnings" ? money(Number(value)) : value,
              name === "earnings" ? "Collected" : "Appointments",
            ]}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (value === "earnings" ? "Collected" : "Appointments")}
          />
          <Bar
            yAxisId="appointments"
            dataKey="appointments"
            fill="#8adad4"
            radius={[7, 7, 0, 0]}
            barSize={18}
          />
          <Area
            yAxisId="earnings"
            type="monotone"
            dataKey="earnings"
            stroke="#12b5ae"
            fill="#12b5ae"
            fillOpacity={0.14}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function feeChangeNote(series: SeriesPoint[]) {
  const previous = series.slice(0, 7).reduce((sum, point) => sum + point.earnings, 0);
  const recent = series.slice(7).reduce((sum, point) => sum + point.earnings, 0);
  if (previous === 0 && recent === 0) return "No fees collected in the last 14 days.";
  if (previous === 0) return `${money(recent)} collected in the last 7 days.`;
  const change = Math.round(((recent - previous) / previous) * 100);
  if (change === 0) return "Collected fees match the previous 7 days.";
  const direction = change > 0 ? "up" : "down";
  return `Collected fees are ${direction} ${Math.abs(change)}% from the previous 7 days.`;
}
