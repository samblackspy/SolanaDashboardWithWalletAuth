import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
  SystemProgram,
} from "@solana/web3.js";
import { apiService } from "@/services/apiService";

interface SendSolParams {
  connection: Connection;
  fromPubkey: PublicKey;
  toAddress: string;
  amount: number;
  sendTransaction: (
    transaction: VersionedTransaction,
    connection: Connection
  ) => Promise<string>;
}

export const walletService = {
  async sendSol({
    connection,
    fromPubkey,
    toAddress,
    amount,
    sendTransaction,
  }: SendSolParams): Promise<string> {
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
    if (isNaN(lamports) || lamports <= 0) {
      throw new Error("Invalid amount.");
    }

    const { blockhash } = await connection.getLatestBlockhash();

    const transferInstruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey: new PublicKey(toAddress),
      lamports,
    });

    const messageV0 = new TransactionMessage({
      payerKey: fromPubkey,
      recentBlockhash: blockhash,
      instructions: [transferInstruction],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    const txSignature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(txSignature, "confirmed");

    return txSignature;
  },

  async getWalletAssets(
    publicKey: PublicKey,
    connection: Connection,
    apiKey: string
  ) {
    return apiService.getWalletAssets(publicKey, connection, apiKey);
  },

  async getRecentTransactions(
    publicKey: PublicKey,
    apiKey: string,
    limit: number = 100
  ) {
    return apiService.getTransactions(publicKey, apiKey, { limit });
  },

  async getNFTs(publicKey: PublicKey, apiKey: string) {
    return apiService.getNFTs(publicKey, apiKey);
  },

  async getNetworkStatus(apiKey: string) {
    return apiService.getNetworkStatus(apiKey);
  },
};
