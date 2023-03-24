<template>
    <StockDetailReportPageTemplate :onValidate="onValidate" :userId="myUserId" v-model:myRows="rows">
    </StockDetailReportPageTemplate>
</template>

<script>
    import StockDetailReportPageTemplate from './components/StockDetailReportPageTemplate.vue';
    import { mapGetters } from 'vuex';

    export default{
        components: { StockDetailReportPageTemplate },
        data(){
            return {
                rows: 10,
            }
        },
        computed:{
            ...mapGetters({
                myUserId: "auth/getUserId",
           })
        },
        methods:{
            onValidate({toDate, fromDate, correctDate}){
                const validate = toDate && fromDate && correctDate;
                return validate;
            }
        }
    }
</script>