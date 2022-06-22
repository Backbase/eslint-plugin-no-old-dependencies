import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';
import { PackageVersion } from './model';

const FOLDERS = ['libs', 'packages', 'node_modules'];
const MAX_LEVEL = 3;

function getDirectories(path: string) {
  try {
    return readdirSync(path, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map(({ name }) => join(path, name));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.log('ERROR', err);
    }
    return [];
  }
}

function getPath(libName: string, folders: string[]) {
  const libraryFolder = folders.filter((f) => f.endsWith(libName))[0];
  return libraryFolder ? join(__dirname, relative(__dirname, libraryFolder), 'package.json') : undefined;
}

function getPackagePath(libName: string, folders: string[], level: number): string | undefined {
  if (level > MAX_LEVEL) {
    return undefined;
  }

  let path = getPath(libName, folders);
  if (path) {
    return path;
  }

  for (const folder of folders) {
    const subFolders = getDirectories(folder);
    if (subFolders.length === 0) {
      continue;
    }

    path = getPackagePath(libName, subFolders, level + 1);
    if (path) {
      return path;
    }
  }
  return undefined;
}

function readPackageJson(packagePath: string): { name: string; version: string } {
  return JSON.parse(readFileSync(packagePath, 'utf8'));
}

export function initializeNewPackageVersions(packageNames: string[] = []): PackageVersion {
  return packageNames
    .map((libName) => ({ libName, path: getPackagePath(libName, FOLDERS, 0) }))
    .map(({ libName, path }) => {
      if (!path) {
        throw new Error('Unable to find package.json for library: ' + libName);
      }
      return path;
    })
    .map(readPackageJson)
    .reduce<PackageVersion>((newPackageVersions: PackageVersion, { name, version }) => {
      newPackageVersions[name] = version;
      return newPackageVersions;
    }, {});
}
