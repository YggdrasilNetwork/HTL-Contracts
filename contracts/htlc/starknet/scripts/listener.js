require('dotenv').config();
const Web3 = require('web3');

// connect to starknet provider (make sure this is the correct testnet/mainnet URL)
const web3 = new Web3('https://alpha4.starknet.io');

// contract address and ABI (replace with your deployed contract address and ABI)
const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const contractABI = require('../starknet-artifacts/contracts/USDC_Lock.json').abi;

const contract = new web3.eth.Contract(contractABI, contractAddress);

// listen for the USDC_Locked event
contract.events.USDC_Locked()
.on('data', async (event) => {
    const { sender, amount, lock_time } = event.returnValues;
    console.log(`USDC locked by: ${sender}, amount: ${amount}, at time: ${lock_time}`);

    // trigger rest api call to release BTC or other action
    await triggerBTCRelease(sender, amount);
})
.on('error', console.error);

// function to trigger BTC release through rest API
async function triggerBTCRelease(sender, amount) {
    try {
        const response = await fetch(process.env.BTC_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, amount })
        });
        console.log('BTC release triggered', response.status);
    } catch (error) {
        console.error('Error triggering BTC release:', error);
    }
}
