module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint/eslint-plugin"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  globals: {
    console: "readonly",
    fetch: "readonly",
    process: "readonly"
  },
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.js", "./**/*.graphql"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    indent: [
      "error",
      4,
      {
        ignoreComments: true,
        ignoredNodes: ["PropertyDefinition", "ConditionalExpression", "SwitchCase"]
      }
    ],
    quotes: ["error", "double"],
    "@typescript-eslint/no-unused-vars": "off"
  }
};
