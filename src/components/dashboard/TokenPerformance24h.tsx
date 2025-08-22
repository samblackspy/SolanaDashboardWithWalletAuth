"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDashboard } from "@/context/DashboardDataProvider";

export const TokenPerformance24h = () => {
  const { totalValue, change24h, isLoading, effectiveKey } = useDashboard();

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            PORTFOLIO PERFORMANCE
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
        </div>
        {change24h !== null && totalValue > 0 && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              change24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change24h >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {change24h.toFixed(2)}% (24h)
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && effectiveKey ? (
          <div className="flex items-center justify-center h-20 text-neutral-400">
            Calculating performance...
          </div>
        ) : !effectiveKey ? (
          <div className="flex items-center justify-center h-20 text-neutral-400">
            Connect wallet or enter address to view performance.
          </div>
        ) : (
          <div className="text-xs text-neutral-500">
            This is the value-weighted 24-hour performance of all tokens in your
            wallet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
