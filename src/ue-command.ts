import * as core from '@actions/core'
import * as exec from '@actions/exec'
import path from 'path'
import { promises as fs } from 'fs'
import { ArgumentBuilder } from '@akiojin/argument-builder'

export default class UE
{
    /**
     * Returns the path of the first *.uproject found in the specified directory
     * 
     * @returns Full path of the searched *.uproject
     */
    static async GetUProjectPath(): Promise<string>
    {
        core.debug(`Project Directory: ${core.getInput('project-directory')}`)
        const files = await (await fs.readdir(core.getInput('project-directory')))
            .filter(file => file.endsWith('uproject'))
        
        if (files.length === 0) {
            throw new Error('Not found uproject')
        }

        core.debug(`Find: ${files.length}, First: ${files[0]}`)
        return files[0]
    }

    /**
     * Returns the UE installation directory path.
     * If a path is specified in `install-directory`, return it.
     * If not specified, the default installation directory path is returned.
     * 
     * @returns UE installation directory path
     */
    static GetUEInstallDirectory(): string
    {
        return core.getInput('install-directory') || 'C:\\Program Files\\Epic Games'
    }

    /**
     * Returns the version of UE used in a given project.
     * The UE version is obtained from *.uproject.
     * 
     * @param project UE project path
     * @returns UE version (e.g. 4.27)
     */
     static async GetUEVersionFromUProject(project: string): Promise<string>
    {
        const text = await fs.readFile(project, 'utf-8')
        const result = text.match(/EngineAssociation": "(?<version>[0-9.]*)"/i)
    
        if (result === null || result.groups == null) {
            throw new Error('Invalid uproject')
        }
    
        return result.groups.version
    }
    
    static async GetUEVersion(): Promise<string>
    {
        let version = core.getInput('version');

        if (version === 'project') {
            const uproject = await UE.GetUProjectPath()
            version = `UE_${await UE.GetUEVersionFromUProject(uproject)}`
        }

        return version;
    }

    static async GetRunUATPath(): Promise<string>
    {
        return `"${path.join(
            UE.GetUEInstallDirectory(),
            await UE.GetUEVersion(),
            'Engine', 'Build', 'BatchFiles', 'RunUAT.bat')}"`
    }

    static async BuildCookRun(): Promise<void>
    {
        const builder = new ArgumentBuilder()
            .Append('BuildCookRun')
            .Append(`-project="${await UE.GetUProjectPath()}"`)
            .Append('-noP4')
            .Append('-cook')
            .Append('-allmap')
            .Append('-build')
            .Append('-partialgc')
            .Append('-stage')
            .Append(`-platform=${core.getInput('build-target')}`)
            .Append(`-clientconfig=${core.getInput('configuration')}`)

        if (!!core.getBooleanInput('enable-package')) {
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
