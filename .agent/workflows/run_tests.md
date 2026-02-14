---
description: Run all project tests (Build, SEO, DOM Size, Audit)
---

1. Build the project to generate static assets
// turbo
npm run build

2. Run Custom SEO checks (Title length, H1 count, etc.)
// turbo
npm run test:seo

3. Run DOM Size checks (Performance warning)
// turbo
npm run test:dom-size

4. Run Full SEO & Performance Audit (Unlighthouse) on the build output
// turbo
npm run audit
