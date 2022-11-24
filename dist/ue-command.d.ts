export default class UE {
    /**
     * Returns the path of the first *.uproject found in the specified directory
     *
     * @param projectDirectory Directory path to search
     * @returns Full path of the searched *.uproject
     */
    static FindUProject(projectDirectory: string): string;
    /**
     * Returns the UE installation directory path.
     * If a path is specified in `ue-install-directory`, return it.
     * If not specified, the default installation directory path is returned.
     *
     * @returns UE installation directory path
     */
    static GetUEInstallDirectory(): string;
    static GetRunUATPath(): Promise<string>;
    /**
     * Returns the version of UE used in a given project.
     * The UE version is obtained from *.uproject.
     *
     * @param project UE project path
     * @returns UE version (e.g. 4.27)
     */
    static GetVersion(project: string): Promise<string>;
    static BuildCookRun(projectDirectory: string, platform: string, configuration: string, outputPackage: boolean): Promise<void>;
    static Archive(output: string, inputs: string[], compression?: number): Promise<void>;
}
