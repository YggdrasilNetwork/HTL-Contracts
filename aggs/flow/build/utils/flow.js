"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = sendTransaction;
const fcl = __importStar(require("@onflow/fcl"));
const dotenv = __importStar(require("dotenv"));
// Load environment variables from .env file
dotenv.config();
// Flow testnet configuration
fcl.config()
    .put("accessNode.api", process.env.FLOW_ACCESS_NODE) // Flow Testnet or Mainnet URL
    .put("flow.network", process.env.FLOW_NETWORK) // Flow testnet or mainnet
    .put("0xYourAccountAddress", process.env.FLOW_ACCOUNT_ADDRESS);
// Function to send transactions to the Flow blockchain
function sendTransaction(cadenceCode_1) {
    return __awaiter(this, arguments, void 0, function* (cadenceCode, args = []) {
        // Wrap fcl.authz in a function that returns a Promise
        const authzFunction = () => fcl.authz;
        const transactionId = yield fcl
            .send([
            fcl.transaction `${cadenceCode}`, // Transaction code in Cadence
            fcl.args(args), // Arguments to pass to the transaction
            fcl.payer(authzFunction), // Pass a function that returns the authz function
            fcl.proposer(authzFunction), // Pass a function that returns the authz function
            fcl.authorizations([authzFunction]), // Pass as an array of functions
            fcl.limit(999), // Set a gas limit for the transaction
        ])
            .then(fcl.decode); // Decode the transaction ID
        // Wait for the transaction to be sealed
        return fcl.tx(transactionId).onceSealed();
    });
}
