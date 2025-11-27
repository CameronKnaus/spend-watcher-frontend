import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            reactX.configs['recommended-typescript'],
            reactDom.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            parser: tseslint.parser,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-non-null-assertion': 'off',
            // TODO: Revisit these overrides
            'react-refresh/only-export-components': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
        },
    },
]);
