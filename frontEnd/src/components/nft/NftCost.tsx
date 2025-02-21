import React, { useState } from "react";
import { Box, Stack, Typography, Button, TextField } from "@mui/material";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";

import { setNftMintCost } from "../../../utils/contract";

import { treasuryId } from "../../../constants";

interface TreasuryData {
  data?: {
    content?: {
      fields?: {
        nft_mint_cost: string;
      };
    };
  };
}

export default function NftCost({ treasuryCap }: { treasuryCap: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newCost, setNewCost] = useState("");
  const client = useSuiClient();
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

  const { data: treasuryData, refetch } = useSuiClientQuery("getObject", {
    id: treasuryId,
    options: {
      showContent: true,
    },
  });

  const currentCost =
    (treasuryData as TreasuryData)?.data?.content?.fields?.nft_mint_cost || "0";

  const handleUpdateCost = async () => {
    const costInMist = Number(newCost) * 1_000_000_000;
    const tx = setNftMintCost(treasuryCap, costInMist);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: async (result) => {
          console.log("result", result.objectChanges);
          await refetch();
          setIsEditing(false);
          setNewCost("");
        },
      },
    );
  };

  return (
    <Stack
      spacing={2}
      sx={{
        borderTop: 1,
        borderBottom: 1,
        borderColor: "grey.500",
        py: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        NFT COST
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" fontWeight="bold">
          Treasury ID:
        </Typography>
        <Box sx={{ maxWidth: 200 }}>
          <TextField
            variant="outlined"
            size="small"
            value={treasuryId}
            InputProps={{
              readOnly: true,
              sx: { color: "white" },
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="subtitle2" fontWeight="bold">
          Current NFT Mint Cost:
        </Typography>
        <Box sx={{ maxWidth: 200 }}>
          <TextField
            variant="outlined"
            size="small"
            value={`${Number(currentCost) / 1000000000} SUI`}
            InputProps={{
              readOnly: true,
              sx: { color: "white" },
            }}
          />
        </Box>
        <Button variant="contained" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Update Cost"}
        </Button>
      </Stack>

      {isEditing && (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            value={newCost}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewCost(event.target.value)
            }
            placeholder="Enter new cost"
            InputProps={{
              sx: { color: "white" },
            }}
          />
          <Button variant="contained" onClick={handleUpdateCost}>
            Submit
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
