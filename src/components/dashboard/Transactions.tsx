import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Activity } from "lucide-react";

export const Transactions = () => {
  return (
       <Card className="h-full bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-neutral-300">RECENT TRANSACTIONS</CardTitle>
            <Activity className="h-4 w-4 text-neutral-400" />
     </div>
   </CardHeader>
   <CardContent>
     <div className="space-y-4">
       <p className="text-sm text-neutral-400 text-center py-4">
         No recent transactions
       </p>
     </div>
   </CardContent>
 </Card>
  
)   
}