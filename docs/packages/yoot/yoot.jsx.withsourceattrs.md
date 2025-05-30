<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](/docs/README.md) &gt; [API Reference](/docs/api/README.md) &gt; [@yoot/yoot](./yoot.md) &gt; [jsx](./yoot.jsx.md) &gt; [withSourceAttrs](./yoot.jsx.withsourceattrs.md)

## jsx.withSourceAttrs() function

Returns a function that generates HTML attributes for a `<source>` tag.

**Signature:**

```typescript
declare function withSourceAttrs(
  options: SourceAttrsOptions,
): (yoot: Yoot, overrideOptions?: SourceAttrsOptions) => SourceAttrs;
```

## Parameters

<table><thead><tr><th>

Parameter

</th><th>

Type

</th><th>

Description

</th></tr></thead>
<tbody><tr><td>

options

</td><td>

[SourceAttrsOptions](./yoot.jsx.sourceattrsoptions.md)

</td><td>

`<source>` attributes and optional `srcSetBuilder`<!-- -->.

</td></tr>
</tbody></table>
**Returns:**

(yoot: [Yoot](./yoot.yoot.md)<!-- -->, overrideOptions?: [SourceAttrsOptions](./yoot.jsx.sourceattrsoptions.md)<!-- -->) =&gt; <span style="opacity:0.7;font-style:italic">SourceAttrs</span>

A function that accepts a `Yoot` object and returns HTML `<source>` attributes.

## Remarks

Merges provided attributes with derived ones.

## Example

```tsx
// yoot-presets.ts
import {withSourceAttrs} from '@yoot/yoot';

export const thumbnailPreset = yoot().width(96).aspectRatio(1);

export const getThumbnailSourceAttrs = withSourceAttrs({
  srcSetBuilder: buildSrcSet({widths: [96, 192]}), // Or, buildSrcSet({densities: [1, 2, 3]})
  sizes: '96w',
  media: '(min-width: 1024px)',
});

// somewhere else in your app
import {yoot, getImgAttrs} from '@yoot/yoot';
import {thumbnailPreset, getThumbnailSourceAttrs} from '@/yoot-presets';

const thumbnail = thumbnailPreset({src: 'https://cdn.example.com/image.jpg', alt: 'Thumbnail'});

<picture>
  <source {...getThumbnailSourceAttrs(thumbnail)} />
  <img {...getImgAttrs(thumbnail)} />
</picture>;
```
