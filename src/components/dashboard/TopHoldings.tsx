"use client";

import { TokenData } from "@/context/DashboardDataProvider";
import { LazyImage } from "../ui/LazyImage";

interface TopHoldingsProps {
  tokens: TokenData[];
}

export const TopHoldings = ({ tokens }: TopHoldingsProps) => {
  return (
    <div className="space-y-2">
      {tokens.map((token) => (
        <div
          key={token.id}
          className="flex items-center justify-between p-2 bg-neutral-800 rounded"
        >
          <div className="flex items-center gap-3">
            {token.image ? (
              <LazyImage
                src={token.image}
                alt={token.name || "Token logo"}
                className="w-8 h-8 rounded-full bg-neutral-700"
              />
            ) : (
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                {(token.symbol || "??").slice(0, 2)}
              </div>
            )}
            <div>
              <div className="text-xs text-white font-medium">
                {token.symbol}
              </div>
              <div className="text-xs text-neutral-500">{token.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white font-mono">
              {token.balance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-neutral-500">
              $
              {token.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
