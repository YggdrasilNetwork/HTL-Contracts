const { createPublicClient, http, watchContractEvent } = require('viem');
const ethers = require('ethers');
const callAPI = require('./callAPI');  // Script to handle API call
const HTLC_ABI = require('../abi/HTLCUSDC.json');

require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RSK_PROVIDER);
const client = createPublicClient({
  transport: http(provider),
});

const contractAddress = process.env.CONTRACT_ADDRESS;

// Watch for the APICallTriggered event
watchContractEvent({
  client,
  abi: HTLC_ABI.abi,
  address: contractAddress,
  eventName: 'APICallTriggered',
  onLogs: (logs) => {
    logs.forEach(log => {
      const { apiKey, usdcAmount, btcRecipient, btcAmount } = log.args;
      console.log(`API Call Event Detected: USDC: ${usdcAmount}, BTC Address: ${btcRecipient}, BTC Amount: ${btcAmount}`);
      
      // Trigger the external API call
      callAPI(apiKey, usdcAmount, btcRecipient, btcAmount);
    });
  }
});

console.log('Listening for APICallTriggered events...');
