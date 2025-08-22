"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/context/DashboardDataProvider";
import { Globe, Loader2 } from "lucide-react";

export function ApiKeyModal() {
  const [inputValue, setInputValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { setApiKey } = useDashboard();

  const handleSubmit = async () => {
    if (!inputValue || inputValue.trim().length < 32) {
      toast.error("Please enter a valid Helius API key.");
      return;
    }

    setIsValidating(true);
    const success = await setApiKey(inputValue.trim());

    if (!success) {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
      <Card className="w-[450px] bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-purple-500" />
            Helius API Key Required
          </CardTitle>
          <CardDescription>
            Please provide your Helius API key to proceed. This key will be
            saved securely in your browser's local storage for future visits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="api-key"
            placeholder="Enter your Helius API Key..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-neutral-800 border-neutral-600"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isValidating}
          />
          <a
            href="https://helius.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:underline mt-2 inline-block"
          >
            Don't have a key? Get one for free at Helius.
          </a>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-purple-500 hover:bg-purple-600"
            disabled={isValidating}
          >
            {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isValidating ? "Validating..." : "Save and Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
