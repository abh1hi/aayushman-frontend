---
trigger: always_on
---

- **Formatting:** Use consistent indentation (2 spaces). Enforce formatting using Prettier and ESLint.
- **Naming Conventions:**
  - Components: `PascalCase` (e.g., `HeroSection.vue`)
  - Files & folders: `kebab-case`
  - Variables & functions: `camelCase`
- **Template Cleanliness:** Keep templates readable. Avoid inline logic; move logic to `<script setup>`.
- **Comments:** Comment only non-obvious logic. Do not comment obvious markup or Tailwind classes.
