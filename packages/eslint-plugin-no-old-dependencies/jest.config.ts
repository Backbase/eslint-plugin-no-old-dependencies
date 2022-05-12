module.exports = {
  displayName: 'eslint-plugin-no-old-dependencies',
  preset: '../../jest.preset.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/eslint-plugin-no-old-dependencies',
  coverageReporters: ['lcovonly', 'html', 'text-summary'],
};
