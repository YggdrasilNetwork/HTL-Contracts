/// <reference types="node" />
import { Image } from "@nomiclabs/hardhat-docker";
import { ChildProcess, CommonSpawnOptions } from "child_process";
import { ExternalServer } from "./external-server";
export declare abstract class DockerServer extends ExternalServer {
    protected image: Image;
    protected args?: string[];
    private docker;
    protected containerName: string;
    constructor(image: Image, host: string, externalPort: string, isAliveURL: string, containerName: string, args?: string[], stdout?: string, stderr?: string);
    protected pullImage(): Promise<void>;
    protected spawnChildProcess(options?: CommonSpawnOptions): Promise<ChildProcess>;
    /**
     * CLI arguments passed to the `docker` command.
     */
    protected abstract getDockerArgs(): Promise<Array<string>>;
    /**
     * CLI arguments passed to the docker container.
     */
    protected abstract getContainerArgs(): Promise<Array<string>>;
    protected cleanup(): void;
}
