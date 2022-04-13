<template>
  <div id='content1'></div>
</template>

<script>

export default {
  data(){
		return{
			html : null
		}
	},
	created(){
		this.getHTML();
	},
	methods : {
		async getHTML(){
			const res = await fetch("WEBTEMP/adm/javascript/tab/tab_1.do");
			const html = await res.text();
			this.html = html;
			const root = document.getElementById("content1");
			root.innerHTML = this.html;
		},
	}
}
</script>