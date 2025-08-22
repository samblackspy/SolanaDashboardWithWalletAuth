"use client";

import { TokenPerformance24h } from "./TokenPerformance24h";
import { PortfolioPerformance } from "./PortfolioPerformance";
import { TokenAllocation } from "./TokenAllocation";

export const PortfolioOverview = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">
            PORTFOLIO OVERVIEW
          </h1>
          <p className="text-sm text-neutral-400">
            A complete financial summary of your token holdings.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <TokenPerformance24h />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TokenAllocation />
          <PortfolioPerformance />
        </div>
      </div>
    </div>
  );
};
