<script lang="ts">
  import {yoot, type Yoot} from '@yoot/yoot';
  import {getImgAttrs} from '@yoot/yoot/html';

  type Props = {
    nvc: string | Yoot;
  };

  const {nvc, ...rest}: Props = $props();
</script>

<img {...getImgAttrs(yoot(nvc))} {...rest} />
