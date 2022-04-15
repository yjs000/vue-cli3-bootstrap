<template>
  <CmmnMenu :menuData="menuData" @menu-click="addTab">
    <template #logo>UlsanOS</template>
  </CmmnMenu>
  <CmmnTab :tabList="tabList" :closeTab="removeTab" :clickTab="setCurrentTab" :currentTab="currentTab"> </CmmnTab>
  <KeepAlive>
    <component :is="tabContent" />
  </KeepAlive>
</template>

<script>
import CmmnMenu from "./components/CmmnMenu/CmmnMenu.vue";
import CmmnTab from "./components/CmmnTab/CmmnTab.vue";
import { data } from "./menuData";

import MyContent102010000 from "./components/CmmnTab/contents/MyContent102010000.vue"

const fetch = () => {
  const menuData = data.filter((obj) => obj.useYn === "Y");
  return menuData;
};

const menuData = fetch();

export default {
  name: "App",
  data() {
    return {
      menuData,
      tabList: [],
      currentTab: null,
    };
  },
  computed : {
    tabContent(){
      return this.currentTab ? "MyContent" + this.currentTab.menuId : null;
    }
  },
  components: {
    CmmnMenu,
    CmmnTab,
    MyContent102010000
  },
  methods: {
    addTab(tabInfo) {
      if (!this.tabList.includes(tabInfo)) {
        this.tabList.push(tabInfo);
        this.setCurrentTab(tabInfo);
      }
    },
    removeTab(tabInfo) {
      const index = this.tabList.indexOf(tabInfo);
      if(this.currentTab == tabInfo.menuId){
        this.setCurrentTab(this.tabList[index -1].menuId)
      }
      this.tabList.splice(index, 1);
      
    },
    setCurrentTab(tabInfo) {
      this.currentTab = tabInfo;
    },
  },
};
</script>

<style>
</style>
