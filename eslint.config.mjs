import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Never lint the archived legacy app, build output, tooling, docs, or
  // generated files. `migrations/` is written by `payload migrate:create` and
  // is rewritten wholesale on every schema change, so lint findings there
  // cannot be fixed, only re-created.
  {
    ignores: [
      "_archive/**",
      ".next/**",
      "node_modules/**",
      ".github/**",
      "docs/**",
      ".agents/**",
      "migrations/**",
      "payload-types.ts",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Remote CDN images are rendered with plain <img> by design (see CLAUDE.md).
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
