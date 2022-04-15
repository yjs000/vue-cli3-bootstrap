<template>
  <ul class="nav nav-tabs mt-3 border-0">
    <template v-if="tabList.length > 0">
      <TabItem
        v-for="(tab, key) in tabList"
        :tabInfo="tab"
        :key="key"
        :closeTab="closeTab"
        :clickTab="clickTab"
        :currentTab="currentTab"
        >{{ tab.menuNm }}</TabItem
      >
    </template>
  </ul>


  
</template>


<script>
// import TabBox from "./TabBox.vue";
import TabItem from "./TabItem.vue"
// import NavItem from "./../CmmnBootstrap/NavItem.vue"

export default {
  props: ["tabList", "closeTab", "clickTab", "currentTab"],
  
  data() {
    return {};
  },
  computed: {
  },
  components: {
    // TabBox,
    TabItem,
  },
};
</script>