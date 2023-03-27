<template>
    <BillingListTemplate :toInitData="toInitData" :userSelecter="userSelecter" :rows="rows">
        <template #body>
            <UserDropDownPagination v-model="userSelecter"></UserDropDownPagination>
        </template>
    </BillingListTemplate>
</template>

<script>
    import { mapGetters } from 'vuex';
    import BillingListTemplate from '../components/BillingListTemplate.vue';
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';

    export default{
        components:{
            BillingListTemplate,
            UserDropDownPagination
        },
        data(){
            return {
                userSelecter: null,
                rows: 10,
            };
        },
        computed: {
            ...mapGetters({
                getUserId: 'auth/getUserId'
            })
        },
        methods:{
            async toInitData(){
                const myData = await this.$store.dispatch("billing/onFetchBilling", {
                    limit: this.rows,
                    offset: 0,
                    userId: this.userSelecter
                }); 

                return myData;
            },
        },
    }
</script>