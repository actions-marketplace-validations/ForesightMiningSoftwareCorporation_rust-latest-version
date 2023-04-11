import { getLatest, getPackageFileDir } from '../src/version'

import * as path from 'path'
import { expect, test, describe } from '@jest/globals'
import * as fs from 'fs/promises';

async function createDummyIndex(): Promise<string> {
  const dir = await fs.mkdtemp('');
  const index = await fs.open(path.join(dir, 'config.json'), 'w');
  await index.writeFile('{"dl":"https://example.com"}');
  await index.close();
  const crateDir = path.join(dir, 'cr/at');
  await fs.mkdir(crateDir, { recursive: true, mode: 0o750 });
  const crateFile = await fs.open(path.join(crateDir, 'crate-test'), 'w');
  await crateFile.writeFile('{"name":"crate-test","vers":"0.1.0","deps":[],"features":{},"cksum":"b274d286f7a6aad5a7d5b5407e9db0098c94711fb3563bf2e32854a611edfb63","yanked":false,"links":null}\n');
  await crateFile.writeFile('{"name":"crate-test","vers":"0.2.0","deps":[],"features":{},"cksum":"b274d286f7a6aad5a7d5b5407e9db0098c94711fb3563bf2e32854a611edfb63","yanked":false,"links":null}\n');
  await crateFile.writeFile('{"name":"crate-test","vers":"0.2.2","deps":[],"features":{},"cksum":"b274d286f7a6aad5a7d5b5407e9db0098c94711fb3563bf2e32854a611edfb63","yanked":false,"links":null}\n');
  await crateFile.writeFile('{"name":"crate-test","vers":"0.2.3-rc1","deps":[],"features":{},"cksum":"b274d286f7a6aad5a7d5b5407e9db0098c94711fb3563bf2e32854a611edfb63","yanked":true,"links":null}\n');
  await crateFile.writeFile('{"name":"crate-test","vers":"0.2.3","deps":[],"features":{},"cksum":"b274d286f7a6aad5a7d5b5407e9db0098c94711fb3563bf2e32854a611edfb63","yanked":true,"links":null}\n');
  await crateFile.close();
  return dir;
}



describe('getPackageFileDir', () => {
  type TestPkgInfo = {
    name: string;
    packageName: string;
    packageDir: string;
    wantErr: boolean;
  };
  const testList: TestPkgInfo[] = [
    {
      name: "Alphanumeric",
      packageName: "random",
      packageDir: "ra/nd",
      wantErr: false,
    },
    {
      name: "4 Characters",
      packageName: "rand",
      packageDir: "ra/nd",
      wantErr: false,
    },
    {
      name: "Special Char",
      packageName: "b-crypt65",
      packageDir: "b-/cr",
      wantErr: false,
    },
    {
      name: "One Character",
      packageName: "a",
      packageDir: "1",
      wantErr: false,
    },
    {
      name: "Two Characters",
      packageName: "az",
      packageDir: "2",
      wantErr: false,
    },
    {
      name: "Three Characters",
      packageName: "zac",
      packageDir: "3/z",
      wantErr: false,
    },
    {
      name: "Empty package",
      packageName: "",
      packageDir: "",
      wantErr: true,
    },
  ];
  const packageTuples: [string, Omit<TestPkgInfo, "name">][] = testList.map(({ name, ...rest }) => [name, rest]);
  test.each(packageTuples)('Test case: %s', async (_, { packageName, packageDir, wantErr }) => {
    try {
      const got = getPackageFileDir(packageName);
      expect(wantErr).toBeFalsy();
      expect(got).toEqual(packageDir);
    } catch (error) {
      expect(wantErr).toBeTruthy();
    }
  });
});

describe('getLatest', () => {
  test('throws index directory does not exists', async () => {
    const index = "/tmp/bachiboul";
    await expect(getLatest("non_existing_crate", index)).rejects.toThrow(`Registry index \`${index}\` does not exists or cannot be read.`);
  });

  test('throws if crate is not found', async () => {
    const index = await createDummyIndex();
    await expect(getLatest("non_existing_crate", index)).rejects.toThrow(`Crate \`non_existing_crate\` not found in the registry.`);
  });

  test('Should return 0.2.3 for crate_test', async () => {
    const index = await createDummyIndex();
    const latest = await getLatest("crate-test", index);
    expect(latest).toEqual("0.2.3")
  })
});
