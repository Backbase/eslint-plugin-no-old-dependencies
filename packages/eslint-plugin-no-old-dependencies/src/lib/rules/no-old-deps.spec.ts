import { RuleTester } from 'eslint';
import * as newPackageVersionsModule from './new-package-versions';
import { create, meta } from './no-old-deps';

function generateCode(packageJson: object) {
  return `module.exports = ${JSON.stringify(packageJson)}`;
}

describe('no-old-deps', () => {
  const ruleTester = new RuleTester();
  const newPackageVersions = {
    dependency: '2.0.0',
    dependencyWithPatchVersion: '2.0.1',
    dependencyWithMinorVersion: '2.1.0',
    dependencyWithMajorVersion: '3.1.0',
  };

  const validScenarios = {
    noDependencies: {},
    otherDependency: { dependencies: { 'some-other-dependency': '1.0.0' } },
    exactMatch: { dependencies: { dependency: '2.0.0' } },
    exactMatchAsPeerDependency: { peerDependencies: { dependency: '2.0.0' } },
    exactMatchBothKinds: {
      dependencies: { dependency: '2.0.0' },
      peerDependencies: { dependency: '1.0.0' },
    },
    tilde: { dependencyWithPatchVersion: '~2.0.0' },
    dash: { dependencyWithMinorVersion: '^2.0.0' },
    range: { dependencyWithMajorVersion: '>=2.0.0' },
  };

  const invalidScenarios = {
    exactMatch: { dependencies: { dependency: '1.0.0' } },
    tilde: { dependencies: { dependencyWithMinorVersion: '~2.0.0' } },
    dash: { dependencies: { dependencyWithMajorVersion: '^2.0.0' } },
    range: { dependencies: { dependencyWithMajorVersion: '>=4.0.0' } },
  };

  const options = [['dependency']];

  beforeEach(() => {
    jest.spyOn(newPackageVersionsModule, 'initializeNewPackageVersions').mockReturnValueOnce(newPackageVersions);
  });

  ruleTester.run(
    'no-old-deps',
    { meta, create },
    {
      valid: Object.values(validScenarios).map((packageJson) => ({ code: generateCode(packageJson), options })),
      invalid: Object.values(invalidScenarios).map((packageJson) => {
        const code = generateCode(packageJson);

        const dependencyName = Object.keys(packageJson.dependencies)[0];
        const dependencyValue = (packageJson.dependencies as Record<string, string>)[dependencyName];
        const currentDependencyValue = (newPackageVersions as Record<string, string>)[dependencyName];
        const message = `${dependencyValue} is old version of ${dependencyName}. Please use ${currentDependencyValue}`;
        const errors = [{ message }];
        return { code, errors, options };
      }),
    },
  );
});
