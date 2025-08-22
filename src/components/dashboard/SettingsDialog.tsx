"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { useDashboard } from "@/context/DashboardDataProvider";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiKey, setApiKey } = useDashboard();
  const [inputValue, setInputValue] = useState(apiKey);

  useEffect(() => {
    if (open) {
      setInputValue(apiKey);
    }
  }, [open, apiKey]);

  const handleSave = () => {
    setApiKey(inputValue);
    onOpenChange(false);
  };

  const displayKey = apiKey
    ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
    : "Not Set";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-neutral-900 border-neutral-700 text-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Provide your own Helius API key to use your personal rate limits.
            Get a free key from helius.dev.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="api-key" className="text-right">
              Helius API Key
            </Label>
            <div className="text-xs px-2 py-1 bg-neutral-800 rounded-md text-neutral-400">
              Currently using: {displayKey}
            </div>
          </div>
          <Input
            id="api-key"
            placeholder="Enter your Helius API Key or leave blank to clear..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-neutral-800 border-neutral-600"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            Save and Refresh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
