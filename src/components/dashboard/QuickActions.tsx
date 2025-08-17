import { Button } from "../ui";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";

export const QuickActions = () => {
return (
<Card className="h-full bg-neutral-900 border-neutral-700">
<CardHeader className="pb-2">
  <CardTitle className="text-sm font-medium text-neutral-300">QUICK ACTIONS</CardTitle>
</CardHeader>
<CardContent className="space-y-3">
  <Button className="w-full justify-between bg-blue-500 hover:bg-blue-600 text-white">
    Send
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  </Button>
  <Button className="w-full justify-between bg-green-500 hover:bg-green-600 text-white">
    Receive
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  </Button>
  <Button className="w-full justify-between bg-purple-500 hover:bg-purple-600 text-white">
    Swap Tokens
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"></polyline>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
      <polyline points="7 23 3 19 7 15"></polyline>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
    </svg>
  </Button>
</CardContent>
</Card> 
)
}
