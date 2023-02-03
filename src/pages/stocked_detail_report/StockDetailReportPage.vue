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
                        v-model="fromDate" @date-select="onFromDateSelect"
                        dateFormat="dd M yy" :hideOnDateTimeSelect="false" placeholder="Select begining of Date"></Calendar>
                    </div>
                    
                    <div class="field col-12 md:col-4 sm:col-12">
                        <label>To Date</label>
                        <Calendar :manualInput="false" 
                        v-model="toDate" @date-select="onToDateSelect"
                        dateFormat="dd M yy" :hideOnDateTimeSelect="false" placeholder="Select End of Date"></Calendar>
                    </div>
                    <div class="md:col-2"></div>
                </div>

                <DataTable :value="getStockedList" class="p-datatable-sm" dataKey="product_id"
                :rowHover="true" fiterDisplay="menu" responsiveLayout="scroll" v-model:rows="row"
                :rowsPerPageOptions="[10, 20, 30]" v-model:selection="mySelected"
                >
                    <template #empty>
                        <p>No StockDetail Report found. Please select dates to fetch.</p>
                    </template>
                    <Column selectionMode="multiple"></Column>

                    <Column field="product_id" header="Product Id" :sortable="true"></Column>
                    <Column field="product_name" header="Product Name" :sortable="true"></Column>
                    <Column field="begining" header="Begining" :sortable="true"></Column>
                    <Column field="incoming" header="Incoming" :sortable="true"></Column>
                    <Column field="outgoing" header="Outgoing" :sortable="true"></Column>
                    <Column field="adjusted" header="Adjusted" :sortable="true"></Column>
                    <Column field="ending" header="Ending" :sortable="true"></Column>
                </DataTable>
            </div>
        </div>
    </div>
    <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
</template>

<script>
    import { mapGetters } from 'vuex';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';

    export default{
        components:{
            RetryField
        },
        data(){
            return {
                mySelected: [],
                row: 10,

                fromDate: null,
                toDate: null,

                toLoad: null,
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
            })
            
        },
        methods:{
            onFromDateSelect(){
                if(this.toDate && TimeConvert.convertToMs(this.toDate) >= TimeConvert.convertToMs(this.fromDate)){
                    this.toLoad = async ()=>{
                        await this.$store.dispatch("stockedDetailReport/onfetchedStockedList", {
                            from_date: this.fromDate,
                            to_date: this.toDate
                        })
                    }
                }
            },
            onToDateSelect(){
                if(this.fromDate && TimeConvert.convertToMs(this.toDate)>= TimeConvert.convertToMs(this.fromDate)){
                    this.toLoad = async ()=>{
                        await this.$store.dispatch("stockedDetailReport/onfetchedStockedList", {
                            from_date: this.fromDate,
                            to_date: this.toDate
                        })
                    }
                }
            }
        }
    }
</script>