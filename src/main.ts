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

        core.startGroup('UE Build')
        await UE.BuildCookRun()
        core.endGroup()
    
        if (!!core.getBooleanInput('enable-package')) {
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
