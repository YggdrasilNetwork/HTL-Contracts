import * as fcl from "@onflow/fcl";
import BigNumber from "bignumber.js";
import { sendTransaction } from "../utils/flow";

BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: BigNumber.ROUND_DOWN });

export class FlowAggregator {
  // Find the optimal path from startToken to endToken using mock pools
  async findOptimalPath(
    startToken: string,
    endToken: string,
    inputAmount: BigNumber,
    minLiquidity: number = 1000,
    maxPaths: number = 3
  ): Promise<PathResult[]> {
    // Mocked data - you'll replace this with actual Flow blockchain interaction
    const mockPools = await this.queryMockPools();
    const optimalPaths = this.pathfinderAlgorithm(mockPools, startToken, endToken);
    
    return optimalPaths;
  }

  // Query mock pools (mocked for now, replace with actual data from Flow contracts)
  private async queryMockPools(): Promise<any[]> {
    // Example mocked pools data
    return [
      { poolId: 1, tokenA: "FLOW", tokenB: "FUSD", liquidity: 5000 },
      { poolId: 2, tokenA: "FUSD", tokenB: "USDC", liquidity: 6000 },
      // More pools
    ];
  }

  // Pathfinder algorithm to find the best route
  private pathfinderAlgorithm(mockPools: any[], startToken: string, endToken: string): PathResult[] {
    // Basic pathfinding algorithm (could be breadth-first search, Dijkstra’s, etc.)
    // Here, we're using a mocked approach, which you'd replace with actual logic
    const paths: PathResult[] = [];

    for (const pool of mockPools) {
      if (pool.tokenA === startToken && pool.tokenB === endToken) {
        paths.push({
          path: [startToken, endToken],
          totalLiquidity: new BigNumber(pool.liquidity),
        });
      }
    }

    return paths;
  }

  // Function to prompt the user for input tokens
  private async promptUserInput(): Promise<{ startToken: string; endToken: string }> {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = (question: string): Promise<string> => {
      return new Promise((resolve) => rl.question(question, resolve));
    };

    const startToken = await askQuestion("Enter the start token symbol: ");
    const endToken = await askQuestion("Enter the destination token symbol: ");
    rl.close();

    return { startToken, endToken };
  }

  async run() {
    const { startToken, endToken } = await this.promptUserInput();
    const inputAmount = new BigNumber(1000); // Example input amount

    const optimalPaths = await this.findOptimalPath(startToken, endToken, inputAmount);
    if (optimalPaths.length > 0) {
      console.info("Optimal paths found: ", optimalPaths);
    } else {
      console.info("No valid path found between", startToken, "and", endToken);
    }
  }
}

// Interfaces
interface PathResult {
  path: string[];
  totalLiquidity: BigNumber;
}
