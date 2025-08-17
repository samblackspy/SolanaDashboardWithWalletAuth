"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Home, Wallet, BarChart2, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Tokens", href: "/tokens", icon: Wallet },
    { name: "Staking", href: "/staking", icon: BarChart2 },
  ]

  return (
    <nav className="flex flex-col h-full w-64 bg-neutral-900 border-r border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-xl font-bold text-white">Solana Dashboard</h1>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive ? 'bg-purple-500/10 hover:bg-purple-500/20' : 'hover:bg-neutral-800'}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </div>

      <div className="mt-auto space-y-2">
        <WalletMultiButton className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-md h-10 px-3 text-sm font-medium" />
        
        <Button variant="ghost" className="w-full justify-start text-neutral-400 hover:bg-neutral-800 hover:text-white">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </nav>
  )
}
