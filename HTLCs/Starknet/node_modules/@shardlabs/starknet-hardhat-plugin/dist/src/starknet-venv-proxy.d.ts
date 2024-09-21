/// <reference types="node" />
import { ChildProcess } from "child_process";
import { ExternalServer } from "./external-server";
export declare class StarknetVenvProxy extends ExternalServer {
    private pythonPath;
    constructor(pythonPath: string);
    protected spawnChildProcess(): Promise<ChildProcess>;
    protected cleanup(): void;
}
