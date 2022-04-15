<template>
  <div>
    <ul id="tabBox" class="nav nav-tabs">
      currentTab :
      {{
        currentTab
      }}
      <TabItem
        v-for="(tab, key) in tabList"
        :key="key"
        :tab-info="tab"
        :close-tab="closeTab"
        :current-tab="currentTab"
        @set-current-tab="setCurrentTab(tab.id)"
      />
    </ul>
    <KeepAlive>
      <component :is="currentTab"></component>
    </KeepAlive>
  </div>
</template>

<script>
import TabItem from "./TabItem.vue";

import TabContent1 from "./contnets/TabContent1.vue";
import TabContent2 from "./contnets/TabContent2.vue";
import TabContent3 from "./contnets/TabContent3.vue";


export default {
  props: ["tabList", "closeTab", "currentTab"],
  data() {
    return {};
  },
  computed: {},
  components: {
    TabItem,
    TabContent1,
    TabContent2,
    TabContent3,
  },
  methods: {
    setCurrentTab(tabId) {
      if (tabId != null) {
        this.$parent.currentTab = "TabContent" + tabId;
      }
    },
  },
};
</script>