"use client"

import { useState } from "react"
import { Wallet, CreditCard, History, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/DashboardDataProvider"; 

export const Sidebar = ({ activeSection, setActiveSection }: { activeSection: string, setActiveSection: (section: string) => void }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { networkStatus } = useDashboard();
  
  const navItems = [
      { id: "overview", icon: Wallet, label: "WALLET OVERVIEW" },
      { id: "tokens", icon: CreditCard, label: "TOKENS" },
      { id: "transactions", icon: History, label: "TRANSACTIONS" },
   ];

  return (
        <div className={`bg-neutral-900 border-r border-neutral-700 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 md:relative ${sidebarCollapsed ? "w-20" : "w-72"}`}>
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-8">
            <div className={`overflow-hidden transition-all ${sidebarCollapsed ? "w-0" : "w-auto"}`}>
              <h1 className="text-purple-500 font-bold text-lg tracking-wider whitespace-nowrap">SOLANA DASHBOARD</h1>
              <p className="text-neutral-500 text-xs whitespace-nowrap">MAINNET</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-neutral-400 hover:text-purple-500 flex-shrink-0">
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
            </Button>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${activeSection === item.id ? "bg-purple-500 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-800"}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium whitespace-nowrap transition-opacity ${sidebarCollapsed ? "opacity-0" : "opacity-100"}`}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className={`p-4 transition-opacity ${sidebarCollapsed ? "opacity-0 hidden" : "opacity-100"}`}>
            <div className="p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white">NETWORK ONLINE</span>
              </div>
              <div className="text-xs text-neutral-500">
                {networkStatus ? (
                  <>
                    <div>SLOT: {networkStatus.absoluteSlot.toLocaleString()}</div>
                    <div>EPOCH: {networkStatus.epoch}</div>
                  </>
                ) : (
                  <div>Loading network data...</div>
                )}
              </div>
            </div>
        </div>
      </div> 
    )}