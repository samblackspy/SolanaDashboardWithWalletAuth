"use client";

import { useDashboard } from "@/context/DashboardDataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Coins,
} from "lucide-react";

function timeAgo(unixTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const seconds = now - unixTimestamp;
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  for (const [secs, label] of intervals) {
    const interval = Math.floor(seconds / secs);
    if (interval >= 1)
      return `${interval} ${label}${interval !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export const Transactions = () => {
  const { transactions, isLoading, error, effectiveKey } = useDashboard();
  const recentTransactions = transactions.slice(0, 5);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case "swap":
        return <ArrowRightLeft className="w-4 h-4 text-purple-500" />;
      case "stake":
      case "unstake":
        return <Coins className="w-4 h-4 text-blue-500" />;
      default:
        return <ArrowRightLeft className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <Card className="bg-neutral-900 border-neutral-700 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
          RECENT TRANSACTIONS
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && transactions.length === 0 ? (
          <div className="text-center text-neutral-400 py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : !effectiveKey ? (
          <div className="text-center text-neutral-400 py-10">
            Connect a wallet to view transactions.
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center text-neutral-400 py-10">
            No recent transactions found.
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="text-xs border-l-2 border-purple-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="text-white flex items-center gap-2">
                    {getTransactionIcon(tx.type)}
                    <span className="font-medium capitalize">{tx.type}</span>
                  </div>
                  <div
                    className="font-mono text-white truncate max-w-[150px]"
                    title={tx.action}
                  >
                    {tx.action}
                  </div>
                </div>
                <div className="text-neutral-500 font-mono mt-1">
                  {timeAgo(tx.unixTimestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
