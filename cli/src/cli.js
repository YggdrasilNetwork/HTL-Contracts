const readline = require('readline');
const { simulateAggregator } = require('./services/aggregator');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Available options for chains and tokens
const chains = ['Rootstock', 'Flow', 'StarkNet', "Bitcoin"];
const tokens = {
  'Rootstock': ['RBTC', 'ETH', 'USDC', 'YGN'],
  'Flow': ['FLOW', 'USDC', 'ETH', 'YGN'],
  'StarkNet': ['ETH', 'USDC', 'LINK', 'YGN'],
  "Bitcoin": ["Native-BTC"]
};

// Function to get user input and run the aggregator
function runCLI() {
  rl.question('Select Source Chain (Rootstock, Flow, StarkNet, Bitcoin): ', (sourceChain) => {
    if (!chains.includes(sourceChain)) {
      console.log('Invalid chain selection.');
      rl.close();
      return;
    }

    rl.question(`Select Source Token (${tokens[sourceChain].join(', ')}): `, (sourceToken) => {
      if (!tokens[sourceChain].includes(sourceToken)) {
        console.log('Invalid token selection.');
        rl.close();
        return;
      }

      rl.question('Select Destination Chain (Rootstock, Flow, StarkNet, Bitcoin): ', (destinationChain) => {
        if (!chains.includes(destinationChain)) {
          console.log('Invalid chain selection.');
          rl.close();
          return;
        }

        rl.question(`Select Destination Token (${tokens[destinationChain].join(', ')}): `, (destinationToken) => {
          if (!tokens[destinationChain].includes(destinationToken)) {
            console.log('Invalid token selection.');
            rl.close();
            return;
          }

          const source = `${sourceChain}(${sourceToken})`;
          const destination = `${destinationChain}(${destinationToken})`;

          // Run the aggregator simulation
          simulateAggregator(source, destination, sourceChain, destinationChain);
          rl.close();
        });
      });
    });
  });
}

module.exports = { runCLI };
