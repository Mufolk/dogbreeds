module.exports = [
  {
    files: ["*.ts", "*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      // Your rules here
      semi: ["error", "always"],
      "no-unused-vars": "warn",
    },
  },
];
