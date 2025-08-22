import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { HeliusAsset } from "@/types/helius";

export const HELIUS_RPC_URL = (apiKey: string) =>
  `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
const HELIUS_API_URL_V0 = `https://api.helius.xyz/v0`;

interface JupiterPriceData {
  usdPrice: number;
  priceChange24h: number;
}
interface EpochInfo {
  absoluteSlot: number;
  blockHeight: number;
  epoch: number;
  transactionCount: number;
}

export const apiService = {
  async getWalletAssets(
    publicKey: PublicKey,
    connection: Connection,
    apiKey: string
  ): Promise<any[] | null> {
    try {
      if (!apiKey) throw new Error("Helius API key is required.");
      const rpcUrl = HELIUS_RPC_URL(apiKey);

      let allHeliusAssets: HeliusAsset[] = [];
      let page = 1;
      const limit = 1000;
      let solBalanceLamports = 0;

      while (true) {
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getAssetsByOwner",
            params: {
              ownerAddress: publicKey.toBase58(),
              page: page,
              limit: limit,
              displayOptions: { showFungible: true, showNativeBalance: true },
            },
          }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error)
          throw new Error(`Helius RPC Error: ${data.error.message}`);

        const { result } = data;

        if (result.nativeBalance?.lamports) {
          solBalanceLamports = result.nativeBalance.lamports;
        }

        if (result.items?.length > 0)
          allHeliusAssets = allHeliusAssets.concat(result.items);
        if (result.items?.length < limit || page > 30) break;
        page++;
      }

      const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

      const tokenIds = allHeliusAssets
        .filter((a) => a.interface === "FungibleToken" && a.token_info)
        .map((a) => a.id);
      const SOL_MINT = "So11111111111111111111111111111111111111112";
      const priceData = await this.getJupiterPrices([SOL_MINT, ...tokenIds]);

      const solPriceInfo = priceData[SOL_MINT];
      const solAsset = {
        id: SOL_MINT,
        symbol: "SOL",
        name: "Solana",
        balance: solBalance,
        price: solPriceInfo?.usdPrice || 0,
        value: solBalance * (solPriceInfo?.usdPrice || 0),
        change24h: solPriceInfo?.priceChange24h || 0,
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      };
      const tokenAssets = allHeliusAssets
        .filter((a) => a.interface === "FungibleToken" && a.token_info)
        .map((asset) => {
          const priceInfo = priceData[asset.id];
          const balance = asset.token_info?.decimals
            ? asset.token_info.balance / 10 ** asset.token_info.decimals
            : 0;
          const price = priceInfo?.usdPrice || 0;
          return {
            id: asset.id,
            symbol: asset.content.metadata.symbol,
            name: asset.content.metadata.name,
            balance: balance,
            price: price,
            value: balance * price,
            change24h: priceInfo?.priceChange24h || 0,
            image: asset.content.links?.image,
          };
        });
      return [solAsset, ...tokenAssets].sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error("Failed to get wallet assets:", error);
      return null;
    }
  },

  async getJupiterPrices(
    tokenIds: string[]
  ): Promise<Record<string, JupiterPriceData>> {
    if (tokenIds.length === 0) return {};
    const CHUNK_SIZE = 50;
    const allPrices: Record<string, JupiterPriceData> = {};
    const requests: Promise<Response>[] = [];
    for (let i = 0; i < tokenIds.length; i += CHUNK_SIZE) {
      const chunk = tokenIds.slice(i, i + CHUNK_SIZE);
      requests.push(
        fetch(`https://lite-api.jup.ag/price/v3?ids=${chunk.join(",")}`)
      );
    }
    try {
      const responses = await Promise.all(requests);
      const jsonResponses = await Promise.all(
        responses.map((res) => res.json())
      );
      for (const json of jsonResponses) {
        for (const id in json) {
          if (json[id])
            allPrices[id] = {
              usdPrice: json[id].usdPrice,
              priceChange24h: json[id].priceChange24h || 0,
            };
        }
      }
    } catch (error) {
      console.error("Failed to fetch Jupiter prices in chunks:", error);
    }
    return allPrices;
  },

  async getNFTs(publicKey: PublicKey, apiKey: string): Promise<any[] | null> {
    try {
      if (!apiKey) return [];
      const rpcUrl = HELIUS_RPC_URL(apiKey);
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getAssetsByOwner",
          params: {
            ownerAddress: publicKey.toBase58(),
            page: 1,
            limit: 1000,
            displayOptions: {
              showCollectionMetadata: true,
              showFungible: false,
            },
          },
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.error)
        throw new Error(`Helius RPC Error: ${data.error.message}`);
      return data.result?.items || [];
    } catch (error) {
      console.error("Failed to get NFTs:", error);
      return null;
    }
  },

  async getTransactions(
    publicKey: PublicKey,
    apiKey: string,
    options: { limit?: number; before?: string } = {}
  ): Promise<any[] | null> {
    try {
      if (!apiKey) return [];
      let url = `${HELIUS_API_URL_V0}/addresses/${publicKey.toBase58()}/transactions?api-key=${apiKey}`;
      if (options.limit) url += `&limit=${options.limit}`;
      if (options.before) url += `&before=${options.before}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error("Failed to get transactions:", error);
      return null;
    }
  },

  async getNetworkStatus(apiKey: string): Promise<EpochInfo | null> {
    try {
      if (!apiKey) throw new Error("Helius API key is required.");
      const rpcUrl = HELIUS_RPC_URL(apiKey);
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "getEpochInfo",
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.error)
        throw new Error(`Helius RPC Error: ${data.error.message}`);
      return data.result;
    } catch (error) {
      if (error instanceof Error && !error.message.includes("401")) {
        console.error("Failed to get network status:", error);
      }
      return null;
    }
  },
};
