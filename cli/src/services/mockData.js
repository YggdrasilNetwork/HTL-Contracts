const pools = [
    // Rootstock Pools
    { Token0: 'Rootstock(RBTC)', Token1: 'Rootstock(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 25000, priceToken1: 1 },
    { Token0: 'Rootstock(ETH)', Token1: 'Rootstock(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1800, priceToken1: 1 },
    { Token0: 'Rootstock(USDC)', Token1: 'Rootstock(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1, priceToken1: 1 },
  
    // Flow Pools
    { Token0: 'Flow(FLOW)', Token1: 'Flow(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 10, priceToken1: 1 },
    { Token0: 'Flow(ETH)', Token1: 'Flow(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1800, priceToken1: 1 },
    { Token0: 'Flow(USDC)', Token1: 'Flow(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1, priceToken1: 1 },
  
    // StarkNet Pools
    { Token0: 'StarkNet(ETH)', Token1: 'StarkNet(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1800, priceToken1: 1 },
    { Token0: 'StarkNet(LINK)', Token1: 'StarkNet(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 7, priceToken1: 1 },
    { Token0: 'StarkNet(USDC)', Token1: 'StarkNet(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1, priceToken1: 1 },
  
    // Cross-Chain Pools
    { Token0: 'Rootstock(YGN)', Token1: 'Flow(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1, priceToken1: 1 },
    { Token0: 'Flow(YGN)', Token1: 'StarkNet(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1, priceToken1: 1 },
    { Token0: 'StarkNet(YGN)', Token1: 'Rootstock(YGN)', liquidityToken0: 100000, liquidityToken1: 100000, priceToken0: 1, priceToken1: 1 }
  ];
  
  module.exports = pools;

  