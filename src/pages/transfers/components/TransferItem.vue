<template>
    <a @click="pushing" style="cursor: pointer;">{{ data.recipient }}</a>
</template>
<script>
    export default {
        props: ["data"],
        methods:{
            pushing(){
                this.$router.push({name:"TransferDetail", params:{id: this.data.id}})
            }
        },
        computed: {
            transferLink() {
                return this.$route.path + '/' + this.data.id;     
            }
        },
    }
</script>