/// <reference types="node" />
import fs from "fs";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
interface ContractData {
    contentHash: string;
    outputPath: string;
    abiPath: string;
    cairoPath?: string;
    accountContract?: boolean;
    disableHintValidation?: boolean;
}
export declare class Cache {
    protected hre: HardhatRuntimeEnvironment;
    protected cache: Record<string, ContractData>;
    fsPromises: typeof fs.promises;
    constructor(hre: HardhatRuntimeEnvironment);
    getCache(): Promise<Record<string, ContractData>>;
    setCache(cacheData: Record<string, ContractData>): void;
    private getCacheFilePath;
    private getCacheDirPath;
    loadCache(): Promise<void>;
    saveCache(): Promise<void>;
}
export declare class Recompiler {
    private cache;
    private hre;
    constructor(hre: HardhatRuntimeEnvironment);
    private getContractHash;
    private getCacheEntry;
    private getUpdatedCache;
    private checkArtifacts;
    private compileChangedContracts;
    private updateSet;
    handleCache(): Promise<void>;
    updateCache(args: TaskArguments, file: string, output: string, abi: string, cairoPath?: string): Promise<void>;
    saveCache(): Promise<void>;
}
export {};
