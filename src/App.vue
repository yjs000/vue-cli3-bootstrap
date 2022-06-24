<template>
<!-- <OSroot></OSroot>  -->
  <router-link to="/">Home</router-link>
  <template v-for="menuObj in menuData"
    :key="menuObj.menuId">
    <template v-if="menuObj.lnknInfo">
      <router-link 
        :to="menuObj.lnknInfo"
      >{{menuObj.menuNm}}</router-link>
    </template>
    <template v-else></template>
  </template>
  
  <router-view></router-view>
</template>

<script>
// import OSroot from './components/root/OSroot.vue';
import { data } from '@/menuData.js'

const fetchData = () => {
  const menuData = data.filter((obj) => obj.useYn === "Y");
  return menuData;
}
// const menuData = (fetchData());
// const depth4Menu = JSON.stringify(fetchData());
// console.log(depth4Menu)

export default {
  name: "App",
  data(){
    return {
      menuData: data,
    }
  },
}
</script>

<style>
</style>
