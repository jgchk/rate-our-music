const project = process.cwd().includes('client')
  ? 'tsconfig.json'
  : './client/tsconfig.json'

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  settings: {
    react: { version: '16.0' },
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  rules: {
    'import/order': [
      'warn',
      { alphabetize: { order: 'asc', caseInsensitive: true } },
    ],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],

    '@typescript-eslint/ban-ts-comment': 'off',

    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',

    'unicorn/filename-case': [
      'error',
      { cases: { kebabCase: true, camelCase: true, pascalCase: true } },
    ],
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-useless-undefined': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
}
