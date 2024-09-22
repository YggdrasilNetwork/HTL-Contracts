// Function to find paths within the same chain
function findIntraChainPath(sourceToken, destinationToken, chain, pools) {
  console.log('Finding intra-chain path...', sourceToken, destinationToken, chain, pools); // Debugging

  let path = [];
  let intermediateToken = `${chain}(YGN)`; // Using YGN as the intermediate token within the same chain

  // Ensure pools is not undefined
  if (!pools) {
    console.log('Pools data is undefined');
    return null;
  }

  // Find sourceToken -> YGN
  let pool1 = pools.find(pool =>
    (pool.Token0 === sourceToken && pool.Token1 === intermediateToken) ||
    (pool.Token1 === sourceToken && pool.Token0 === intermediateToken)
  );
  if (!pool1) return null;

  // Find YGN -> destinationToken
  let pool2 = pools.find(pool =>
    (pool.Token0 === intermediateToken && pool.Token1 === destinationToken) ||
    (pool.Token1 === intermediateToken && pool.Token0 === destinationToken)
  );
  if (!pool2) return null;

  // Build the path
  path.push(pool1);
  path.push(pool2);

  return path;
}

// Function to find cross-chain paths
function findCrossChainPath(sourceToken, destinationToken, sourceChain, destinationChain, pools) {
  console.log('Finding cross-chain path...', sourceToken, destinationToken, sourceChain, destinationChain, pools); // Debugging

  let path = [];
  let sourceIntermediateToken = `${sourceChain}(YGN)`;
  let destinationIntermediateToken = `${destinationChain}(YGN)`;

  // Step 1: SourceToken -> SourceChain(YGN)
  let pool1 = pools.find(pool =>
    (pool.Token0 === sourceToken && pool.Token1 === sourceIntermediateToken) ||
    (pool.Token1 === sourceToken && pool.Token0 === sourceIntermediateToken)
  );
  if (!pool1) return null;

  // Step 2: Cross-chain transfer SourceChain(YGN) -> DestinationChain(YGN)
  let crossChainPool = pools.find(pool =>
    (pool.Token0 === sourceIntermediateToken && pool.Token1 === destinationIntermediateToken) ||
    (pool.Token1 === sourceIntermediateToken && pool.Token0 === destinationIntermediateToken)
  );
  if (!crossChainPool) return null;

  // Step 3: DestinationChain(YGN) -> DestinationToken
  let pool2 = pools.find(pool =>
    (pool.Token0 === destinationIntermediateToken && pool.Token1 === destinationToken) ||
    (pool.Token1 === destinationIntermediateToken && pool.Token0 === destinationToken)
  );
  if (!pool2) return null;

  // Build the path
  path.push(pool1);
  path.push(crossChainPool);
  path.push(pool2);

  return path;
}

// Function to find the best swap path
function findBestPath(sourceToken, destinationToken, sourceChain, destinationChain, pools) {
  console.log('Finding best path...', sourceToken, destinationToken, sourceChain, destinationChain); // Debugging
  if (sourceChain === destinationChain) {
    // Intra-chain swap
    return findIntraChainPath(sourceToken, destinationToken, sourceChain, pools);
  } else {
    // Cross-chain swap
    return findCrossChainPath(sourceToken, destinationToken, sourceChain, destinationChain, pools);
  }
}

module.exports = { findBestPath };
