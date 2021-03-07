module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
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
    'plugin:jsx-a11y/recommended',
    'plugin:unicorn/recommended',
  ],
  settings: {
    react: {
      pragma: 'h',
      version: '16.0',
    },
  },
  env: {
    browser: true,
  },
  rules: {
    // formatting
    'indent': ['warn', 2],
    'max-len': ['warn', 120],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'object-curly-spacing': ['warn', 'always'],
    'eol-last': ['warn', 'always'],
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
    'no-trailing-spaces': 'warn',

    // imports
    'import/order': [
      'warn',
      { alphabetize: { order: 'asc', caseInsensitive: true } },
    ],
    'sort-imports': [
      'warn',
      { ignoreDeclarationSort: true },
    ],

    // react
    'react/prop-types': 'off',

    // unicorn
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/no-null': 'off',

    // misc
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
};
