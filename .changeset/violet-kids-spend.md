---
'@yoot/shopify': patch
---

Clamps the `dpr` directive to Shopify's supported range (1–3) and ensures it is a whole number.
Returns an empty path segment if `dpr` is 1 or not a number.
