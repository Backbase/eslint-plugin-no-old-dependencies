import { Rule } from 'eslint';
import * as fs from 'fs';
import * as path from 'path';
interface PackageVersion {
  [key: string]: string;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow old version of dependencies',
      category: 'Possible Errors',
    },
    schema: [
      {
        type: 'array',
        items: { type: 'string' },
      },
    ],
  },
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  create(context: any) {
    const packages = context.options[0];
    const newPackageVersions: PackageVersion = {};
    for (const libPackage of packages) {
      const packagePath = path.join(__dirname, path.relative(__dirname, `libs/${libPackage}/package.json`));
      const packageObject = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      newPackageVersions[packageObject['name']] = packageObject['version'];
    }
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      AssignmentExpression: (node: any) => {
        const json = node.right;
        const deps = json.properties.find((property: any) => property.key.value === 'dependencies');
        if (deps) {
          const oldPackageVersion = deps.value.properties.find((dep: any) => {
            const newPackageVersion = newPackageVersions[dep.key.value];
            return newPackageVersion && !dep.value.value.includes(newPackageVersion);
          });
          if (oldPackageVersion) {
            context.report({
              node: oldPackageVersion.value,
              message: `${oldPackageVersion.value.value} is old version of ${oldPackageVersion.key.value}`,
            });
          }
        }
      },
    };
  },
};

export const meta = rule.meta;
export const create = rule.create;
