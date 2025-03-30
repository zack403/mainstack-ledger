import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';


export default defineConfig([
  {
    files: ['src/**/*.{ts}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2021,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      'no-console': 'warn',
    },
  },
  tseslint.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**']

  }
]);