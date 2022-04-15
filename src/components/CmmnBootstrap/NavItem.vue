<template>
  <li class="nav-item w-30 m-0 p-0">
    <a class="nav-link" :href="href" 
    @click.prevent=""
    >
      <slot />
    </a>
  </li>
</template>

<script>
export default {
  props : ["href"],
  data(){
    // console.log(this.href)
    return{}
  },
  methods :{
    addTab(){
      console.log(this.href)
      return null;
    }
  }
}
</script>