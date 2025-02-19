import { Transaction } from "@mysten/sui/transactions";
import { packageId, treasuryId } from "../constants";

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
const treasuryCapId =
  "0x7fca902adc59a21283f407b271c2b6604d75d45a73f7cc9b97cfa311ab8db4cc";
export const setNftMintCost = (
  treasuryData: any,
  cost: number,
): Transaction => {
  const setCostTx = new Transaction();
  console.log("treasuryData", treasuryData.data.content.fields.id.id);
  console.log("cost in setNftMintCost ", cost);
  setCostTx.moveCall({
    target: `${packageId}::nfttest::set_nft_mint_cost`,
    arguments: [
      //TO-DO: Not safe to use ro pass the treasury id
      treasuryCapId,
      treasuryData.data.content,
      setCostTx.pure.u64(cost),
    ],
  });
  console.log("setCostTx", setCostTx);
  return setCostTx;
};
