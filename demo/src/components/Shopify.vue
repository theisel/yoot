<script setup lang="ts">
import {type Yoot} from '@yoot/yoot';
import {yoot} from '@yoot/yoot';
import {getImgAttrs} from '@yoot/yoot/jsx';
import {computed} from 'vue';

const props = defineProps<{
  nvc: Function;
}>();

const imgAttrs = computed(() => getImgAttrs(props.nvc));
</script>

<template>
  <img v-bind="imgAttrs" />
</template>
