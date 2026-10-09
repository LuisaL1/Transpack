import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import security from "eslint-plugin-security";

// Calidad (TypeScript + hooks de React), accesibilidad (jsx-a11y) y patrones
// inseguros (eslint-plugin-security). Ver TESTING.md.
export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      "playwright-report",
      "test-results",
      "coverage",
      "RecursosTranspack",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      security.configs.recommended,
    ],
    languageOptions: { ecmaVersion: 2022, globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Falsos positivos con claves fijas de objetos (datos propios del sitio).
      "security/detect-object-injection": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: "No inyectar HTML: renderice el contenido con JSX.",
        },
        { selector: "CallExpression[callee.name='eval']", message: "eval está prohibido." },
      ],
    },
  },
  // Las pruebas y los scripts leen archivos del propio repositorio a propósito,
  // y analizan ese código con expresiones regulares (nunca entrada externa).
  {
    files: ["tests/**", "scripts/**"],
    rules: {
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-unsafe-regex": "off",
    },
  },
);
