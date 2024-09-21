export declare class IntegratedDevnetLogger {
    protected stdout?: string;
    protected stderr?: string;
    constructor(stdout?: string, stderr?: string);
    private checkFileExists;
    logHandler(logTarget: string, message: string): Promise<void>;
    isFile(file: string): boolean;
    private appendLogToFile;
}
