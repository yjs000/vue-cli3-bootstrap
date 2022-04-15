<template>
  <CmmnMenu :menuData="menuData" @menu-click="addTab">
    <template #logo>UlsanOS</template>
  </CmmnMenu>
  <CmmnTab :tabList="tabList" :closeTab="removeTab" :clickTab="setCurrentTab" :currentTab="currentTab"> </CmmnTab>
  
  <KeepAlive :exclude="excludeContent">
    <component :is="cmmnContent">
      <template #tempMsg> 
          <h1>hello {{currentTab.menuNm}}</h1>
        </template>
        <template #content>
          <component :is="tabContent"/>
        </template>
    </component>
    
  </KeepAlive>
      <!-- <component :is="tabContent" >
      </component>   -->

      
</template>

<script>
import CmmnMenu from "./../CmmnMenu/CmmnMenu.vue"
import CmmnTab from "./../CmmnTab/CmmnTab.vue";
import CmmnContent from "../CmmnTab/contents/CmmnContent.vue"
import ErrorComp from "../ErrorComp.vue"
import { data } from "../../menuData";

// contents
import MyContent102010000 from "./../CmmnTab/contents/MyContent102010000.vue"

//메뉴는 어차피 다시 작성할 가능성이 높음
//tab이나 화면은 재사용성 높음

const fetch = () => {
  const menuData = data.filter((obj) => obj.useYn === "Y");
  return menuData;
};

const menuData = fetch();

export default {
  name: "App",
  data() {
    console.log(this.CmmnContent)
    console.log(this.MyContent102010000)
    return {
      menuData,
      tabList: [],
      currentTab: null,
      excludeContent : [],
      cmmnContent : this.CmmnContent ?? "ErrorComp",
    };
  },
  computed : {
    tabContent(){
      return this.currentTab ? "MyContent" + this.currentTab.menuId : null;
    },
    cmmnContent(){
      return this.currentTab ? "CmmnContent" : null;
    }
  },
  components: {
    ErrorComp,
    CmmnMenu,
    CmmnTab,
    CmmnContent,
    MyContent102010000
  },
  methods: {
    addTab(tabInfo) {
      if (!this.tabList.includes(tabInfo)) {
        this.tabList.push(tabInfo);
        this.setCurrentTab(tabInfo);
      }
      
      //check excluded content
      const index = this.excludeContent.indexOf("MyContent" + tabInfo.menuId)
      if(index != -1){
        //remove from excluded list
        this.excludeContent.splice(index, 1);
      }
    },
    removeTab(tabInfo) {
      let index = this.tabList.indexOf(tabInfo);
      this.tabList.splice(index, 1);
      if(this.currentTab.menuId == tabInfo.menuId){ //지워진 아이가 현재 선택된 아이면
        if(index > this.tabList.length-1){
          index = this.tabList.length-1;
        }
        this.setCurrentTab(this.tabList[index]);
      }

      //exclude content frome keep alive
      this.excludeContent.push("MyContent" + tabInfo.menuId);
      console.log(this.excludeContent);
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