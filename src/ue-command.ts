import * as core from '@actions/core'
import * as exec from '@actions/exec'
import path from 'path'
import { ArgumentBuilder } from '@akiojin/argument-builder'

export default class UE
{
    static GetUEInstallDirectory(): string
    {
        return core.getInput('ue-install-directory') || 'C:\\Program Files\\Epic Games'
    }

    static GetRunUATPath(): string
    {
        return `"${path.join(
            UE.GetUEInstallDirectory(),
            core.getInput('ue-version'),
            'Engine', 'Build', 'BatchFiles', 'RunUAT.bat')}"`
    }
    
    static async BuildCookRun(
        project: string,
        platform: string,
        configuration: string,
        outputPackage: boolean): Promise<void>
    {
        const builder = new ArgumentBuilder()
            .Append('BuildCookRun')
            .Append(`-project=${project}`)
            .Append('-noP4')
            .Append('-cook')
            .Append('-allmap')
            .Append('-build')
            .Append(`-platform=${platform}`)
            .Append(`-clientconfig=${configuration}`)

        if (!!outputPackage) {
            builder.Append('-pak')
        }

        await exec.exec(UE.GetRunUATPath(), builder.Build())
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

        await exec.exec(UE.GetRunUATPath(), builder.Build())
    }
}
