import BigNumber from "bignumber.js";
import { Driver, Transaction } from "neo4j-driver";
import { createInterface } from "readline";
import { loadEnv } from "../config/dotenv";
import { createDriver } from "../utils/neo4j";

BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: BigNumber.ROUND_DOWN });

export class RootstockAggregator {
  private driver: Driver;

  constructor() {
    this.driver = createDriver();
  }

  // Find the most optimized path between startToken and endToken
  async findOptimalPath(
    startToken: string,
    endToken: string,
    inputAmount: BigNumber,
    minLiquidity: number = 1000,
    maxPaths: number = 3
  ): Promise<PathResult[]> {
    const session = this.driver.session();
    try {
      const paths = await session.readTransaction((tx) =>
        this.findPaths(
          tx,
          startToken,
          endToken,
          inputAmount,
          minLiquidity,
          maxPaths
        )
      );
      return paths;
    } finally {
      await session.close();
    }
  }

  // Query Neo4j to find paths based on existing pool relationships
  private async findPaths(
    tx: Transaction,
    startToken: string,
    endToken: string,
    inputAmount: BigNumber,
    minLiquidity: number,
    maxPaths: number
  ): Promise<PathResult[]> {
    const query = `
      MATCH path = (start:Token {symbol: $start_symbol})-[:POOL*1..6]->(end:Token {symbol: $end_symbol})
      WHERE ALL(rel IN relationships(path) WHERE rel.liquidity >= $min_liquidity)
      WITH path, [node IN nodes(path) | node.symbol] AS symbols,
           reduce(totalLiquidity = 0, rel IN relationships(path) | totalLiquidity + rel.liquidity) AS totalLiquidity
      RETURN path, symbols, totalLiquidity
      ORDER BY totalLiquidity DESC
      LIMIT toInteger($max_paths)
    `;

    const result = await tx.run(query, {
      start_symbol: startToken,
      end_symbol: endToken,
      min_liquidity: minLiquidity,
      max_paths: maxPaths,
    });

    return result.records.map((record) => ({
      path: record.get("symbols"),
      totalLiquidity: new BigNumber(record.get("totalLiquidity")),
    }));
  }

  // Function to prompt the user for input tokens
  private async promptUserInput(): Promise<{
    startToken: string;
    endToken: string;
  }> {
    const rl = createInterface({
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

    const optimalPaths = await this.findOptimalPath(
      startToken,
      endToken,
      inputAmount
    );
    if (optimalPaths.length > 0) {
      console.info("Optimal paths found: ", optimalPaths);
    } else {
      console.info("No valid path found between", startToken, "and", endToken);
    }

    await this.driver.close();
  }
}

// Interfaces
interface PathResult {
  path: string[];
  totalLiquidity: BigNumber;
}
