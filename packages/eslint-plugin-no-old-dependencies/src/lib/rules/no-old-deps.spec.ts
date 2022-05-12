import { RuleTester } from 'eslint';
import * as fs from 'fs';
import { create, meta } from './no-old-deps';

describe('no-old-deps', () => {
  const ruleTester = new RuleTester();
  const dependencyPackageJson = {
    name: 'dependency',
    version: '2.0.0',
  };

  const packageJsonValid = {
    dependencies: { dependency: '2.0.0' },
  };

  const packageJsonInvalid = {
    dependencies: { dependency: '1.0.0' },
  };

  beforeEach(() => {
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(dependencyPackageJson));
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
      ],
      invalid: [
        {
          code: `module.exports = ${JSON.stringify(packageJsonInvalid)}`,
          errors: [{ message: `1.0.0 is old version of dependency` }],
          options: [['dependency']],
        },
      ],
    },
  );
});
