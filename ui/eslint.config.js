import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';
import tseslint from 'typescript-eslint';

const baseConfig = [
    {
        ignores: ['dist', 'eslint.config.js'],
    },
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            parser: tseslint.parser,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'react-dom': reactDom,
            'react-x': reactX,
        },
        rules: {
            ...reactHooks.configs['recommended-latest']?.rules,
            ...reactRefresh.configs.vite?.rules,
            ...reactDom.configs.recommended?.rules,
            ...reactX.configs['recommended-typescript']?.rules,
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'off',
            'react-hooks/immutability': 'off',
            'react-hooks/incompatible-library': 'off',
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        // Allow promise-returning handlers in JSX props; components handle their own errors/loading.
                        attributes: false,
                    },
                },
            ],
            // TODO: Revisit these overrides
            'react-hooks/refs': 'warn',
            'react-hooks/set-state-in-effect': 'off',
            'react-refresh/only-export-components': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
        },
    },
];

export default baseConfig;
