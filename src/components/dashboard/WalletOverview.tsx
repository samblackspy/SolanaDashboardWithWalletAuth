"use client";
import { Balance } from "./Balance";
import { Transactions } from "./Transactions";
import { NetworkStatus } from "./NetworkStatus";
import { NftShowcase } from "./NftShowcase";
import { PortfolioOverview } from "./PortfolioOverview";

export const WalletOverview = () => {
  return (
    <div className="p-6 space-y-6 text-white bg-neutral-950 min-h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Balance />
        </div>
        <div className="lg:col-span-4">
          <Transactions />
        </div>

        <div className="lg:col-span-4">
          <NetworkStatus />
        </div>
        <div className="lg:col-span-12">
          <PortfolioOverview />
        </div>
        <div className="lg:col-span-12">
          <NftShowcase />
        </div>
      </div>
    </div>
  );
};
