"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Legend,
  PieLabelRenderProps,
} from "recharts";
import { useDashboard } from "@/context/DashboardDataProvider";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
];

interface ChartDataPoint {
  name: string;
  value: number;
}

interface LegendFormatterEntry {
  payload?: {
    value?: number;
  };
}

export const TokenAllocation = () => {
  const { tokens, totalValue, isLoading } = useDashboard();

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!tokens || tokens.length === 0) return [];
    const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);
    const topTokens = sortedTokens.slice(0, 6);
    const otherValue = sortedTokens
      .slice(6)
      .reduce((sum, t) => sum + t.value, 0);
    const chartItems = topTokens
      .filter((t) => t.value > 0)
      .map((token) => ({
        name: token.symbol,
        value: parseFloat(token.value.toFixed(2)),
      }));
    if (otherValue > 0) {
      chartItems.push({
        name: "Others",
        value: parseFloat(otherValue.toFixed(2)),
      });
    }
    return chartItems;
  }, [tokens]);

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (
      percent === undefined ||
      innerRadius === undefined ||
      outerRadius === undefined ||
      cx === undefined ||
      cy === undefined ||
      midAngle === undefined
    )
      return null;

    const RADIAN = Math.PI / 180;
    const r =
      Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + r * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + r * Math.sin(-Number(midAngle) * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > Number(cx) ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLegendText = (value: string, entry: LegendFormatterEntry) => {
    const numericValue = entry.payload?.value;
    const displayValue =
      numericValue?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "0.00";
    return (
      <span className="text-xs text-neutral-300">
        {value}: ${displayValue}
      </span>
    );
  };

  if (isLoading && tokens.length === 0) {
    return (
      <Card className="bg-neutral-900 border-neutral-700 h-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            TOKEN ALLOCATION
          </CardTitle>
          <div className="h-8 w-32 bg-neutral-800 rounded mt-2 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center">
            <div className="text-neutral-400">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
          TOKEN ALLOCATION
        </CardTitle>
        {totalValue !== null && (
          <p className="text-2xl font-bold text-white font-mono">
            $
            {totalValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-60 relative">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((_item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#171717"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  formatter={renderLegendText}
                  wrapperStyle={{ paddingLeft: "20px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              No token data to display chart
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
