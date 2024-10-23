module.exports = {
  root: true,
  env: {
    // 전역 변수 사용을 정의합니다. 추가하지 않으면 ESLint 규칙에 걸리게 됩니다.
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // 해당 플러그인의 권장 규칙을 사용합니다.
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // plugin과 eslint-config-prettier 설정을 한번에 합니다.
    'plugin:tailwindcss/recommended',
    'next/typescript',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser', // ESLint 파서를 지정합니다.
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // JSX를 파싱할 수 있습니다.
    },
    ecmaVersion: 'latest', // Modern ECMAScript를 파싱할 수 있습니다.
    sourceType: 'module', // import, export를 사용할 수 있습니다.
  },
  plugins: ['@typescript-eslint', 'import', 'jsx-a11y'],
  rules: {
    'import/no-duplicates': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'import/no-unresolved': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'react/jsx-sort-props': [
      'error',
      {
        ignoreCase: true,
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    //windows를 위한 설정
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        groups: [
          'type',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '{react*,react*/**}',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '{@*,@*/**}',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // 현재 사용하고 있는 react 버전을 eslint-plugin-react가 자동으로 감지합니다.
    },
    'import/resolver': {
      typescript: {
        // this loads <rootdir>/tsconfig.json to eslint
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: [
    'node_modules/',
    './next/',
    '**/generated/',
    '*.config.js',
    './packages/admin/legacy',
  ],
};
