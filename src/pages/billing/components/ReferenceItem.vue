<template>
    <a @click="pushing" style="cursor: pointer;">{{ data?.reference }}</a>
</template>

<script>
    export default{
        props:{
            data: Object
        },

        methods:{
            pushing(){
                this.$router.push({name:"billingDetail", query: {month: this.data.month, year: this.data.year}});
            }
        }

    }
</script>