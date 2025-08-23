"use client";

import { useState, useCallback, ComponentPropsWithoutRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { toast } from "sonner";
import {
  Send,
  Download,
  Repeat,
  ExternalLink,
  Copy,
  Loader2,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/context/DashboardDataProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  tooltip: string;
  disabledTooltip?: string;
}

export const QuickActions = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { isViewOnly, effectiveKey } = useDashboard();

  const [sendOpen, setSendOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const handleSend = useCallback(async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("Wallet not connected.");
      return;
    }
    if (isViewOnly) {
      toast.error("Cannot send transactions in view-only mode.");
      return;
    }
    let recipientPubKey: PublicKey;
    try {
      recipientPubKey = new PublicKey(recipient);
    } catch {
      toast.error("Invalid recipient address.");
      return;
    }
    const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
    if (isNaN(lamports) || lamports <= 0) {
      toast.error("Invalid amount.");
      return;
    }
    setIsSending(true);
    setSignature("");
    setError("");
    try {
      const { blockhash } = await connection.getLatestBlockhash();
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubKey,
            lamports,
          }),
        ],
      }).compileToV0Message();
      const transaction = new VersionedTransaction(messageV0);
      const txSignature = await sendTransaction(transaction, connection);
      setSignature(txSignature);
      toast.success("Transaction sent successfully!");
      await connection.confirmTransaction(txSignature, "confirmed");
      toast.success("Transaction confirmed!");
      setTimeout(() => {
        setSendOpen(false);
        setRecipient("");
        setAmount("");
        setSignature("");
      }, 3000);
    } catch (err: unknown) {
      console.error("Transaction failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast.error("Transaction failed.", { description: errorMessage });
    } finally {
      setIsSending(false);
    }
  }, [publicKey, sendTransaction, connection, recipient, amount, isViewOnly]);

  const handleCopyAddress = () => {
    if (effectiveKey) {
      navigator.clipboard.writeText(effectiveKey.toBase58());
      setCopySuccess("Copied!");
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  const ActionButton = ({
    children,
    tooltip,
    disabled,
    disabledTooltip,
    ...props
  }: ActionButtonProps) => {
    const finalDisabled = disabled;
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center gap-2 group">
              <Button disabled={finalDisabled} {...props}>
                {children}
              </Button>
              <span
                className={`text-xs text-neutral-400 ${
                  !finalDisabled
                    ? "group-hover:text-white"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {tooltip}
              </span>
            </div>
          </TooltipTrigger>
          {finalDisabled && (
            <TooltipContent>
              <p>
                {disabledTooltip ||
                  (isViewOnly
                    ? "Action disabled in view-only mode"
                    : "Connect wallet to use")}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex justify-around items-center p-4 bg-neutral-900 h-full">
      <Dialog
        open={sendOpen}
        onOpenChange={(open) => {
          if (isViewOnly || !publicKey) return;
          setSendOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div>
            <ActionButton
              tooltip="Send"
              disabled={!publicKey || isViewOnly}
              className="w-14 h-14 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 data-[disabled=true]:text-neutral-500 data-[disabled=true]:bg-neutral-800 data-[disabled=true]:cursor-not-allowed"
            >
              <Send size={24} />
            </ActionButton>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle>Send SOL</DialogTitle>
            <DialogDescription>
              Enter the recipient address and amount to send.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="recipient"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-neutral-800 border-neutral-600"
            />
            <Input
              id="amount"
              placeholder="Amount (SOL)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-neutral-800 border-neutral-600"
            />
          </div>
          {signature && (
            <div className="text-center text-green-500 text-sm">
              <p>Success!</p>
              <a
                href={`https://solscan.io/tx/${signature}?cluster=mainnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 underline"
              >
                View on Solscan <ExternalLink size={12} />
              </a>
            </div>
          )}
          {error && <p className="text-center text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button
              onClick={handleSend}
              disabled={isSending || !publicKey}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? "Sending..." : "Send Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={receiveOpen}
        onOpenChange={(open) => {
          if (!effectiveKey) return;
          setReceiveOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div>
            <ActionButton
              tooltip="Receive"
              disabled={!effectiveKey}
              className="w-14 h-14 rounded-full bg-green-500/20 hover:bg-green-500/30 text-green-400 data-[disabled=true]:text-neutral-500 data-[disabled=true]:bg-neutral-800 data-[disabled=true]:cursor-not-allowed"
            >
              <Download size={24} />
            </ActionButton>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-700 text-white">
          <DialogHeader>
            <DialogTitle>Receive Assets</DialogTitle>
            <DialogDescription>
              Scan the QR code or copy the address below to receive assets.
            </DialogDescription>
          </DialogHeader>
          {effectiveKey ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeCanvas value={effectiveKey.toBase58()} size={200} />
              </div>
              <div className="w-full p-2 bg-neutral-800 rounded-md text-center font-mono text-xs break-all">
                {effectiveKey.toBase58()}
              </div>
              <Button
                onClick={handleCopyAddress}
                className="w-full bg-neutral-700 hover:bg-neutral-600"
              >
                <Copy size={16} className="mr-2" />{" "}
                {copySuccess || "Copy Address"}
              </Button>
            </div>
          ) : (
            <p className="text-center text-neutral-400 py-8">
              Connect a wallet or enter a public key to view an address.
            </p>
          )}
        </DialogContent>
      </Dialog>
      <ActionButton
        tooltip="Swap"
        disabled={true}
        disabledTooltip="Coming Soon"
        className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-400 data-[disabled=true]:text-neutral-500 data-[disabled=true]:bg-neutral-800 data-[disabled=true]:cursor-not-allowed"
      >
        <Repeat size={24} />
      </ActionButton>
    </div>
  );
};
