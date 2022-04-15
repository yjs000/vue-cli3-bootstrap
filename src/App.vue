<template>
  <CmmnMenu :menuData="menuData" @menu-click="addTab">
    <template #logo>UlsanOS</template>
  </CmmnMenu>
  <CmmnTab :tabList="tabList" :closeTab="removeTab" :clickTab="setCurrentTab" :currentTab="currentTab"> </CmmnTab>
  <KeepAlive>
    <component :is="tabContent">
      </component>
  </KeepAlive>
</template>

<script>
import CmmnMenu from "./components/CmmnMenu/CmmnMenu.vue";
import CmmnTab from "./components/CmmnTab/CmmnTab.vue";
import CmmnButton from "./components/CmmnButton/CmmnButton.vue"
import CmmnContent from "./components/CmmnTab/contents/CmmnContent.vue"
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
    CmmnContent,
    CmmnButton,
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
      let index = this.tabList.indexOf(tabInfo);
      this.tabList.splice(index, 1);
      console.log(index);
      console.log(this.tabList.length);
      if(this.currentTab.menuId == tabInfo.menuId){ //지워진 아이가 현재 선택된 아이면
        if(index > this.tabList.length-1){
          console.log("bigger")
          index = this.tabList.length-1;
        }
        this.setCurrentTab(this.tabList[index]);
      }
    },
    setCurrentTab(tabInfo) {
      if(tabInfo){
        this.currentTab = tabInfo;
      } else {
        this.currentTab = null;
      }
    },
  },
};
</script>

<style>
</style>
