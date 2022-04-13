<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <BootstrapTest />
  <MyTab />
</template>

<script>
import BootstrapTest from "./components/BootstrapTest.vue"
import MyTab from "./components/tab/MyTab.vue"

export default {
  name: 'App',
  components: {
    BootstrapTest,
    MyTab
  }
}
</script>

<style>
</style>
