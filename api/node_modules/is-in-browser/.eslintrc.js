module.exports = {
  root: true,
  ignorePatterns: ["dist/**/*", ".eslintrc.js"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "prettier/prettier": "error",
  },
};
