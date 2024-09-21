import * as fcl from "@onflow/fcl";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Flow testnet configuration
fcl.config()
  .put("accessNode.api", process.env.FLOW_ACCESS_NODE) // Flow Testnet or Mainnet URL
  .put("flow.network", process.env.FLOW_NETWORK) // Flow testnet or mainnet
  .put("0xYourAccountAddress", process.env.FLOW_ACCOUNT_ADDRESS);

// Function to send transactions to the Flow blockchain
export async function sendTransaction(cadenceCode: string, args: any[] = []) {
  // Wrap fcl.authz in a function that returns a Promise
  const authzFunction = () => fcl.authz;

  const transactionId = await fcl
    .send([
      fcl.transaction`${cadenceCode}`, // Transaction code in Cadence
      fcl.args(args),                   // Arguments to pass to the transaction
      fcl.payer(authzFunction),         // Pass a function that returns the authz function
      fcl.proposer(authzFunction),      // Pass a function that returns the authz function
      fcl.authorizations([authzFunction]), // Pass as an array of functions
      fcl.limit(999),                   // Set a gas limit for the transaction
    ])
    .then(fcl.decode);  // Decode the transaction ID

  // Wait for the transaction to be sealed
  return fcl.tx(transactionId).onceSealed();
}
