<template>
  <h1>hello</h1>
  <slot name="tempMsg"/>
  <slot name="content"/>
</template>

<script>
export default {
  name: "CmmnContent",
  // props: ["component", "tabInfo"],
}
</script>