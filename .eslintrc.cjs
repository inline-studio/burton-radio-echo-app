/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    ignorePatterns: ['/dist/*'],

    root: true,
    env: {
        browser: false,
        es2021: true,
    },
    extends: [
        'expo',
        // 'plugin:vue/base',
        // 'plugin:vue/vue3-essential',
        // 'plugin:vue/vue3-recommended',
        'plugin:import/recommended',
        'plugin:@typescript-eslint/strict-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'eslint:recommended',
        // '@vue/typescript/recommended',
        // '@vue/eslint-config-typescript',
        'prettier',
    ],
    settings: {
        'import/extensions': ['.mjs', '.js', '.jsx', '.mts', '.ts', '.tsx'],
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
        'import/parsers': {
            '@typescript-eslint/parser': ['.mts', '.ts', '.tsx', '.d.ts'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: ['**/tsconfig.json', '**/tsconfig.*.json'],
                extraFileExtensions: ['.vue'],
            },
        },
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                'vue/block-lang': [
                    'error',
                    {
                        script: {
                            // Only `<script lang="ts">` is allowed.
                            lang: 'ts',
                            allowNoLang: false,
                        },
                    },
                ],
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        project: ['**/tsconfig.json', '**/tsconfig.*.json'],
        extraFileExtensions: ['.vue'],
    },
    // parser: 'vue-eslint-parser',
    parser: '@typescript-eslint/parser',
    plugins: ['import', 'prettier', '@typescript-eslint'],
    rules: {
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                mjs: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
                mts: 'never',
                // Cannot omit `.vue` extensions.
                // This should be enforced all across the Vue.js ecosystem.
                vue: 'always',
            },
        ],
        'import/no-unresolved': 'error',
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        // 'linebreak-style': ['error', 'unix'],
        // semi: ['warn', 'always'],
        // indent: [
        //     'warn',
        //     4,
        //     {
        //         SwitchCase: 1,
        //     },
        // ],
        'import/order': ['warn'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '_unused_',
                varsIgnorePattern: '_unused_',
            },
        ],
        // 'vue/html-indent': ['warn', 4],
    },
};
