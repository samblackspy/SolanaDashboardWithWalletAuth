"use client"

import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { Activity, TrendingUp, Clock } from "lucide-react"
import { Balance } from "./Balance"
import { Transactions } from "./Transactions"
import { PortfolioPerformance } from "./PortfolioPerformance"
import { StakingOverview } from "./StakingOverview"
import { QuickActions } from "./QuickActions"

export function WalletOverviewPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Balance />
        </div>
        <div className="lg:col-span-4">
          <Transactions />
        </div>
        <div className="lg:col-span-4">
          <PortfolioPerformance />
        </div>
        
         
      </div>
      
      
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <div className="lg:col-span-5">
          <StakingOverview />
        </div>
        
        <div className="lg:col-span-3">
         <QuickActions />
        </div>
      </div>
    </div>
  )
}
