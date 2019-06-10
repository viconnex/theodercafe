module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
      "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      "prettier/@typescript-eslint",
      "plugin:prettier/recommended",
    ],
    parserOptions: {
      ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
      sourceType: "module" // Allows for the use of imports
    },
    rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/no-parameter-properties": "off"
    },
    overrides: [
      {
        "files": ["*-test.js","*.spec.ts"],
        "rules": {
          "@typescript-eslint/explicit-function-return-type": "off"
        }
      }
    ]
};