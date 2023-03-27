<template>
    <BillingListTemplate :toInitData="toInitData" :userSelecter="getUserId" :rows="rows"></BillingListTemplate>
</template>

<script>
    import { mapGetters } from 'vuex';
    import BillingListTemplate from './components/BillingListTemplate.vue';

    export default{
        components:{
            BillingListTemplate
        },
        data(){
            return{
                rows: 10
            }
        },
        computed: {
            ...mapGetters({
                getUserId: 'auth/getUserId'
            })
        },
        methods:{
            async toInitData(){
                const myData = await this.$store.dispatch("billing/onFetchBilling", {
                    limit: this.row,
                    offset: 0,
                    userId: this.getUserId
                }); 

                return myData;
            }
        }
    }
</script>