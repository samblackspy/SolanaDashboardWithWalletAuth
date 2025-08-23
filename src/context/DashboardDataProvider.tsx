"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { apiService } from "@/services/apiService";
import {
  parseHeliusTransaction,
  HeliusApiTransaction,
} from "@/utils/transactions";
import { PublicKey } from "@solana/web3.js";
import { HeliusAsset } from "@/types/helius";

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  image?: string;
}
export interface NftData {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
}
export type TransactionData = ReturnType<typeof parseHeliusTransaction>;
export interface NetworkStatusData {
  absoluteSlot: number;
  blockHeight: number;
  epoch: number;
  transactionCount: number;
  slotIndex: number;
  slotsInEpoch: number;
}

interface DashboardContextState {
  tokens: TokenData[];
  nfts: NftData[];
  transactions: TransactionData[];
  networkStatus: NetworkStatusData | null;
  totalValue: number;
  change24h: number;
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  refresh: () => void;
  fetchMoreTransactions: () => void;
  isFetchingMore: boolean;
  hasMoreTransactions: boolean;
  isViewOnly: boolean;
  effectiveKey: PublicKey | null;
  setViewOnlyKey: (key: string) => void;
  clearViewOnlyKey: () => void;
  apiKey: string;
  setApiKey: (key: string) => Promise<boolean>;
  isKeyInitialized: boolean;
}

const DashboardContext = createContext<DashboardContextState | undefined>(
  undefined
);
const TX_PAGE_LIMIT = 50;

export const DashboardDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { connection } = useConnection();
  const { publicKey, disconnect } = useWallet();
  const [apiKey, setApiKey] = useState<string>("");
  const [isKeyInitialized, setIsKeyInitialized] = useState<boolean>(false);

  useEffect(() => {
    const validateAndSetInitialKey = async () => {
      const savedKey = localStorage.getItem("heliusApiKey");
      if (savedKey) {
        const validationResult = await apiService.getNetworkStatus(savedKey);
        if (validationResult) {
          setApiKey(savedKey);
        } else {
          localStorage.removeItem("heliusApiKey");
          toast.error(
            "Your saved API key is no longer valid. Please enter a new one."
          );
        }
      }
      setIsKeyInitialized(true);
    };
    validateAndSetInitialKey();
  }, []);

  const [viewOnlyKey, setViewOnlyKeyInternal] = useState<PublicKey | null>(
    null
  );
  const effectiveKey = useMemo(
    () => viewOnlyKey || publicKey,
    [viewOnlyKey, publicKey]
  );
  const isViewOnly = useMemo(() => !!viewOnlyKey, [viewOnlyKey]);

  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [nfts, setNfts] = useState<NftData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusData | null>(
    null
  );
  const [totalValue, setTotalValue] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [lastTxSignature, setLastTxSignature] = useState<string | null>(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      if (!apiKey) {
        setNetworkStatus(null);
        return;
      }
      const networkData = await apiService.getNetworkStatus(apiKey);
      if (networkData)
        setNetworkStatus({
          ...networkData,
          slotIndex: networkData.absoluteSlot % 432000,
          slotsInEpoch: 432000,
        });
      else setNetworkStatus(null);
    };
    fetchNetwork();
  }, [apiKey]);

  const fetchWalletData = useCallback(
    async (isRefreshing = false) => {
      if (!effectiveKey || !apiKey) {
        setTokens([]);
        setNfts([]);
        setTransactions([]);
        setTotalValue(0);
        setChange24h(0);
        setIsLoading(false);
        setLastTxSignature(null);
        setHasMoreTransactions(true);
        return;
      }
      setIsLoading(true);
      setError(null);
      if (isRefreshing) toast.info("Refreshing wallet data...");
      try {
        const [assetsData, nftsData, transactionsData] = await Promise.all([
          apiService.getWalletAssets(effectiveKey, connection, apiKey),
          apiService.getNFTs(effectiveKey, apiKey),
          apiService.getTransactions(effectiveKey, apiKey, {
            limit: TX_PAGE_LIMIT,
          }),
        ]);

        if (
          assetsData === null ||
          nftsData === null ||
          transactionsData === null
        ) {
          throw new Error(
            "One or more API calls failed. The API key may be invalid or rate-limited."
          );
        }

        setTokens(assetsData);
        const calculatedTotalValue = assetsData.reduce(
          (s, t) => s + t.value,
          0
        );
        const weightedChangeSum = assetsData.reduce(
          (s, t) => s + t.value * t.change24h,
          0
        );
        setTotalValue(calculatedTotalValue);
        setChange24h(
          calculatedTotalValue > 0
            ? weightedChangeSum / calculatedTotalValue
            : 0
        );
        const formattedNfts = nftsData
          .filter((n: HeliusAsset) => n.content?.links?.image)
          .map(
            (n: HeliusAsset): NftData => ({
              id: n.id,
              name: n.content?.metadata?.name || "Unnamed",
              symbol: n.content?.metadata?.symbol || "",
              imageUrl: n.content?.links?.image,
            })
          );
        setNfts(formattedNfts);

        const parsedTransactions = transactionsData
          .map((tx: HeliusApiTransaction) =>
            parseHeliusTransaction(tx, effectiveKey.toBase58())
          )
          .filter(Boolean) as TransactionData[];
        setTransactions(parsedTransactions);

        if (parsedTransactions.length < TX_PAGE_LIMIT) {
          setHasMoreTransactions(false);
        } else {
          setHasMoreTransactions(true);
          setLastTxSignature(
            parsedTransactions[parsedTransactions.length - 1].signature
          );
        }
        setLastSync(new Date());
        if (isRefreshing) toast.success("Data refreshed!");
      } catch (e: unknown) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred.";
        console.error("Failed to fetch dashboard data:", e);
        setError(errorMessage);
        toast.error("Failed to load dashboard data.", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [effectiveKey, connection, apiKey]
  );

  useEffect(() => {
    if (apiKey && (effectiveKey || isViewOnly)) {
      fetchWalletData();
    }
  }, [fetchWalletData, apiKey, effectiveKey, isViewOnly]);

  const fetchMoreTransactions = useCallback(async () => {
    if (!effectiveKey || !lastTxSignature || isFetchingMore || !apiKey) return;
    setIsFetchingMore(true);
    try {
      const newTxData = await apiService.getTransactions(effectiveKey, apiKey, {
        limit: TX_PAGE_LIMIT,
        before: lastTxSignature,
      });
      if (newTxData && newTxData.length > 0) {
        const parsedNewTxs = newTxData
          .map((tx: HeliusApiTransaction) =>
            parseHeliusTransaction(tx, effectiveKey.toBase58())
          )
          .filter(Boolean) as TransactionData[];
        setTransactions((p) => {
          const combined = [...p, ...parsedNewTxs];
          return Array.from(new Map(combined.map((t) => [t.id, t])).values());
        });
        setLastTxSignature(parsedNewTxs[parsedNewTxs.length - 1].signature);
        if (parsedNewTxs.length < TX_PAGE_LIMIT) setHasMoreTransactions(false);
      } else {
        setHasMoreTransactions(false);
      }
    } catch (e) {
      console.error("Failed to fetch more transactions:", e);
      toast.error("Could not load more transactions.");
    } finally {
      setIsFetchingMore(false);
    }
  }, [effectiveKey, lastTxSignature, isFetchingMore, apiKey]);

  const handleSetApiKey = async (newKey: string): Promise<boolean> => {
    const trimmedKey = newKey.trim();
    if (!trimmedKey) {
      localStorage.removeItem("heliusApiKey");
      setApiKey("");
      toast.info("API Key cleared.");
      return true;
    }
    if (trimmedKey.length < 32) {
      toast.error("Invalid API key format.");
      return false;
    }
    const validationToast = toast.loading("Validating API Key...");
    const validationResult = await apiService.getNetworkStatus(trimmedKey);
    if (validationResult) {
      toast.success("API Key is valid!", { id: validationToast });
      localStorage.setItem("heliusApiKey", trimmedKey);
      setApiKey(trimmedKey);
      return true;
    } else {
      toast.error("Invalid or non-functional API Key.", {
        id: validationToast,
      });
      return false;
    }
  };

  const handleSetViewOnlyKey = (keyStr: string) => {
    try {
      const newKey = new PublicKey(keyStr);
      disconnect();
      setViewOnlyKeyInternal(newKey);
      toast.success(
        `Now viewing wallet: ${keyStr.slice(0, 4)}...${keyStr.slice(-4)}`
      );
    } catch {
      toast.error("Invalid public key entered.");
    }
  };
  const clearViewOnlyKey = () => {
    setViewOnlyKeyInternal(null);
    toast.info("Exited view-only mode.");
  };
  const refresh = () => {
    fetchWalletData(true);
  };

  const value: DashboardContextState = {
    tokens,
    nfts,
    transactions,
    networkStatus,
    totalValue,
    change24h,
    isLoading,
    error,
    lastSync,
    refresh,
    fetchMoreTransactions,
    isFetchingMore,
    hasMoreTransactions,
    isViewOnly,
    effectiveKey,
    setViewOnlyKey: handleSetViewOnlyKey,
    clearViewOnlyKey,
    apiKey,
    setApiKey: handleSetApiKey,
    isKeyInitialized,
  };
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined)
    throw new Error("useDashboard must be used within a DashboardDataProvider");
  return context;
};
