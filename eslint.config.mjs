import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Never lint the archived legacy app, build output, tooling, or docs.
  {
    ignores: [
      "_archive/**",
      ".next/**",
      "node_modules/**",
      ".github/**",
      "docs/**",
      ".agents/**",
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
