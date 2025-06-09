---
'@yoot/cloudinary': minor
'@yoot/shopify': minor
'@yoot/sanity': minor
'@yoot/imgix': minor
'@yoot/yoot': minor
---

Adds `baseUrl` getter to `Yoot` object, returning the normalized base URL or null when `src` is empty.
Adapters now implement the `normalizeUrl` handler to perform this conversion.
