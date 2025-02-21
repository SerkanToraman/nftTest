import { useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export function useTreasuryCap() {
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ["treasuryCap"],
    queryFn: async () => {
      const client = new SuiClient({
        url: getFullnodeUrl("testnet"),
      });

      const treasuryCapData = await client.getOwnedObjects({
        owner: account?.address ?? "",
        filter: {
          StructType:
            "0x26524571aad7ef877a137507fb36b7dbad978bc9e38301c2d8a64af347830968::nfttest::TreasuryCap",
        },
      });

      return {
        isAdmin: treasuryCapData.data?.length ?? 0 > 0,
        treasuryCap: treasuryCapData.data?.[0]?.data?.objectId,
      };
    },
  });
}
