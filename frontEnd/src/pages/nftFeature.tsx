import React, { useEffect } from "react";
import { initNFTContract } from "../../utils/contract";
import { useSuiClient } from "@mysten/dapp-kit";
import MintNFT from "../components/nft/MintNFT";
import { Container } from "@mui/material";

function NftFeature() {
  const client = useSuiClient();
  // const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
  //   execute: async ({ bytes, signature }) =>
  //     await client.executeTransactionBlock({
  //       transactionBlock: bytes,
  //       signature,
  //       options: {
  //         showRawEffects: true,
  //         showObjectChanges: true,
  //       },
  //     }),
  // });
  // const account = useCurrentAccount();

  // useEffect(() => {
  //   if (import.meta.env.VITE_ADMIN_ACCOUNT === account?.address) {
  //     const tx = initNFTContract();
  //     console.log("tx", tx);
  //     signAndExecuteTransaction(
  //       {
  //         transaction: tx,
  //         chain: "sui:testnet",
  //       },
  //       {
  //         onSuccess: (result) => {
  //           console.log("result", result.objectChanges);
  //         },
  //       },
  //     );
  //   }
  // }, []);

  return (
    <Container>
      <MintNFT />
    </Container>
  );
}

export default NftFeature;
