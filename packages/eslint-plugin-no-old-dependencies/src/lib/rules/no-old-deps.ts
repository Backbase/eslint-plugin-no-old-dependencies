import { Rule } from 'eslint';
import { AssignmentExpression, ObjectExpression, Property } from 'estree';
import { PackageVersion } from './model';
import { initializeNewPackageVersions } from './new-package-versions';
import { getProperties, getPropertyKey, getPropertyValue, hasDependencies, hasPeerDependencies } from './utils';

function hasOldVersion(dependency: Property, newPackageVersions: PackageVersion) {
  const dependencyName = getPropertyKey(dependency);
  const dependencyVersion = getPropertyValue(dependency);
  const newPackageVersion = newPackageVersions[dependencyName];

  return newPackageVersion && !dependencyVersion.includes(newPackageVersion);
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
  create(context: Rule.RuleContext) {
    const packages: string[] = context.options[0];
    const newPackageVersions = initializeNewPackageVersions(packages);

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      AssignmentExpression: (node: AssignmentExpression) => {
        const json = node.right as ObjectExpression;
        const deps = getProperties(json).filter(hasDependencies);
        const peerDeps = getProperties(json).filter(hasPeerDependencies);

        const allDependencies = [...deps, ...peerDeps];
        if (allDependencies.length === 0) {
          return;
        }

        const dependencies = allDependencies[0].value as ObjectExpression;
        const oldPackageVersion = getProperties(dependencies).find((dep) => hasOldVersion(dep, newPackageVersions));

        if (!oldPackageVersion) {
          return;
        }

        const dependencyName = getPropertyKey(oldPackageVersion);
        const dependencyVersion = getPropertyValue(oldPackageVersion);
        const newPackageVersion = newPackageVersions[dependencyName];

        context.report({
          node: oldPackageVersion.value,
          message: `${dependencyVersion} is old version of ${dependencyName}. Please use ${newPackageVersion}`,
        });
      },
    };
  },
};

export const meta = rule.meta;
export const create = rule.create;
