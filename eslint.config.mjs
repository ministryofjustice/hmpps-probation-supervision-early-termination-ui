import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig(),
  {
    name: 'vitest-config-overrides',
    files: ['vitest.config.mts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    name: 'overrides',
    files: ['**/*.ts'],
    ignores: ['**/*.js'],
    rules: {
      // TODO remove these overrides and fix the issues:
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'import/prefer-default-export': 0,
    },
  },
]
