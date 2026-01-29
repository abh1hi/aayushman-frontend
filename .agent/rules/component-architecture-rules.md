---
trigger: always_on
---

- **Atomic Structure:** Break UI into reusable components (buttons, cards, sections).
- **No Duplication:** Shared UI patterns must be abstracted into reusable components.
- **Props First:** Components must receive data via props. Avoid hardcoding content unless static in the design.
- **Emit Events:** Use emits for parent-child communication. Do not mutate props directly.
