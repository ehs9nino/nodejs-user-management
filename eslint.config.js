import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config} */
export default {
  languageOptions: {
    globals: globals.node, // Use Node.js globals
    ecmaVersion: 2021, // Use ES2021 features
    sourceType: "module" // Use ES Modules
  },
  plugins: {
    js: pluginJs
  },
  rules: {
    ...pluginJs.configs.recommended.rules // Extend recommended rules
  }
};
