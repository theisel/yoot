<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](/docs/README.md) &gt; [API Reference](/docs/api/README.md) &gt; [@yoot/yoot](./yoot.md) &gt; [jsx](./yoot.jsx.md) &gt; <span style="opacity:0.7;font-style:italic">ImgAttrsOptions</span>

## jsx.ImgAttrsOptions type

Options for `getImgAttrs` and `withImgAttrs`<!-- -->.

**Signature:**

```typescript
type ImgAttrsOptions = Prettify<WithSrcSetBuilder & Omit<ImgAttrs, 'height' | 'src' | 'width'>>;
```

**References:** [WithSrcSetBuilder](./yoot.jsx.withsrcsetbuilder.md)<!-- -->, [ImgAttrs](./yoot.jsx.imgattrs.md)

## Remarks

Allows passthrough of `HTMLImgAttributes`<!-- -->. `srcSetBuilder` is used for `srcset`<!-- -->. `alt` acts as a fallback.
