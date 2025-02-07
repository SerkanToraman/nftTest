import { Transaction } from "@mysten/sui/transactions";
import { packageId } from "../constants";

export const initNFTContract = (): Transaction => {
  const initTx = new Transaction();
  initTx.moveCall({
    target: `${packageId}::nfttest::init`,
  });
  return initTx;
};

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
