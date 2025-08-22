export interface TransactionInfo {
  id: string;
  type: "send" | "receive" | "swap" | "stake" | "unstake" | "unknown";
  action: string;
  amount: string;
  unixTimestamp: number;
  signature: string;
  fee?: string;
  status?: "confirmed" | "pending" | "failed";
  from?: {
    address?: string;
    token?: string;
    amount?: number | string;
    symbol?: string;
    validator?: string;
  };
  to?: {
    address?: string;
    token?: string;
    amount?: number | string;
    symbol?: string;
    validator?: string;
  };
}

export const parseTransactionToAction = (
  tx: any,
  walletAddress: string
): TransactionInfo | null => {
  const {
    signature,
    timestamp,
    type,
    tokenTransfers,
    nativeTransfers,
    events,
    description,
  } = tx;
  let action = "Unknown Transaction";
  let amount = "";
  let txType: TransactionInfo["type"] = type?.toLowerCase() || "unknown";

  const unixTimestamp =
    typeof timestamp === "number"
      ? timestamp
      : Math.floor(new Date(timestamp).getTime() / 1000);

  const result: TransactionInfo = {
    id: signature,
    type: txType,
    action: description || action,
    amount,
    unixTimestamp,
    signature,
    status: tx.transactionError ? "failed" : "confirmed",
  };

  if (type === "TRANSFER") {
    const relevantTransfer =
      tokenTransfers?.find(
        (t: any) =>
          t.fromUserAccount === walletAddress ||
          t.toUserAccount === walletAddress
      ) ||
      nativeTransfers?.find(
        (t: any) =>
          t.fromUserAccount === walletAddress ||
          t.toUserAccount === walletAddress
      );

    if (relevantTransfer) {
      const isSender = relevantTransfer.fromUserAccount === walletAddress;
      const tokenAmount =
        relevantTransfer.tokenAmount || relevantTransfer.amount / 1e9;
      const symbol = relevantTransfer.mint ? "Token" : "SOL";

      result.type = isSender ? "send" : "receive";
      result.amount = `${isSender ? "-" : "+"}${tokenAmount.toFixed(
        4
      )} ${symbol}`;

      const fallbackAction = isSender
        ? `to ${relevantTransfer.toUserAccount.slice(
            0,
            4
          )}...${relevantTransfer.toUserAccount.slice(-4)}`
        : `from ${relevantTransfer.fromUserAccount.slice(
            0,
            4
          )}...${relevantTransfer.fromUserAccount.slice(-4)}`;

      result.action = description || fallbackAction;
    }
  } else if (tx.source === "JUPITER" || type === "SWAP") {
    result.type = "swap";
    result.action = description || "Token Swap";
  } else if (tx.source === "STAKE_PROGRAM") {
    result.type = tx.type.toLowerCase().includes("delegate")
      ? "stake"
      : "unstake";
    const lamports =
      tx.nativeTransfers?.reduce(
        (acc: number, curr: any) => acc + curr.amount,
        0
      ) || 0;
    result.amount = `${(lamports / 1e9).toFixed(4)} SOL`;
    result.action =
      description || `${result.type === "stake" ? "Stake" : "Unstake"} SOL`;
  }

  if (result.action === "Unknown Transaction" && description) {
    result.action = description;
  }

  return result;
};

export const parseHeliusTransaction = (
  tx: any,
  walletAddress: string
): TransactionInfo => {
  const parsed = parseTransactionToAction(tx, walletAddress) || {
    id: tx.signature,
    type: "unknown",
    action: tx.description || "Unknown Transaction",
    amount: "",
    unixTimestamp:
      typeof tx.timestamp === "number"
        ? tx.timestamp
        : Math.floor(new Date(tx.timestamp).getTime() / 1000),
    signature: tx.signature,
    status: tx.transactionError ? "failed" : "confirmed",
  };

  return {
    ...parsed,
    fee: tx.fee ? `${(tx.fee / 1e9).toFixed(9)} SOL` : "0 SOL",
  };
};
