<template>
  <!-- key가 필요함 -->
  <menu-button
    v-for="menu in menuList"
    :key="menu.id"
    :menu-info="menu"
    @open-tab="openTab"
  ></menu-button>
  {{ menuList }}
  {{ tabList }}
  <TabContainer
    :current-tab="currentTab"
    :tab-list="tabList"
    :close-tab="removeTab"
  />
  <KeepAlive>
    <component :is="currentTab"></component>
  </KeepAlive>
</template>

<script>
import MenuButton from "./MenuButton.vue";
import TabContainer from "./TabContainer.vue";

export default {
  data() {
    return {
      menuList: [
        { id: 1, name: "1번" },
        { id: 2, name: "2번" },
        { id: 3, name: "3번" },
      ],
      tabList: [],
      currentTab: null,
    };
  },
  components: {
    MenuButton,
    TabContainer,
  },
  methods: {
    openTab(tabInfo) {
      this.tabList.push(tabInfo);
      this.currentTab = "TabContent" + tabInfo.id;
    },
    removeTab(tabInfo) {
      if (tabInfo) {
        const target = this.tabList.indexOf(tabInfo);
        this.tabList.splice(target, 1);
      }
    },
  },
};
</script>