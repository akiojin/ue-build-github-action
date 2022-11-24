import * as core from '@actions/core'
import path from 'path'
import UE from './ue-command'

const IsWindows = process.platform.toLowerCase() === 'win32'

async function Run(): Promise<void> 
{
    try {
        if (!IsWindows) {
            throw new Error('Not supported platform.')
        }

        const project = path.join(
            core.getInput('project-directory'),
            `${core.getInput('project-name')}.uproject`)

        const enablePackage = core.getBooleanInput('enable-package')

        if (!!enablePackage) {
            await UE.BuildCookRun(
                `"${project}"`,
                core.getInput('build-target'),
                core.getInput('configuration'),
                enablePackage)
        
            await UE.Archive(
                core.getInput('package-path'),
                [ path.join(core.getInput('project-directory'), 'Saved', 'StagedBuilds') ],
                Number(core.getInput('compression')))
        }
    } catch (ex: any) {
        core.setFailed(ex.message);
    }
}

Run()
