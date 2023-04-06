<template>
    <a @click="pushing" style="cursor: pointer;">{{ data?.id }}</a>
</template>
<script>
    export default {
        props: ["data"],
        methods:{
            pushing(){
                this.$router.push({name:"TransferDetail", params:{id: this.data?.id}});
            }
        }
    }
</script>