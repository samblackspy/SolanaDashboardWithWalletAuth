import { WalletButton } from "@/components/dashboard/WalletButton";
import { Balance } from "@/components/dashboard/Balance";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
          Solana Dashboard
        </h1>
      </div>

      <div className="relative z-10">
        <WalletButton />
      </div>

      <Balance />
    </div>
  );
}