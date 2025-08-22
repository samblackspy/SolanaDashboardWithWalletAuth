"use client";

import { useDashboard } from "@/context/DashboardDataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Button } from "../ui";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { QuickActions } from "./QuickActions";
import { TopHoldings } from "./TopHoldings";

export const Balance = () => {
  const { tokens, totalValue, isLoading, refresh, effectiveKey } =
    useDashboard();
  const solToken = tokens.find((t) => t.symbol === "SOL");

  const handleCopyAddress = () => {
    if (effectiveKey) {
      navigator.clipboard.writeText(effectiveKey.toBase58());
      toast.success("Address copied!");
    }
  };

  return (
    <Card className="h-full bg-neutral-900 border-neutral-700">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            WALLET BALANCE
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refresh}
          disabled={isLoading}
          className="text-neutral-400 hover:text-purple-500"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && tokens.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">
            Loading Balance...
          </div>
        ) : !effectiveKey ? (
          <div className="text-center py-10 text-neutral-400">
            Please connect a wallet or enter one to view.
          </div>
        ) : solToken ? (
          <>
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white font-mono">
                  {solToken.balance.toFixed(4)} SOL
                </div>
                {totalValue !== null && (
                  <div className="text-xs text-neutral-500 mt-1">
                    ≈ $
                    {totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    USD
                  </div>
                )}
              </div>
              <QuickActions />
              <div className="flex items-center justify-center gap-2 p-2 bg-neutral-800 rounded font-mono text-xs">
                <span className="text-neutral-400 truncate">
                  {effectiveKey?.toBase58()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-neutral-400 hover:text-purple-500"
                  onClick={handleCopyAddress}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-neutral-400 hover:text-purple-500"
                  onClick={() =>
                    window.open(
                      `https://solscan.io/account/${effectiveKey?.toBase58()}`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <TopHoldings tokens={tokens.slice(0, 5)} />
          </>
        ) : (
          <div className="text-center py-10 text-neutral-400">
            No balance to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
