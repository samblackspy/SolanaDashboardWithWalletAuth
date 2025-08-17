import { Card, CardContent, CardHeader, CardTitle } from "../ui"
import { TrendingUp } from "lucide-react"

export const PortfolioPerformance = () => {
  return (
     
 <Card className="h-full bg-neutral-900 border-neutral-700">
   <CardHeader className="pb-2">
     <div className="flex items-center justify-between">
       <CardTitle className="text-sm font-medium text-neutral-300">PORTFOLIO PERFORMANCE</CardTitle>
       <TrendingUp className="h-4 w-4 text-neutral-400" />
     </div>
   </CardHeader>
   <CardContent>
     <div className="space-y-2">
       <div className="flex justify-between items-center">
         <span className="text-sm text-neutral-400">24h Change</span>
         <span className="text-sm font-medium text-green-400">+5.2%</span>
       </div>
       <div className="flex justify-between items-center">
         <span className="text-sm text-neutral-400">7d Change</span>
         <span className="text-sm font-medium text-green-400">+12.8%</span>
       </div>
       <div className="flex justify-between items-center">
         <span className="text-sm text-neutral-400">30d Change</span>
         <span className="text-sm font-medium text-red-400">-2.4%</span>
       </div>
     </div>
   </CardContent>
 </Card>

)}