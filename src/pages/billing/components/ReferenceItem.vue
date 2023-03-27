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
                this.$store.dispatch("billing/updateBillingDetailUserId", {userId: this.data.user_id});
                this.$router.push({name:"billingDetail", query: {month: this.data.month, year: this.data.year}});
            }
        }

    }
</script>