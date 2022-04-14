<template>
  <CmmnMenu :menuData="menuData"/>
</template>

<script>
import CmmnMenu from "./components/CmmnMenu/CmmnMenu.vue"
import {data} from "./menuData";

const fetch = () => {
  const menuData = data.filter(obj => obj.useYn === "Y");
  return menuData;
}

const menuData = fetch();


export default {
  name: 'App',
  data(){
    return {
      menuData,
      
    }
  },
  components: {
    CmmnMenu,
  }
}
</script>

<style>
</style>
