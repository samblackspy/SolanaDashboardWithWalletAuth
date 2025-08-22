"use client";

import React from "react";
import { useDashboard, TransactionData } from "@/context/DashboardDataProvider";
import {
  Search,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Coins,
  Copy,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function TransactionHistory() {
  const {
    transactions,
    isLoading,
    error,
    fetchMoreTransactions,
    isFetchingMore,
    hasMoreTransactions,
    effectiveKey,
  } = useDashboard();

  const [selectedTransaction, setSelectedTransaction] =
    React.useState<TransactionData | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");
  const [copySuccess, setCopySuccess] = React.useState("");

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

  const getStatusColor = (
    status: "confirmed" | "pending" | "failed" | "unknown" | undefined
  ) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-neutral-500/20 text-neutral-300";
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTermLower) ||
      tx.type.toLowerCase().includes(searchTermLower) ||
      tx.action.toLowerCase().includes(searchTermLower);
    const matchesFilter = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalTransactions = transactions.length;
  const confirmedTransactions = transactions.filter(
    (tx) => tx.status === "confirmed"
  ).length;
  const failedTransactions = transactions.filter(
    (tx) => tx.status === "failed"
  ).length;
  const pendingTransactions = 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  return (
    <div className="p-6 space-y-6 bg-neutral-950 text-white min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider">
            TRANSACTION HISTORY
          </h1>
          <p className="text-sm text-neutral-400">
            Complete record of all wallet transactions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  TOTAL LOADED
                </p>
                <p className="text-2xl font-bold font-mono">
                  {totalTransactions}
                </p>
              </div>
              <ArrowRightLeft className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  CONFIRMED
                </p>
                <p className="text-2xl font-bold text-green-500 font-mono">
                  {confirmedTransactions}
                </p>
              </div>
              <ArrowDownLeft className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  PENDING
                </p>
                <p className="text-2xl font-bold text-yellow-500 font-mono">
                  {pendingTransactions}
                </p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">
                  FAILED
                </p>
                <p className="text-2xl font-bold text-red-500 font-mono">
                  {failedTransactions}
                </p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search by signature, type, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-800 border-neutral-600"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "send", "receive", "swap", "stake", "unstake"].map(
            (type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className={
                  filterType === type
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "text-neutral-400 border-neutral-700 hover:bg-neutral-800"
                }
              >
                {type.toUpperCase()}
              </Button>
            )
          )}
        </div>
      </div>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            ALL TRANSACTIONS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading && transactions.length === 0 && (
            <div className="text-center p-8 text-neutral-400">
              Loading transactions...
            </div>
          )}
          {error && <div className="text-center p-8 text-red-500">{error}</div>}
          {!isLoading && !error && !effectiveKey && (
            <div className="text-center p-8 text-neutral-400">
              Connect a wallet or enter one to view transactions.
            </div>
          )}
          {!isLoading && !error && effectiveKey && (
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx: TransactionData) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedTransaction(tx)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-full">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">
                            {tx.type}
                          </span>
                          <Badge className={getStatusColor(tx.status)}>
                            {(tx.status ?? "unknown").toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">
                          {new Date(tx.unixTimestamp * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-sm font-mono truncate max-w-[200px] sm:max-w-xs"
                        title={tx.action}
                      >
                        {tx.action}
                      </p>
                      <div className="text-xs text-neutral-400">
                        Fee: {tx.fee}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-neutral-400">
                  No transactions found for this wallet or filter.
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center mt-6">
            {hasMoreTransactions && effectiveKey ? (
              <Button
                onClick={fetchMoreTransactions}
                disabled={isFetchingMore}
                variant="outline"
                className="text-neutral-300 border-neutral-700 hover:bg-neutral-800"
              >
                {isFetchingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            ) : (
              transactions.length > 0 && (
                <p className="text-sm text-neutral-500">
                  End of transaction history.
                </p>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedTransaction(null)}
        >
          <Card
            className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold capitalize">
                {selectedTransaction.type} Transaction
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedTransaction(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider">
                    DETAILS
                  </h3>
                  <div className="space-y-2 text-sm p-3 bg-neutral-800 rounded">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Type:</span>
                      <span className="capitalize">
                        {selectedTransaction.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Status:</span>
                      <Badge
                        className={getStatusColor(selectedTransaction.status)}
                      >
                        {(
                          selectedTransaction.status ?? "unknown"
                        ).toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Timestamp:</span>
                      <span>
                        {new Date(
                          selectedTransaction.unixTimestamp * 1000
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Fee:</span>
                      <span className="font-mono">
                        {selectedTransaction.fee}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-neutral-300 tracking-wider">
                    SIGNATURE
                  </h3>
                  <div className="flex items-center gap-2 p-2 bg-neutral-800 rounded font-mono text-xs">
                    <span className="truncate">
                      {selectedTransaction.signature}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-neutral-400 hover:text-purple-500"
                      onClick={() => handleCopy(selectedTransaction.signature)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 text-neutral-400 hover:text-purple-500"
                      onClick={() =>
                        window.open(
                          `https://solscan.io/tx/${selectedTransaction.signature}?cluster=mainnet`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">
                  ACTION
                </h3>
                <p className="text-sm text-neutral-300 p-3 bg-neutral-800 rounded font-mono">
                  {selectedTransaction.action}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() =>
                    window.open(
                      `https://solscan.io/tx/${selectedTransaction.signature}?cluster=mainnet`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> View on Explorer
                </Button>
                <Button
                  variant="outline"
                  className="text-neutral-400 border-neutral-700 hover:bg-neutral-800"
                  onClick={() => handleCopy(selectedTransaction.signature)}
                >
                  <Copy className="w-4 h-4 mr-2" />{" "}
                  {copySuccess || "Copy Signature"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
