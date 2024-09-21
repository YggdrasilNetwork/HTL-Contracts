import { HardhatPluginError } from "hardhat/plugins";
export declare class StarknetPluginError extends HardhatPluginError {
    constructor(message: string, parentError?: Error);
}
