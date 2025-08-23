"use client";

import { useDashboard } from "@/context/DashboardDataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";

export const NetworkStatus = () => {
  const { networkStatus } = useDashboard();

  return (
    <Card className="h-full bg-neutral-900 border-neutral-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
          NETWORK STATUS
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <div className="absolute inset-0 border-2 border-green-500 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute inset-2 border border-green-500 rounded-full opacity-40"></div>
          <div className="absolute inset-4 border border-green-500 rounded-full opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-green-500 opacity-30"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-green-500 opacity-30"></div>
          </div>
        </div>

        {!networkStatus ? (
          <div className="text-neutral-400">Loading Network Data...</div>
        ) : (
          <div className="text-xs text-neutral-500 space-y-1 w-full font-mono">
            <div className="flex justify-between">
              <span>Current Slot:</span>
              <span className="text-white">
                {networkStatus.absoluteSlot.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Block Height:</span>
              <span className="text-white">
                {networkStatus.blockHeight.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Epoch:</span>
              <span className="text-white">{networkStatus.epoch}</span>
            </div>
            <div className="flex justify-between">
              <span>Epoch Slot:</span>
              <span className="text-white">
                {networkStatus.slotIndex.toLocaleString()} /{" "}
                {networkStatus.slotsInEpoch.toLocaleString()}
              </span>
            </div>
            {networkStatus.transactionCount && (
              <div className="flex justify-between">
                <span>Total Txs:</span>
                <span className="text-white">
                  {(networkStatus.transactionCount / 1_000_000_000).toFixed(2)}B
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="text-purple-500">Mainnet-Beta</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
