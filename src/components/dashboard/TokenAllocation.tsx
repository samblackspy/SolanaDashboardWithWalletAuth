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

interface CustomPieLabelProps extends PieLabelRenderProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
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

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomPieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLegendText = (value: string, entry: any) => {
    const payload = entry.payload as ChartDataPoint;
    const displayValue =
      payload?.value?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "0.00";

    return (
      <span className="text-xs text-neutral-300">
        {value}: ${displayValue}
      </span>
    );
  };

  const renderCustomizedLabelWrapper = (props: any) => {
    return renderCustomizedLabel({
      ...props,
      cx: Number(props.cx) || 0,
      cy: Number(props.cy) || 0,
      midAngle: Number(props.midAngle) || 0,
      innerRadius: Number(props.innerRadius) || 0,
      outerRadius: Number(props.outerRadius) || 0,
      percent: Number(props.percent) || 0,
      index: 0,
    });
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
                  label={renderCustomizedLabelWrapper}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
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
