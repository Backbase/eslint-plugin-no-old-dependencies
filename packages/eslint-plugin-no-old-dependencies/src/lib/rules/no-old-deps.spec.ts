import { RuleTester } from 'eslint';
import * as newPackageVersionsModule from './new-package-versions';
import { create, meta } from './no-old-deps';

function generateCode(packageJson: object) {
  return `module.exports = ${JSON.stringify(packageJson)}`;
}

describe('no-old-deps', () => {
  const ruleTester = new RuleTester();
  const newPackageVersions = {
    ['dependency']: '2.0.0',
  };

  const packageJsonValid = {
    dependencies: { dependency: '2.0.0' },
  };

  const packageJsonInvalid = {
    dependencies: { dependency: '1.0.0' },
  };

  const packageJsonValidPeerDependencies = {
    peerDependencies: { dependency: '2.0.0' },
  };

  const packageJsonBothKinds = {
    dependencies: { dependency: '2.0.0' },
    peerDependencies: { dependency: '1.0.0' },
  };

  const packageJsonNoDependencies = {};

  beforeEach(() => {
    jest.spyOn(newPackageVersionsModule, 'initializeNewPackageVersions').mockReturnValueOnce(newPackageVersions);
  });

  ruleTester.run(
    'no-old-deps',
    { meta, create },
    {
      valid: [
        {
          code: `module.exports = ${JSON.stringify(packageJsonValid)}`,
          options: [['dependency']],
        },
        {
          code: `module.exports = ${JSON.stringify({
            dependencies: { 'some-other-dependency': '1.0.0' },
          })}`,
          options: [['dependency']],
        },
        {
          code: `module.exports = ${JSON.stringify(packageJsonNoDependencies)}`,
          options: [['dependency']],
        },
        {
          code: `module.exports = ${JSON.stringify(packageJsonValidPeerDependencies)}`,
          options: [['dependency']],
        },
        {
          code: `module.exports = ${JSON.stringify(packageJsonBothKinds)}`,
          options: [['dependency']],
        },
      ],
      invalid: [
        {
          code: generateCode(packageJsonInvalid),
          errors: [{ message: `1.0.0 is old version of dependency. Please use 2.0.0` }],
          options: [['dependency']],
        },
      ],
    },
  );
});
