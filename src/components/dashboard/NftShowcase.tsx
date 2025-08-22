"use client";

import { useDashboard } from "@/context/DashboardDataProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { LazyImage } from "../ui/LazyImage";

export const NftShowcase = () => {
  const { nfts, isLoading, error, effectiveKey } = useDashboard();

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="bg-neutral-800 rounded-lg aspect-square animate-pulse"
        ></div>
      ))}
    </div>
  );

  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
          NFT SHOWCASE
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && nfts.length === 0 ? (
          renderSkeleton()
        ) : !effectiveKey ? (
          <div className="text-center py-10 text-neutral-400">
            Connect a wallet or enter one to view NFTs.
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">
            No NFTs found in this wallet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-800"
              >
                {nft.imageUrl ? (
                  <LazyImage
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500 p-2 text-center">
                    {nft.symbol || "No Image"}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center backdrop-blur-sm">
                  <p className="text-xs font-bold text-white truncate">
                    {nft.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
