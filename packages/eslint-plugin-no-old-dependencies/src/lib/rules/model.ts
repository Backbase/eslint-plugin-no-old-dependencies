export type PackageVersion = Record<string, string>;
export enum DependencyType {
  dependencies = 'dependencies',
  peerDependencies = 'peerDependencies',
}
