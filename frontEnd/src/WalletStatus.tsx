import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Typography, Stack } from "@mui/material";
import { OwnedObjects } from "./OwnedObjects";

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <Container sx={{ my: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Wallet Status
      </Typography>

      {account ? (
        <Stack spacing={1}>
          <Typography>Wallet connected</Typography>
          <Typography>Address: {account.address}</Typography>
          <OwnedObjects />
        </Stack>
      ) : (
        <Typography>Wallet not connected</Typography>
      )}
    </Container>
  );
}
