import * as core from '@actions/core'
import { getLatest } from './version';

async function run(): Promise<void> {
  try {
    const registry: string = core.getInput('registry', { required: true });
    const crate: string = core.getInput('crate', { required: true });
    core.setOutput('version', await getLatest(crate, registry))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
