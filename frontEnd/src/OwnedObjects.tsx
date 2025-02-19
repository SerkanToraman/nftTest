import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Box, Typography, Stack } from "@mui/material";
import { packageId, treasuryId } from "../constants";
import NftCost from "./components/NftCost";

export function OwnedObjects() {
  const account = useCurrentAccount();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: {
        MatchAll: [{ ObjectId: import.meta.env.VITE_ADMIN_ACCOUNT }],
        //TO-DO: struct type i al
      },
    },
    {
      enabled: !!account,
    },
  );
  console.log("data", data);

  //loop through data and check if any of the objects are from the admin account
  const isAdmin = data?.data.some(
    (object) => object.data?.objectId === import.meta.env.VITE_ADMIN_ACCOUNT,
  );

  console.log("isAdmin", isAdmin);

  if (!account) {
    return;
  }

  if (error) {
    return <Box>Error: {error.message}</Box>;
  }

  if (isPending || !data) {
    return <Box>Loading...</Box>;
  }

  return (
    <Stack direction="column" my={2}>
      {isAdmin ? <NftCost /> : <Typography>You are not the admin</Typography>}
    </Stack>
  );
}
