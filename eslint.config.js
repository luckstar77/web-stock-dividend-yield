import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'build', 'coverage'] },
    {
        files: ['**/*.{ts,tsx,js}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: globals.browser,
        },
        plugins: {
            '@stylistic': stylistic,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/jsx-quotes': ['error', 'prefer-double'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/max-len': ['error', { code: 160, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
);
