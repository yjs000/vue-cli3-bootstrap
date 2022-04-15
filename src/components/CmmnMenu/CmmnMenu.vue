<template>
  <ul class="navbar navbar-dark bg-dark p-2 mb-0">
    <li class="container-fluid col">
      <a class="navbar-brand" href="">
        <slot name="logo">LOGO</slot>
      </a>
    </li>
    <div class="container-fluid col">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#siteMap"
        aria-controls="siteMap"
        aria-expanded="false"
        aria-label="Toggle navigation"
        
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
    <div>
      <ul class="navbar-nav">
        <li class="nav-item col">
          <a class="nav-link" href="">dpth2menu</a>
        </li>
      </ul>
    </div>
  </ul>
  
  <div class="collapse" id="siteMap">
    <ul class="navbar navbar-expand navbar-dark bg-dark p-2 mb-0" v-for="menu1 in menuDpth1" :key="menu1.menuId">
      <li class="col-3">
        <a class="navbar-brand" :href="menu1.lnknInfo">{{menu1.menuNm}}</a>
      </li>
      <div>
        <ul class="navbar-nav" >
          <template v-for="menu2 in menuDpth2" :key="menu2.menuId">
            <li class="nav-item" v-if="menu1.menuId == menu2.hgrnMenuId">
              <ul >
                <NavItem :href="menu2.lnknInfo" @click="$emit('menuClick', menu2), toggleMenu()">
                  <strong>{{menu2.menuNm}}</strong>
                </NavItem>
                <template v-for="menu3 in menuDpth3" :key="menu3.menuId">
                  <NavItem v-if="menu2.menuId == menu3.hgrnMenuId" :href="menu3.lnknInfo" @click="$emit('menuClick', menu3), toggleMenu()">
                    {{menu3.menuNm}}
                  </NavItem>
                </template>
              </ul>
              </li>
          </template>
        </ul>
      </div>
    </ul>
  </div>
</template>

<script>
import NavItem from "../CmmnBootstrap/NavItem.vue"

export default {
  props: ["menuData"],
  emits: ["menuClick"],
  data() {
    return {
      showSiteMap: false,
    };
  },
  computed: {
    menuDpth1() {
      const result = this.menuData.filter((obj) => obj.menuDpth == 1)
        .sort((a, b) => a.sortNo - b.sortNo);
      return result;
    },
    menuDpth2() {
      const menu2 = this.menuData.filter((obj) => obj.menuDpth == 2).sort(
        (a,b) => a.sortNo - b.sortNo
      )      
      return menu2;
    },
    menuDpth3() {
      return this.menuData.filter((obj) => obj.menuDpth == 3).sort(
        (a,b) => a.sortNo - b.sortNo
      )
    },
  },
  components : {
    NavItem,
  },
  methods :{
     toggleMenu(){
      const toggler = document.querySelector(".navbar-toggler[data-bs-target='#siteMap']");
      toggler.click();
      return null;
    }
  }
};
</script>

