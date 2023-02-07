<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Stock Detail Report</h5>
                <div class="p-fluid formgrid grid">
                    <div class="md:col-2"></div>
                    <div class="field col-12 md:col-4 sm:col-12" >
                        <label>From Date</label>
                        <Calendar :manualInput="false" 
                        v-model="fromDate" @date-select="onSelectDate"
                        :dateFormat="getCalendarFormat" :hideOnDateTimeSelect="false" placeholder="Select begining of Date"></Calendar>
                    </div>
                    
                    <div class="field col-12 md:col-4 sm:col-12">
                        <label>To Date</label>
                        <Calendar :manualInput="false" 
                        v-model="toDate" @date-select="onSelectDate"
                        :dateFormat="getCalendarFormat" :hideOnDateTimeSelect="false" placeholder="Select End of Date"></Calendar>
                    </div>
                    <div class="md:col-2"></div>
                </div>

                <DataTable :value="getStockedList" class="p-datatable-sm" dataKey="product_id"
                :rowHover="true" fiterDisplay="menu" responsiveLayout="scroll" v-model:rows="row"
                :rowsPerPageOptions="[10, 20, 30]" v-model:selection="mySelected" :paginator="true"
                @page="onPage($event)"
                >
                    <template #empty>
                        <p>No StockDetail Report found. Please select dates to fetch.</p>
                    </template>
                    <Column selectionMode="multiple"></Column>

                    <Column field="product_id" header="Product Id" :sortable="true" style="min-width:15rem"></Column>
                    <Column field="product_name" header="Product Name" :sortable="true" style="min-width:15rem"></Column>
                    <Column field="beginning" header="Beginning" :sortable="true"></Column>
                    <Column field="incoming" header="Incoming" :sortable="true"></Column>
                    <Column field="outgoing" header="Outgoing" :sortable="true"></Column>
                    <Column field="adjusted" header="Adjusted" :sortable="true"></Column>
                    <Column field="ending" header="Ending" :sortable="true"></Column>
                </DataTable>
            </div>
        </div>
    </div>

    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToast"></RetryField>
    <HiddenRetryField :toLoad="toLoadHidden" :message="messageHidden" :errorToast="errorToastHidden"></HiddenRetryField>
</template>

<script>
    import { mapGetters } from 'vuex';
    import HiddenRetryField from '../../components/prompt_field/HiddenRetryField.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';

    export default{
        components:{
            RetryField,
            HiddenRetryField
        },
        data(){
            return {
                mySelected: [],
                row: 10,

                fromDate: null,
                toDate: null,
                outOfFetch: 3,
                offset: 0,

                toLoadHidden: null,
                messageHidden: {
                    noButton: "No",
                    yesButton: "Yes",
                    failed: "Loading Failed, retry?"
                },
                errorToastHidden: {
                    severity: "error",
                    summary: "Loading Failed!",
                    detail: "Error Loading Stocked Detail Report",
                    life: 3000
                },



                toLoadRetry: null,
                message: {
                    failed: "Loading failed, retry?",
                    yesButton: "Yes",
                    noButton: "No"
                },
                
                errorToast:{
                    severity: "error",
                    summary: "Loading Failed!",
                    detail: "Error Loading Stocked Detail Report",
                    life: 3000
                }
            }
        },
        computed:{
            ...mapGetters({
                getStockedList: "stockedDetailReport/getStockedList"
            }),

            getCalendarFormat(){
                return TimeConvert.timeFormatForCalendar
            }
            
        },
        methods:{
            async onPage(event){
                if (event.page + 1 == Math.floor(this.getStockedList.length / 10 && this.outOfFetch!=0 && this.validate())) {
                    this.toLoadHidden = async()=>{
                        const length = await this.$store.dispatch("stockedDetailReport/onfetchAndUpdateStockedList", {
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: this.row*2,
                            offset: this.offset
                        })      
                        this.offset = this.offset + this.row*2
                        if(length==0){
                            this.outOfFetch=0
                        }
                    }

                }
            },

            async onSelectDate(){
                if(this.validate()){
                    this.toLoadRetry = async()=>{
                        await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList", {
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: this.row*2,
                            offset:0
                        })
                    }
                    this.offset = this.row*2
                    this.outOfFetch=3
                }
            },

            validate(){
                const isValidate = this.toDate && this.fromDate && TimeConvert.convertToMs(this.toDate) >= TimeConvert.convertToMs(this.fromDate)
                return isValidate
            }
        }
    }
</script>