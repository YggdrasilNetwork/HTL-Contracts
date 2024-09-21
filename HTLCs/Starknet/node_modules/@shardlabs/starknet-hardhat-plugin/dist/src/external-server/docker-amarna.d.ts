import { HardhatDocker, Image } from "@nomiclabs/hardhat-docker";
import { HardhatRuntimeEnvironment } from "hardhat/types";
export declare class AmarnaDocker {
    private image;
    private rootPath;
    private cairoPaths;
    private hre;
    useShell: boolean;
    container: string;
    docker: HardhatDocker;
    /**
     * @param image the Docker image to be used for running the container
     * @param cairoPaths the paths specified in hardhat config cairoPaths
     */
    constructor(image: Image, rootPath: string, cairoPaths: string[], hre: HardhatRuntimeEnvironment);
    protected getCommand(): string[];
    cairoPathBindings(binds: {
        [x: string]: string;
    }, dockerArgs: string[]): void;
    private ensureDockerImage;
    private prepareDockerArgs;
    run(args: {
        script?: boolean;
    }): Promise<void>;
}
