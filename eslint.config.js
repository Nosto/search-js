import eslintConfigPrettier from "eslint-config-prettier"
import barrelFiles from "eslint-plugin-barrel-files"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist", "docs"] },
  {
    extends: [...tseslint.configs.recommended],
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  {
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    }
  },
  {
    plugins: {
      "barrel-files": barrelFiles
    },
    files: ["**/src/*.{js,ts,tsx}"],
    rules: {
      "barrel-files/avoid-barrel-files": 2,
      "barrel-files/avoid-importing-barrel-files": 2,
      "barrel-files/avoid-namespace-import": 2,
      "barrel-files/avoid-re-export-all": 2
    }
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended
)
