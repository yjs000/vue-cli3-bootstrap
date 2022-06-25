<template>
    <div id="tab">    
        <div id="tab-header">
            tab header 
            {{$route.params.dpth3}}
        </div>
        <div id="tab-content">
            {{dpth1}} Content
        </div>
    </div>
</template>

<script>
//TheTab이 생성된 후 link를 클릭해서 route를 넣어줌. => route.params에 dpth가 없음
export default {
    props:['route'],
    data(){
        console.log("this", this)
        console.log("props",this.route)
        return{
            dpth1: this.route.params.dpth1,
            dpth2: this.route.params.dpth2,
            dpth3: this.route.params.dpth3
        }
    },
    //method로 component임포트
    components: {
        Content : () => import(`@/views/${this.dpth1}/${this.dpth2}/${this.dpth3}`)
    }
}
</script>