import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
      <div className="flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
        <span className="text-lg text-neutral-400">Initializing...</span>
      </div>
    </div>
  );
}
