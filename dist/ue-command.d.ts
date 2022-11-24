export default class UE {
    static GetUEInstallDirectory(): string;
    static GetRunUATPath(): string;
    static BuildCookRun(project: string, platform: string, configuration: string, outputPackage: boolean): Promise<void>;
    static Archive(output: string, inputs: string[], compression?: number): Promise<void>;
}
