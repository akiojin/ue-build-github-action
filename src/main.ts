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

        const enablePackage = core.getBooleanInput('enable-package')

        if (!!enablePackage) {
            core.startGroup('UE Build')
            await UE.BuildCookRun(
                core.getInput('project-directory'),
                core.getInput('build-target'),
                core.getInput('configuration'),
                enablePackage)
            core.endGroup()
        
            core.startGroup('Archive')
            await UE.Archive(
                core.getInput('package-path'),
                [ path.join(core.getInput('project-directory'), 'Saved', 'StagedBuilds') ],
                Number(core.getInput('compression')))
            core.endGroup()
        }
    } catch (ex: any) {
        core.setFailed(ex.message);
    }
}

Run()
