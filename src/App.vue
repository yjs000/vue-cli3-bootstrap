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

    <!-- <template v-else-if="menuObj.lnknInfo.includes('http://')">
      <a 
        :href="menuObj.lnknInfo"
      >{{menuObj.menuNm}}</a>
    </template> -->

    <!-- <template v-else>
      <a :href="menuObj.lnknInfo">없음</a>
    </template> -->
  </template>
  
  <router-view v-slot="{ TheTab, route }">
    <the-tab :route="route"></the-tab>
  </router-view>
</template>

<script>
// import OSroot from './components/root/OSroot.vue';
import { data } from '@/menuData.js'
import TheTab from '@/components/TheTab.vue'

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
  components : {
    TheTab
  }
}
</script>

<style>
</style>
