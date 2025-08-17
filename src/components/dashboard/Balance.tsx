"use client"

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { FC, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"

export const Balance: FC = () => {
  const [balance, setBalance] = useState(0)
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateBalance = async () => {
      if (!connection || !publicKey) {
        setError("Wallet not connected or connection unavailable")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        connection.onAccountChange(
          publicKey,
          (updatedAccountInfo) => {
            setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL)
          },
          "confirmed"
        )

        const accountInfo = await connection.getAccountInfo(publicKey)

        if (accountInfo) {
          setBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
        } else {
          throw new Error("Account info not found")
        }
      } catch (error) {
        console.error("Failed to retrieve account info:", error)
        setError("Failed to load balance. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    updateBalance()
  }, [connection, publicKey])

  if (!publicKey) {
    return null
  }

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-neutral-300">WALLET BALANCE</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 flex items-center">
            <div className="animate-pulse h-4 w-24 bg-neutral-700 rounded"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">
              {balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
            </div>
            <p className="text-xs text-neutral-400">
              ≈ ${(balance * 20).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}