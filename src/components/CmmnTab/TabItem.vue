<template>
  <li class="nav-item m-0 p-0">
    <a class="nav-link"
      :class="{active : currentTab.menuId == tabInfo.menuId}" 
      @click.self="clickTab(tabInfo)">
      <slot />
      <button
        type="button"
        class="btn-close ps-2 pe-0"
        style="fontsize: 0.7em"
        @click.self="closeTab(tabInfo)"
      ></button>
    </a>
  </li>
  <span> </span>
</template>

<script>
export default {
  props : ["tabInfo","closeTab", "clickTab", "currentTab"],
  data() {
    console.log(this.clickTab)
    return {

    };
  },
};
</script>