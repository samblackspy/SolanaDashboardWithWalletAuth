"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "../ui";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  {
    ssr: false,
    loading: () => (
      <Button className="w-[175px] animate-pulse bg-neutral-800" disabled>
        Loading...
      </Button>
    ),
  }
);

export function WalletConnectButton() {
  return <WalletMultiButton />;
}
