import "dotenv/config";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import { SuiClient, SuiObjectChange, getFullnodeUrl } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import path, { dirname } from "path";
import { writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const priv_Key = process.env.PRIVATE_KEY;
if (!priv_Key) {
  throw new Error("PRIVATE_KEY is not set");
}
const path_to_scripts = dirname(fileURLToPath(import.meta.url));

const keyPair = Ed25519Keypair.fromSecretKey(fromBase64(priv_Key).slice(1));

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

const path_to_contracts = path.join(path_to_scripts, "../../contracts");

const { dependencies, modules } = JSON.parse(
  execSync(
    `sui move build --dump-bytecode-as-base64 --path ${path_to_contracts}`,
    { encoding: "utf-8" }
  )
);
console.log("Deploying contracts...", keyPair.toSuiAddress());
console.log(dependencies, modules);

const deploy_trx = new Transaction();

const [upgradeCap] = deploy_trx.publish({
  modules,
  dependencies,
});

// Transfer the upgrade capability object to the deployer address
deploy_trx.transferObjects([upgradeCap], keyPair.getPublicKey().toSuiAddress());

const { objectChanges, balanceChanges } =
  await client.signAndExecuteTransaction({
    signer: keyPair,
    transaction: deploy_trx,
    options: {
      showBalanceChanges: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  });
console.log("Transaction Successful:", objectChanges, balanceChanges);

if (!balanceChanges) {
  throw new Error("Error: Balance changes not found");
}

if (!objectChanges) {
  throw new Error("Error: Object changes not found");
}

function parse_amount(amount: string) {
  return Number(amount) / 10 ** 9;
}

const amount = parse_amount(balanceChanges[0].amount);
console.log("Amount:", amount);

const publishedChange = objectChanges.find(
  (change) => change.type === "published"
);
if (publishedChange?.type !== "published") {
  console.error("Error: Published change not found");
  process.exit(1);
}

// function find_one_by_type(changes: SuiObjectChange[], type: string) {
//   console.log("Looking for changes:", changes);
//   const object_change = changes.find((change) => change.type === "created");
//   if (object_change?.type === "created") {
//     return object_change.objectId;
//   } else {
//     throw new Error(`Error: ${type} change not found`);
//   }
// }

const deployed_address: { PACKAGE_ID: string; NFT_TEST_ID?: string } = {
  PACKAGE_ID: publishedChange.packageId,
};

// Add mint transaction
// const mintTx = new Transaction();
// mintTx.moveCall({
//   target: `${deployed_address.PACKAGE_ID}::nfttest::mint_to_sender`,
//   arguments: [
//     Transaction.arguments.pure("My NFT"),
//     Transaction.arguments.pure("Description of my NFT"),
//     Transaction.arguments.pure("https://example.com/nft-image.png"),
//   ],
// });

// // Execute mint transaction
// const mintResult = await client.signAndExecuteTransaction({
//   signer: keyPair,
//   transaction: mintTx,
//   options: {
//     showBalanceChanges: true,
//     showEffects: true,
//     showEvents: true,
//     showObjectChanges: true,
//   },
// });


// const nfttest_type = `${deployed_address.PACKAGE_ID}::nfttest::TestNFT`;
// const nfttest_id = find_one_by_type(objectChanges, nfttest_type);
// if (!nfttest_id) {
//   throw new Error("Error: NFT test not found");
// }

// deployed_address.NFT_TEST_ID = nfttest_id;

const deployed_path = path.join(
  path_to_scripts,
  "../src/deployed_objects.json"
);
writeFileSync(deployed_path, JSON.stringify(deployed_address, null, 2));
