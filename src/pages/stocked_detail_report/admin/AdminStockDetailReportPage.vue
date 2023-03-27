<template>
    <StockDetailReportPageTemplate :onValidate="onValidate" v-model:myRows="rows" :userId="userSelector">
        <template #body>
            <div class="field col-12 md:col-3">
                <label>User</label>
                <UserDropDownPagination v-model:userSelector="userSelector"></UserDropDownPagination>
            </div>
        </template>
    </StockDetailReportPageTemplate>
</template>

<script>
    import StockDetailReportPageTemplate from '../components/StockDetailReportPageTemplate.vue';
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
    
    export default{
        data() {
            return {
                userSelector: null,
                rows:10
            };
        },
        computed: {},
        methods: {
            onValidate({ toDate, fromDate, correctDate }) {
                const validate = toDate && fromDate && correctDate && this.userSelector!=null;
                return validate;
            }
        },
        components: { StockDetailReportPageTemplate, UserDropDownPagination },
    }
</script>       