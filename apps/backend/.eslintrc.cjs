module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // Enable eslint-plugin-prettier that formats content using Prettier
    'prettier/prettier': 'error',
    // Don't enforce that class methods utilize this
    'class-methods-use-this': 'off',
    // Allow unused variable for next (Express middlewares needs)
    'no-unused-vars': 'off',
    // Don't require CamelCase
    camelcase: 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'no-undef': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^(next|_)' },
        ],
      },
    },
  ],
};
