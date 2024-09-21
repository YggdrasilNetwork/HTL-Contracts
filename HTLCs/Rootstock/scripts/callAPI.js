const axios = require('axios');
require('dotenv').config();

async function callAPI(erc20Amount, btcRecipient, btcAmount) {
    try {
        const apiKey = process.env.API_KEY;  // Load API key from environment variables
        const apiUrl = process.env.API_URL;  // Load API URL from environment variables

        const response = await axios.post(apiUrl, {
            apiKey: apiKey,
            erc20Amount: erc20Amount,  // The amount of ERC20 tokens that were locked
            btcRecipient: btcRecipient,  // Bitcoin address to release BTC to
            btcAmount: btcAmount  // BTC equivalent amount to release
        });

        console.log(`API call successful: ${response.data}`);
    } catch (error) {
        console.error(`API call failed: ${error.message}`);
    }
}

module.exports = callAPI;
