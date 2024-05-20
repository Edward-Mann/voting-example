import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.url,
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ["views/socket.io.js"],
  },
  ...compat.extends('eslint:recommended'),
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        es6: true,
      },
    },
    rules: {
      "no-extra-semi": "off",
      "space-before-function-paren": ["error", "always"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "block-spacing": ["error", "always"],
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "eqeqeq": ["error", "always"],
      "quotes": ["error", "single"],
      "yoda": ["error", "never"],
      "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      "semi-spacing": ["error", { "before": false, "after": true }],
      "space-infix-ops": ["error", { "int32Hint": false }],
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      "wrap-iife": ["error", "any"],
      "no-return-assign": ["error", "always"],
      "no-sequences": ["error"],
    },
  },
];
