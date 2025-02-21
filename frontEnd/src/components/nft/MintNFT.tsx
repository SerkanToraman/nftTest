import React, { useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { createMintNFTTransaction } from "../../../utils/contract";
import { Transaction } from "@mysten/sui/transactions";
import { useTreasuryCap } from "../../hooks/useTreasuryCap";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";

export default function MintNFT() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useTreasuryCap();
  const client = useSuiClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  // const [coin, setCoin] = useState("");

  // useEffect(() => {
  //   async function fetchCoins() {
  //     if (!account) return;
  //     try {
  //       const { data } = await client.getCoins({
  //         owner: account.address,
  //         coinType: "0x2::sui::SUI",
  //       });
  //       console.log("data", data);
  //       if (data.length > 0) {
  //         setCoin(data[0].coinObjectId);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch coins:", error);
  //     }
  //   }

  //   fetchCoins();
  // }, [account, client]);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  if (error) {
    return <Box>Error: {error.message}</Box>;
  }

  if (isPending || !data) {
    return <Box>Loading...</Box>;
  }

  const handleMintNFT = () => {
    const tx = new Transaction();
    const splitCoin = tx.splitCoins(tx.gas, [tx.pure.u64(100_000_000)]);
    console.log("splitCoin", splitCoin);
    console.log("data.treasuryCap", data.treasuryCap);
    const mintTx = createMintNFTTransaction(
      data.treasuryCap as string,
      splitCoin,
      name,
      description,
      url,
    );
    console.log("mintTx", mintTx);
    signAndExecuteTransaction(
      {
        transaction: mintTx,
        chain: "sui:testnet",
      },
      {
        onSuccess: async (result) => {
          console.log("result", result.objectChanges);
          // Reset form
          setName("");
          setDescription("");
          setUrl("");
          // setCoin("");
        },
      },
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        backgroundColor: "#f5f5f5", // Light grey background
        borderRadius: 2,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, color: "#2c3e50" }}>
        {" "}
        {/* Darker blue-grey text */}
        Mint NFT
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />

        <TextField
          label="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />
        {url && (
          <Box sx={{ width: "100%", height: 300, overflow: "hidden" }}>
            <img
              src={url}
              alt="NFT Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}
        {/* <TextField
          label="Coin Object ID"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          fullWidth
        /> */}

        <Button
          variant="contained"
          onClick={handleMintNFT}
          disabled={!name || !description || !url}
          sx={{
            backgroundColor: "#3498db", // Light blue
            "&:hover": {
              backgroundColor: "#2980b9", // Slightly darker blue on hover
            },
          }}
        >
          Mint NFT
        </Button>
      </Stack>
    </Box>
  );
}
