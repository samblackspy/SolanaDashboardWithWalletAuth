import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from "@/components/provider/Solana";
import { Toaster } from "@/components/ui/sonner";
import { DashboardDataProvider } from "@/context/DashboardDataProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Solana Dashboard with Wallet Authentication",
  description:
    "A Solana dashboard with wallet authentication and transaction capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SolanaProvider>
          <DashboardDataProvider>{children}</DashboardDataProvider>
        </SolanaProvider>

        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "bg-neutral-900 border border-neutral-700 text-neutral-100 shadow-lg",
              title: "text-white font-semibold",
              description: "text-neutral-400",
              error: "!bg-red-950 !border-red-500/50 !text-red-100",
              success: "!bg-green-950 !border-green-500/50 !text-green-100",
              info: "!bg-blue-950 !border-blue-500/50 !text-blue-100",
            },
          }}
        />
      </body>
    </html>
  );
}
