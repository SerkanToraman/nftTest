import { Box, Typography, Stack } from "@mui/material";
import NftCost from "../nft/NftCost";
import { useTreasuryCap } from "../../hooks/useTreasuryCap";
export function AdminDetails() {
  const { data, isPending, error } = useTreasuryCap();

  if (error) {
    return <Box>Error: {error.message}</Box>;
  }

  if (isPending || !data) {
    return <Box>Loading...</Box>;
  }

  return (
    <Stack direction="column" my={2}>
      {data.isAdmin ? (
        <NftCost treasuryCap={data.treasuryCap as string} />
      ) : (
        <Typography>You are not the admin</Typography>
      )}
    </Stack>
  );
}
