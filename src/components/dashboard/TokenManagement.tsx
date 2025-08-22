"use client";

import { useState } from "react";
import { useDashboard } from "@/context/DashboardDataProvider";
import { Coins, Search, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TokenAllocation } from "./TokenAllocation";
import { PortfolioPerformance } from "./PortfolioPerformance";
import { LazyImage } from "../ui/LazyImage";

export function TokenManagement() {
  const { tokens, isLoading, error, totalValue } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = tokens.filter((token) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (token.name || "").toLowerCase().includes(searchLower);
    const symbolMatch = (token.symbol || "")
      .toLowerCase()
      .includes(searchLower);
    return nameMatch || symbolMatch;
  });

  const tokenCount = tokens.length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wider">
          TOKEN MANAGEMENT
        </h1>
        <p className="text-sm text-neutral-400">
          Manage your Solana token portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 tracking-wider">
                TOTAL VALUE
              </p>
              <p className="text-2xl font-bold text-white font-mono break-words">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg ml-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-400 tracking-wider">
                TOKEN COUNT
              </p>
              <p className="text-2xl font-bold text-white font-mono">
                {tokenCount}
              </p>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg ml-4">
              <Coins className="w-6 h-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TokenAllocation />
        <PortfolioPerformance />
      </div>

      <div className="grid grid-cols-1">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-4">
              TOKEN PORTFOLIO
            </h3>
            {isLoading && tokens.length === 0 && (
              <div className="text-center p-8 text-neutral-400">
                Loading token portfolio...
              </div>
            )}
            {error && (
              <div className="text-center p-8 text-red-500">{error}</div>
            )}
            {!isLoading && !error && tokens.length === 0 && (
              <div className="text-center p-8 text-neutral-400">
                No tokens found in this wallet.
              </div>
            )}
            {!isLoading && !error && filteredTokens.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                        TOKEN
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                        BALANCE
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                        VALUE
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">
                        PRICE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTokens.map((token) => (
                      <tr
                        key={token.id}
                        className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {token.image ? (
                              <LazyImage
                                src={token.image}
                                alt={token.name || token.symbol}
                                className="w-8 h-8 rounded-full bg-neutral-700"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                                {(token.symbol || "??").slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <div className="text-sm text-white font-medium">
                                {token.symbol || "Unknown Symbol"}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {token.name || "Unknown Token"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-white font-mono text-right">
                          {token.balance.toLocaleString(undefined, {
                            maximumFractionDigits: 4,
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-white font-mono text-right">
                          $
                          {token.value.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-white font-mono text-right">
                          $
                          {token.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 6,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
