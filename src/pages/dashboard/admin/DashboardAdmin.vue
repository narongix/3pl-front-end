<template>
    <Dashboard 
            :monthlyMetric="monthlyMetric"
			:monthlyMetricPeriodReceipt="monthlyMetricPeriodReceipt"
            :monthlyMetricPeriodDelivery="monthlyMetricPeriodDelivery"
			:dailyMetric="dailyMetric"
			:completedTransferDelivery="getCompletedTransferDelivery"
            :completedTransferReceipt="getCompletedTransferReceipt"
			:userSelector="userSelecter"
			:toLoadAdditional="initData"

			v-model:rows1="rows1"
			v-model:rows2="rows2"
			v-model:rows3="rows3"
    ></Dashboard>
</template>

<script>
    import Dashboard from '../components/DashboardTemplate.vue';

    export default{
        created(){
            this.userSelecter = this.getUserId;
        },
        components:{
            Dashboard
        },
        data(){
            return {
                userSelecter: null,
                rows1: 10,
                rows2: 10,
                rows3: 10,

                monthlyMetric: null,
                dailyMetric: null,
                monthlyMetricPeriodDelivery: [],
                monthlyMetricPeriodReceipt: []
            };
        },
        computed:{
            getUserId(){
                return this.$store.getters["auth/getUserId"];
            },
            getCompletedTransferDelivery(){
                return this.$store.getters["dashboard/getCompletedTransferDelivery"].filter((e)=>e.user_id == (this.userSelecter ?? e.user_id));
            },
            getCompletedTransferReceipt(){
                return this.$store.getters["dashboard/getCompletedTransferReceipt"].filter((e)=>e.user_id == (this.userSelecter ?? e.user_id));
            }
        },
        methods:{
            async initData(){
                const month = new Date().getMonth()+1;
				this.monthlyMetric = await this.$store.dispatch("dashboard/onFetchMonthlyMetric", {month: month, userId: this.userSelecter});
				
                const deliveryMetricPeriod = await this.$store.dispatch("dashboard/onFetchMonthlyMetricPeriodDelivery", {limit: this.myRows1, offset: 0});
				this.monthlyMetricPeriodDelivery = deliveryMetricPeriod?.deliveries_on_time_rate ?? [];
                const receiptMetricPeriod = await this.$store.dispatch("dashboard/onFetchMonthlyMetricPeriodReceipt", {limit: this.myRows2, offset: 0});
                this.monthlyMetricPeriodReceipt = receiptMetricPeriod?.avg_receipt_time ?? [];
                this.dailyMetric = await this.$store.dispatch("dashboard/onFetchDailyMetric");
                
				const completeReceipt = await this.$store.dispatch("dashboard/onFetchCompleteTransferReceipt", {userId: this.userSelecter});
				const completeDelivery = await this.$store.dispatch("dashboard/onFetchCompleteTransferDelivery", {userId: this.userSelecter});
				const unmeasuredProduct = await this.$store.dispatch("dashboard/onFetchUnmeasuredProduct", {limit: this.myRows3, offset: 0});
                return {completeReceipt, completeDelivery, unmeasuredProduct}
            }
        }
    }
</script>