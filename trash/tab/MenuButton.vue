<template>
    <button :id="btnId" type="button" class="btn btn-primary" @click="$emit('open-tab', menuInfo)">
		{{menuInfo.name}}
	</button>
</template>

<script>
export default {
    props : ["menuInfo"],
	emits : ['open-tab'],
	computed : {
		btnId(){
			return "btn" + this.menuInfo.id
		},
	},
}
</script>