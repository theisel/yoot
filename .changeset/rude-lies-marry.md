---
'@yoot/yoot': patch
---

Corrects attributes returned by `getSourceAttrs` helper:

- The `width` and `height` attributes now reflect the final transformed dimensions instead of the original.
- The `type` attribute is no longer being set when `format` directive is `auto`.
