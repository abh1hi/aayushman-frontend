---
trigger: always_on
---

- **Minimal State:** UI state only (accordion open, modal visible, etc.). No business logic.
- **Local State:** Keep state local to components unless shared.
- **No Side Effects:** Components must not trigger unexpected side effects on mount.
