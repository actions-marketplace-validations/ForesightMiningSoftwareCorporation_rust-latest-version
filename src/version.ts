import fs from 'fs';
import * as path from 'path';
import semver from 'semver'



export function getPackageFileDir(packageName: string): string {
    if (packageName === "") {
        throw new Error("Got empty package name")
    }
    const packageNameLen = packageName.length;
    switch (packageNameLen) {
        case 1:
            return `${packageNameLen}`;
        case 2:
            return `${packageNameLen}`;
        case 3:
            return `${packageNameLen}/${packageName[0]}`;
        default:
            return `${packageName.slice(0, 2)}/${packageName.slice(2, 4)}`;
    }
}

export async function getLatest(crate: string, registry: string): Promise<string> {
    if (!fs.existsSync(registry)) {
        // Directory does not exist
        throw new Error(`Registry index \`${registry}\` does not exists or cannot be read.`)
    }
    const crateDir = getPackageFileDir(crate);
    const crateInfoFilePath = path.join(registry, crateDir, crate)
    try {
        // Check if the directory exists
        fs.accessSync(crateInfoFilePath, fs.constants.R_OK);
    } catch (error) {
        // Directory does not exist
        throw new Error(`Crate \`${crate}\` not found in the registry.`)
    }
    // Read the file
    const fileContents = fs.readFileSync(crateInfoFilePath, 'utf-8');

    // Split the file contents into lines
    const lines = fileContents.split('\n');

    // Extract the 'vers' property from each line
    const versions: string[] = lines.filter(l => !!l).map(line => {
        const jsonObject = JSON.parse(line);
        if (typeof jsonObject.vers !== 'string') {
            throw new Error(`'vers' property is not a string: ${line}`);
        }
        return jsonObject.vers;
    }).filter(vers => vers !== null);

    return semver.sort(versions).reverse()[0];
}
