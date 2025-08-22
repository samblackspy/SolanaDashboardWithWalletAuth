"use client";

import { useDashboard } from "@/context/DashboardDataProvider";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "./WalletConnectButton";
import { LogOut } from "lucide-react";

export function WalletManager() {
  const { isViewOnly, effectiveKey, clearViewOnlyKey } = useDashboard();

  if (isViewOnly && effectiveKey) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md bg-neutral-800 border border-purple-500/50">
        <div className="text-xs text-neutral-400">
          <span className="font-bold text-purple-400">VIEWING:</span>
          <span className="font-mono ml-2">
            {effectiveKey.toBase58().slice(0, 4)}...
            {effectiveKey.toBase58().slice(-4)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-neutral-400 hover:text-white hover:bg-neutral-700"
          onClick={clearViewOnlyKey}
          title="Exit View-Only Mode"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return <WalletConnectButton />;
}
