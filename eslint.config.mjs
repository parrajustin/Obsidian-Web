import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config({
  files: ["**/*.ts"],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended
  ],
  rules: {
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "no-console": 1, // Means warning
    "prettier/prettier": 2 // Means error
  }
});
