import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { Clock } from "lucide-react"

export const StakingOverview = () => {
  return (
    <Card className="h-full bg-neutral-900 border-neutral-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-neutral-300">STAKING OVERVIEW</CardTitle>
                <Clock className="h-4 w-4 text-neutral-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-400">Total Staked</p>
                    <p className="text-xl font-bold text-white">0.00 SOL</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Est. Rewards (APY)</p>
                    <p className="text-xl font-bold text-white">0.00 SOL (6.8%)</p>
                  </div>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    Start Staking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>   
        )
    }