import axios from "axios";
import { readFileSync } from "fs"; // Node.js module to read files
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount, rootstockTestnet } from "viem/chains";

import { HTLCERC20_BYTECODE, YGN_ADDRESS, YGN_BYTECODE } from "./constants";

// Step 1: Set up provider and signer
const privateKey = process.env.PRIVATE_KEY; // Sender's private key (Party A)
const account = privateKeyToAccount(privateKey);

// Connect to the blockchain
const client = createPublicClient({
    chain: rootstockTestnet,
    transport: http(),
});

const walletClient = createWalletClient({
    account,
    chain: rootstockTestnet,
    transport: http(),
});

// Step 2: Load ABIs from local JSON files
const erc20Abi = JSON.parse(readFileSync("../contracts/YGN.json", "utf-8"));
const htlcAbi = JSON.parse(
    readFileSync("../contracts/HTLCERC20.json", "utf-8")
);

// Step 1: Deploy HTLC contract
async function deployHTLC(recipient, hashlock, timelock, tokenAddress, amount) {
    try {
        const htlcConstructorArgs = [recipient, timelock, tokenAddress, amount];

        const htlcDeployTx = await walletClient.deployContract({
            abi: htlcAbi, // Load ABI from the local file
            bytecode: HTLCERC20_BYTECODE,
            args: htlcConstructorArgs,
        });

        console.log("HTLC deployment transaction hash:", htlcDeployTx);
        const receipt = await client.waitForTransactionReceipt({
            hash: htlcDeployTx,
        });
        const htlcAddress = receipt.contractAddress;
        console.log("HTLC contract deployed at:", htlcAddress);

        return htlcAddress;
    } catch (error) {
        console.error("Error deploying HTLC contract:", error);
        throw error;
    }
}

// Step 2: Approve the HTLC contract to transfer tokens
async function approveTokens(htlcAddress, amount) {
    try {
        const approveTx = await walletClient.writeContract({
            abi: erc20Abi, // Load ABI from the local file
            address: tokenAddress,
            functionName: "approve",
            args: [htlcAddress, amount],
        });

        console.log("Approval transaction hash:", approveTx);
        await client.waitForTransactionReceipt({ hash: approveTx });
        console.log("Tokens approved successfully for HTLC");
    } catch (error) {
        console.error("Error approving tokens:", error);
        throw error;
    }
}

// Step 3: Lock tokens in the HTLC contract
async function lockTokens(htlcAddress) {
    try {
        const lockTx = await walletClient.writeContract({
            abi: htlcAbi, // Load ABI from the local file
            address: htlcAddress,
            functionName: "lockTokens",
        });

        console.log("LockTokens transaction hash:", lockTx);
        await client.waitForTransactionReceipt({ hash: lockTx });
        console.log("Tokens locked in HTLC successfully");
    } catch (error) {
        console.error("Error locking tokens in HTLC:", error);
        throw error;
    }
}

async function callPartyBAPI(partyBAPIUrl, btcRecipient, btcAmount) {
    try {
        // Construct the query parameters for the API call
        const queryParams = `?recipient=${btcRecipient}&amount=${btcAmount}`;

        // Send a GET request to the API with query parameters
        const response = await axios.get(partyBAPIUrl + queryParams);

        console.log(`API call successful: ${response.data}`);
    } catch (error) {
        console.error(`API call failed: ${error.message}`);
    }
}

// Full process orchestrator
const doCrossChainSwap = async (recipient, amount, timelock) => {
    const tokenAddress = YGN_ADDRESS; // ERC20 token contract address
    const partyBAPIUrl = process.env.PARTY_B_API_URL; // API for cross-chain transfer

    try {
        // Step 1: Deploy the HTLC contract
        const htlcAddress = await deployHTLC(
            recipient,
            hashlock,
            timelock,
            tokenAddress,
            amount
        );

        // Step 2: Approve the HTLC contract to spend Party A's tokens
        await approveTokens(htlcAddress, amount);

        // Step 3: Lock the funds in the HTLC contract
        await lockTokens(htlcAddress);

        // Step 4: Call an API to initiate the cross-chain transfer for Party B
        await callPartyBAPI(partyBAPIUrl, recipient, amount);

        console.log("HTLC process completed successfully");
    } catch (error) {
        console.error("HTLC process failed:", error);
    }
};

export default doCrossChainSwap;
