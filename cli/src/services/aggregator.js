// Import the mock data
const pools = require('./mockData');
const { findBestPath } = require('./pathFinder');

// Function to simulate the aggregator functionality
function simulateAggregator(sourceToken, destinationToken, sourceChain, destinationChain) {
  console.log(`Finding path from ${sourceToken} (${sourceChain}) to ${destinationToken} (${destinationChain})...\n`);

  // Find the optimal path using the mock data
  const path = findBestPath(sourceToken, destinationToken, sourceChain, destinationChain, pools);

  if (!path) {
    console.log('No valid path found.');
    return;
  }

  console.log('Path found:');
  path.forEach((step, index) => {
    console.log(`Step ${index + 1}: ${step.Token0} -> ${step.Token1}`);
  });

  // Simulate how much of each token you'd receive based on x*y=k ratio
  path.forEach((step) => {
    const k = step.liquidityToken0 * step.liquidityToken1;
    const receivedToken1 = k / (step.liquidityToken0 + 100); // Simulate swap with a small amount
    console.log(`Swapped 100 ${step.Token0} for ${receivedToken1.toFixed(2)} ${step.Token1}`);
  });
}

module.exports = { simulateAggregator };
