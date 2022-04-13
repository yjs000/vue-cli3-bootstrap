<template>
    <span>
	<li class="nav-item">
    	<a class="nav-link" :class="{active : isActive}" @click="$emit('set-current-tab')">{{tabInfo.name}}</a>
	</li>
	<span @click="closeTab(tabInfo)"> x </span>
</span>
</template>

<script>
export default {
    props : ["tabInfo", "closeTab", "currentTab"],
	data(){
		return{}
	},
	computed : {
		isActive(){
			console.log(this.currentTab);
			return this.currentTab == ("content" + this.tabInfo.id);
		}
	}
}
</script>