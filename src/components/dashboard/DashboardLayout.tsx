"use client";

import { useState } from "react";
import { Bell, RefreshCw, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenManagement } from "@/components/dashboard/TokenManagement";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { WalletOverview } from "@/components/dashboard/WalletOverview";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useDashboard } from "@/context/DashboardDataProvider";
import { WalletManager } from "./WalletManager";
import { CustomKeyDialog } from "./CustomKeyDialog";
import { SettingsDialog } from "./SettingsDialog";

export function DashboardLayout() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isCustomKeyDialogOpen, setIsCustomKeyDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const { refresh, isLoading, lastSync } = useDashboard();

  return (
    <>
      <div className="flex h-screen bg-neutral-950 text-white">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-1 flex flex-col">
          <div className="h-16 bg-neutral-900 border-b border-neutral-700 flex items-center justify-between px-6 flex-shrink-0">
            <div className="text-sm text-neutral-400">
              SOLANA DASHBOARD /{" "}
              <span className="text-purple-500">
                {activeSection.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {lastSync && (
                <div className="text-xs text-neutral-500 hidden sm:block">
                  LAST SYNC: {lastSync.toLocaleTimeString()}
                </div>
              )}

              <WalletManager />

              <Button
                variant="outline"
                className="h-10 text-neutral-300 border-neutral-700 hover:bg-neutral-800 hover:text-purple-500 text-xs px-3"
                onClick={() => setIsCustomKeyDialogOpen(true)}
              >
                <Eye className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">View Address</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-purple-500"
                onClick={() => setIsSettingsDialogOpen(true)}
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-purple-500"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-purple-500"
                onClick={refresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div
              style={{
                display: activeSection === "overview" ? "block" : "none",
              }}
            >
              <WalletOverview />
            </div>
            <div
              style={{ display: activeSection === "tokens" ? "block" : "none" }}
            >
              <TokenManagement />
            </div>
            <div
              style={{
                display: activeSection === "transactions" ? "block" : "none",
              }}
            >
              <TransactionHistory />
            </div>
          </div>
        </main>
      </div>
      <CustomKeyDialog
        open={isCustomKeyDialogOpen}
        onOpenChange={setIsCustomKeyDialogOpen}
      />
      <SettingsDialog
        open={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
      />
    </>
  );
}
