import * as core from '@actions/core'
import * as exec from '@actions/exec'
import path from 'path'
import glob from 'glob'
import { promises as fs } from 'fs'
import { ArgumentBuilder } from '@akiojin/argument-builder'

export default class UE
{
    /**
     * Returns the path of the first *.uproject found in the specified directory
     * 
     * @param projectDirectory Directory path to search
     * @returns Full path of the searched *.uproject
     */
    static FindUProject(projectDirectory: string): string
    {
        let result = ''

        const options = {
            root: projectDirectory,
            absolute: true,
        } as glob.IOptions

        glob('*.uproject', options, function (error, files) {
            if (error) {
                return;
            }

            result = files[0]
        })

        return result;
    }

    /**
     * Returns the UE installation directory path.
     * If a path is specified in `ue-install-directory`, return it.
     * If not specified, the default installation directory path is returned.
     * 
     * @returns UE installation directory path
     */
    static GetUEInstallDirectory(): string
    {
        return core.getInput('ue-install-directory') || 'C:\\Program Files\\Epic Games'
    }

    static async GetRunUATPath(): Promise<string>
    {
        let version = core.getInput('ue-version');

        if (version === 'project') {
            version = `UE_${await UE.GetVersion(UE.FindUProject(core.getInput('project-directory')))}`
        }

        return `"${path.join(
            UE.GetUEInstallDirectory(),
            version,
            'Engine', 'Build', 'BatchFiles', 'RunUAT.bat')}"`
    }

    /**
     * Returns the version of UE used in a given project.
     * The UE version is obtained from *.uproject.
     * 
     * @param project UE project path
     * @returns UE version (e.g. 4.27)
     */
     static async GetVersion(project: string): Promise<string>
    {
        const text = await fs.readFile(project, 'utf-8')
        const result = text.match(/EngineAssociation": "(?<version>[0-9.]*)"/i)
    
        if (result === null || result.groups == null) {
            throw new Error('Invalid uproject')
        }
    
        return result.groups.version
    }
    
    static async BuildCookRun(
        projectDirectory: string,
        platform: string,
        configuration: string,
        outputPackage: boolean): Promise<void>
    {
        const builder = new ArgumentBuilder()
            .Append('BuildCookRun')
            .Append(`-project=${UE.FindUProject(projectDirectory)}`)
            .Append('-noP4')
            .Append('-cook')
            .Append('-allmap')
            .Append('-build')
            .Append('-partialgc')
            .Append('-stage')
            .Append(`-platform=${platform}`)
            .Append(`-clientconfig=${configuration}`)

        if (!!outputPackage) {
            builder.Append('-pak')
        }

        await exec.exec(await UE.GetRunUATPath(), builder.Build())
    }

    static async Archive(
        output: string,
        inputs: string[],
        compression: number = 5): Promise<void>
    {
        const builder = new ArgumentBuilder()
            .Append('ZipUtils')
            .Append(`-archive=${output}`)
            .Append(`-compression=${compression}`)

        inputs.forEach(input => {
            builder.Append(`-add=${input}`)
        })

        await exec.exec(await UE.GetRunUATPath(), builder.Build())
    }
}
