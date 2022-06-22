import { Dirent } from 'fs';

const fsMock = {
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
};

jest.mock('fs', () => fsMock);

import { initializeNewPackageVersions } from './new-package-versions';

function createDir(name: string): Dirent {
  return {
    name,
    isDirectory: () => true,
  } as Dirent;
}
describe('new-package-versions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty object for empty libNames', () => {
    expect(initializeNewPackageVersions()).toEqual({});
  });

  it('shold return dependency on level 0', () => {
    fsMock.readdirSync.mockReturnValueOnce([createDir('lib1')]);
    fsMock.readFileSync.mockReturnValueOnce(JSON.stringify({ name: 'lib1', version: '1.0.0' }));

    expect(initializeNewPackageVersions(['lib1'])).toEqual({
      lib1: '1.0.0',
    });
  });

  it('should return dependency on level 1', () => {
    fsMock.readdirSync.mockReturnValueOnce([createDir('group1')]).mockReturnValueOnce([createDir('lib2')]);

    fsMock.readFileSync.mockReturnValueOnce(JSON.stringify({ name: 'lib2', version: '2.0.0' }));

    expect(initializeNewPackageVersions(['lib2'])).toEqual({
      lib2: '2.0.0',
    });
  });

  it('should return dependency on level 2', () => {
    fsMock.readdirSync
      .mockReturnValueOnce([createDir('group1')])
      .mockReturnValueOnce([createDir('subgroup1')])
      .mockReturnValueOnce([createDir('lib3')]);

    fsMock.readFileSync.mockReturnValueOnce(JSON.stringify({ name: 'lib3', version: '3.0.0' }));

    expect(initializeNewPackageVersions(['lib3'])).toEqual({
      lib3: '3.0.0',
    });
  });

  it('should throw error on level 3', () => {
    fsMock.readdirSync
      .mockReturnValueOnce([createDir('group1')])
      .mockReturnValueOnce([createDir('subgroup1')])
      .mockReturnValueOnce([createDir('subgroup2')])
      .mockReturnValueOnce([createDir('lib4')]);

    expect(() => initializeNewPackageVersions(['lib4'])).toThrowError('Unable to find package.json for library: lib4');
  });

  it('should throw error when subfolders may be empty', () => {
    fsMock.readdirSync.mockImplementation(() => {
      throw new Error('Some Error');
    });

    expect(() => initializeNewPackageVersions(['whatever'])).toThrowError(
      'Unable to find package.json for library: whatever',
    );
  });
});
