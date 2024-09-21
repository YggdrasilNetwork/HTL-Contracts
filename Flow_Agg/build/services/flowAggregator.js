"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowAggregator = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
bignumber_js_1.default.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: bignumber_js_1.default.ROUND_DOWN });
class FlowAggregator {
    // Find the optimal path from startToken to endToken using mock pools
    findOptimalPath(startToken_1, endToken_1, inputAmount_1) {
        return __awaiter(this, arguments, void 0, function* (startToken, endToken, inputAmount, minLiquidity = 1000, maxPaths = 3) {
            // Mocked data - you'll replace this with actual Flow blockchain interaction
            const mockPools = yield this.queryMockPools();
            const optimalPaths = this.pathfinderAlgorithm(mockPools, startToken, endToken);
            return optimalPaths;
        });
    }
    // Query mock pools (mocked for now, replace with actual data from Flow contracts)
    queryMockPools() {
        return __awaiter(this, void 0, void 0, function* () {
            // Example mocked pools data
            return [
                { poolId: 1, tokenA: "FLOW", tokenB: "FUSD", liquidity: 5000 },
                { poolId: 2, tokenA: "FUSD", tokenB: "USDC", liquidity: 6000 },
                // More pools
            ];
        });
    }
    // Pathfinder algorithm to find the best route
    pathfinderAlgorithm(mockPools, startToken, endToken) {
        // Basic pathfinding algorithm (could be breadth-first search, Dijkstra’s, etc.)
        // Here, we're using a mocked approach, which you'd replace with actual logic
        const paths = [];
        for (const pool of mockPools) {
            if (pool.tokenA === startToken && pool.tokenB === endToken) {
                paths.push({
                    path: [startToken, endToken],
                    totalLiquidity: new bignumber_js_1.default(pool.liquidity),
                });
            }
        }
        return paths;
    }
    // Function to prompt the user for input tokens
    promptUserInput() {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            const askQuestion = (question) => {
                return new Promise((resolve) => rl.question(question, resolve));
            };
            const startToken = yield askQuestion("Enter the start token symbol: ");
            const endToken = yield askQuestion("Enter the destination token symbol: ");
            rl.close();
            return { startToken, endToken };
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { startToken, endToken } = yield this.promptUserInput();
            const inputAmount = new bignumber_js_1.default(1000); // Example input amount
            const optimalPaths = yield this.findOptimalPath(startToken, endToken, inputAmount);
            if (optimalPaths.length > 0) {
                console.info("Optimal paths found: ", optimalPaths);
            }
            else {
                console.info("No valid path found between", startToken, "and", endToken);
            }
        });
    }
}
exports.FlowAggregator = FlowAggregator;
