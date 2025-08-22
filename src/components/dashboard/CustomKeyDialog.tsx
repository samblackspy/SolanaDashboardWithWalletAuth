"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/context/DashboardDataProvider";

interface CustomKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomKeyDialog({ open, onOpenChange }: CustomKeyDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const { setViewOnlyKey } = useDashboard();

  const handleSubmit = () => {
    if (inputValue.trim().length < 32 || inputValue.trim().length > 44) {
      toast.error("Please enter a valid Solana public key.");
      return;
    }
    setViewOnlyKey(inputValue.trim());
    onOpenChange(false);
    setInputValue("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle>View a Wallet</DialogTitle>
          <DialogDescription>
            Enter any Solana public key to view its assets and transaction
            history. This will disconnect your currently connected wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="pubkey"
            placeholder="Enter Public Key..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-neutral-800 border-neutral-600"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            View Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
