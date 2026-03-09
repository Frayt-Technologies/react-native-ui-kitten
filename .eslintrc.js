module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.0.0',
    },
  },
  ignorePatterns: ['src/template-js', 'src/template-ts', 'src/showcases'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint', 'react', 'react-native'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
      ],
      rules: {
        'no-undef': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'react-native/no-raw-text': 'off',
        'react-native/no-inline-styles': 'error',
        'react-native/no-single-element-style-arrays': 'error',

        // @ts-ignore is used in the codebase without descriptions; allow it
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': false }],

        // React Native uses require() for image assets
        '@typescript-eslint/no-require-imports': 'off',

        // Allow short-circuit && and ternary as statements (common RN pattern)
        '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],

        // Unused vars: allow _-prefixed and ignore rest-sibling destructuring
        '@typescript-eslint/no-unused-vars': ['error', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        }],
      },
    },
  ],
};
