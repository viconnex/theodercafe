module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    // "airbnb-typescript",
    // "airbnb/hooks",
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    es6: true,
    sourceType: 'module',
    node: true,
    project: 'tsconfig.json',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jest', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-case-declarations': [1],
    'react/jsx-uses-react': [2],
    'react/jsx-uses-vars': [2],
    'react/no-array-index-key': 1,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    curly: ['error', 'all'],
    eqeqeq: ['error', 'smart'],
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-shadow': [
      'warn',
      {
        hoist: 'all',
      },
    ],
    'prefer-const': 'error',
    'import/order': [
      'error',
      {
        groups: [['external', 'builtin'], 'internal', ['parent', 'sibling', 'index']],
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'react/no-string-refs': 'warn',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/display-name': 'off',
    complexity: 'off',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/restrict-plus-operands': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-shadow': 'off',
    // 'no-unreachable': 'off',
  },
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
}
