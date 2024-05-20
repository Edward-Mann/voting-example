module.exports = {
      extends: "eslint:recommended",
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      ignorePatterns: ["views/socket.io.js"],
      rules: {
        // Your custom rules here
      },
    };
    