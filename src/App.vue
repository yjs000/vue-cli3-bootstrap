<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <BootstrapTest />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import BootstrapTest from "./components/BootstrapTest.vue"

export default {
  name: 'App',
  components: {
    HelloWorld,
    BootstrapTest
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
