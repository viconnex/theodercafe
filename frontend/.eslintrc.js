module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'eslint:recommended',
    'react-app',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  parserOptions: {
    ecmaVersion: 2019,
    es6: true,
    sourceType: 'module',
    node: true,
  },
  plugins: ['prettier', 'react', 'import'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': [1],
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
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-shadow': [
      'error',
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
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  root: true,
  settings: {
    react: {
      version: 'detect',
    },
  },
}
