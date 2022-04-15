<template>
  <ul class="navbar navbar-dark p-2 mb-0" :class="[bootstrapClass]" :style="[backgroundColor]">
    <slot/>
  </ul>
</template>

<script>
export default {
  props : ["backgroudColor", "bootstrapClass"],
}
</script>
