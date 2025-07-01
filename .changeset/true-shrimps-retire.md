---
'@yoot/yoot': minor
---

**BREAKING CHANGE:** The behavior of the `.toJSON()` method has changed.

`.toJSON()` now returns a raw copy of the object's state and ignores any previous normalized directives.

**Migration:** Use `.toResolvedJSON()` to get fully resolved and normalized state.
