export default class UE {
    /**
     * Returns the path of the first *.uproject found in the specified directory
     *
     * @returns Full path of the searched *.uproject (full path)
     */
    static GetUProjectPath(): Promise<string>;
    /**
     * Returns the UE installation directory path.
     * If a path is specified in `install-directory`, return it.
     * If not specified, the default installation directory path is returned.
     *
     * @returns UE installation directory path
     */
    static GetUEInstallDirectory(): string;
    /**
     * Returns the version of UE used in a given project.
     * The UE version is obtained from *.uproject.
     *
     * @param project UE project path
     * @returns UE version (e.g. 4.27)
     */
    static GetUEVersionFromUProject(project: string): Promise<string>;
    static GetUEVersion(): Promise<string>;
    static GetRunUATPath(): Promise<string>;
    static BuildCookRun(): Promise<void>;
    static Archive(output: string, inputs: string[], compression?: number): Promise<void>;
}
