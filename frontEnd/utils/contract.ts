import { Transaction } from "@mysten/sui/transactions";
import { packageId, treasuryId } from "../constants";
import { SuiClient } from "@mysten/sui/client";
import { getFullnodeUrl } from "@mysten/sui/client";

export const createMintNFTTransaction = (): Transaction => {
  const mintTx = new Transaction();
  mintTx.moveCall({
    target: `${packageId}::nfttest::mint_to_sender`,
    arguments: [
      mintTx.pure.string("The first NFT"),
      mintTx.pure.string("Description of my first NFT"),
      mintTx.pure.string("https://picsum.photos/200/300"),
    ],
  });

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
