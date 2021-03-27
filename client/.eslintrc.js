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
  },
  rules: {
    'react/react-in-jsx-scope': 'off',

    'unicorn/filename-case': [
      'error',
      { cases: { kebabCase: true, pascalCase: true } },
    ],
  },
  env: {
    browser: true,
  },
}
