"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useDashboard, TokenData } from "@/context/DashboardDataProvider";
import { LazyImage } from "../ui/LazyImage";

const PerformanceList = ({
  title,
  tokens,
  icon: Icon,
  textColor,
}: {
  title: string;
  tokens: TokenData[];
  icon: React.ElementType;
  textColor: string;
}) => {
  if (tokens.length === 0) return null;

  return (
    <div>
      <h3 className="flex items-center gap-2 text-xs font-semibold text-neutral-300 tracking-wider mb-3">
        <Icon className={`w-4 h-4 ${textColor}`} />
        {title}
      </h3>
      <div className="space-y-2">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              {token.image ? (
                <LazyImage
                  src={token.image}
                  alt={token.name}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {(token.symbol || "??").slice(0, 2)}
                </div>
              )}
              <span className="text-neutral-200">{token.symbol}</span>
            </div>
            <span className={`${textColor} font-mono`}>
              {token.change24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PortfolioPerformance = () => {
  const { tokens, isLoading, error } = useDashboard();

  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-700 h-full">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            24H MARKET MOVERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-neutral-400 py-8">
            Failed to load market data.
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedGainers = tokens
    .filter((t) => t.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 5);

  const sortedLosers = tokens
    .filter((t) => t.change24h < 0)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 5);

  const hasData = sortedGainers.length > 0 || sortedLosers.length > 0;

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
          24H MARKET MOVERS
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && tokens.length === 0 ? (
          <div className="text-center text-sm text-neutral-400 py-8">
            Loading market data...
          </div>
        ) : !hasData ? (
          <div className="text-center text-sm text-neutral-400 py-8">
            No market data available for this wallet.
          </div>
        ) : (
          <div className="space-y-6">
            <PerformanceList
              title="TOP GAINERS"
              tokens={sortedGainers}
              icon={TrendingUp}
              textColor="text-green-500"
            />
            <PerformanceList
              title="TOP LOSERS"
              tokens={sortedLosers}
              icon={TrendingDown}
              textColor="text-red-500"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
