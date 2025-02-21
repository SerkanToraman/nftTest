import { Transaction, TransactionArgument } from "@mysten/sui/transactions";
import { packageId, treasuryId } from "../constants";
import { SuiClient } from "@mysten/sui/client";
import { getFullnodeUrl } from "@mysten/sui/client";

export const createMintNFTTransaction = (
  treasuryCapId: string,
  coin: TransactionArgument,
  name: string,
  description: string,
  url: string,
): Transaction => {
  console.log("coin", coin);
  const mintTx = new Transaction();
  mintTx.moveCall({
    target: `${packageId}::nfttest::mint_to_sender`,
    typeArguments: ["0x2::sui::SUI"],
    arguments: [
      mintTx.object(treasuryCapId),
      mintTx.object(coin),
      mintTx.pure.string(name),
      mintTx.pure.string(description),
      mintTx.pure.string(url),
    ],
  });
  console.log("mintTx", mintTx);
  return mintTx;
};

export const setNftMintCost = (
  treasuryCapId: string,
  cost: number,
): Transaction => {
  const setCostTx = new Transaction();

  setCostTx.moveCall({
    target: `${packageId}::nfttest::set_nft_mint_cost`,
    typeArguments: ["0x2::sui::SUI"],
    arguments: [
      setCostTx.object(treasuryCapId),
      setCostTx.object(treasuryId),
      setCostTx.pure.u64(cost),
    ],
  });

  return setCostTx;
};

export const SuiClientProvider = new SuiClient({
  url: getFullnodeUrl("testnet"),
});
