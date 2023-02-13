<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Stock Detail Report</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-4 sm:col-12">
                        <label>Filtered</label>
                        <v-select v-model="selectedFiltered" :options="[]" placeholder="Search by product id" 
                        :close-on-select="true" :multiple="true" :taggable="true" :chips="true" 
                        :clearable="true" loader-height="0" :menu-props="menuProps" :dropdown-should-open="tmp => false"
                        @option:selected="onSelected" @option:deselecting="onDeselecting"
                        >
                        <template v-slot:no-options>
                            <div></div>
                        </template>

                        <template #open-indicator>
                            <div></div>
                        </template>
                    </v-select>
                    </div>
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

                <DataTable :value="getStockedList" ref="dt" class="p-datatable-sm" dataKey="product_id"
                    :rowHover="true" fiterDisplay="menu" responsiveLayout="scroll" v-model:rows="row"
                    :rowsPerPageOptions="[10, 20, 30]" v-model:selection="mySelected" :paginator="true"
                    @page="onPage($event)" selectionMode="single"
                >
                    <template #header>
                        <div style="text-align: left">
                            <Button icon="pi pi-external-link" label="Export" @click="exportStock($event)" />
                        </div>
                    </template>
                    <template #empty>
                        <p>No StockDetail Report found. Please select dates to fetch.</p>
                    </template>
                    <Column selectionMode="single"></Column>

                    <Column field="product_id" header="Product Id" exportHeader="Product Id" exportFooter="Product Id" :sortable="true" style="min-width:15rem"></Column>
                    <Column field="product_name" header="Product Name" exportHeader="Product Name" exportFooter="Product Name" :sortable="true" style="min-width:15rem"></Column>
                    <Column field="sku" header="Internal Reference" exportHeader="Internal Reference" exportFooter="Internal Reference" :sortable="true" style="min-width:10rem"></Column>
                    <Column field="beginning" header="Beginning" exportHeader="Beginning" exportFooter="Beginning" :sortable="true"></Column>
                    <Column field="incoming" header="Incoming" exportHeader="Incoming" exportFooter="Incoming" :sortable="true"></Column>
                    <Column field="outgoing" header="Outgoing" exportHeader="Outgoing" exportFooter="Outgoing" :sortable="true"></Column>
                    <Column field="adjusted" header="Adjusted" exportHeader="Adjusted" exportFooter="Adjusted" :sortable="true"></Column>
                    <Column field="ending" header="Ending" exportHeader="Ending" exportFooter="Ending" :sortable="true"></Column>
                </DataTable>
            </div>
        </div>
    </div>

    <ProductDialogMoveLines v-model="showProductMoveLine" :productId="productId"></ProductDialogMoveLines>
    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToast"></RetryField>
    <HiddenRetryField :toLoad="toLoadHidden" :message="messageHidden" :errorToast="errorToastHidden"></HiddenRetryField>
</template>

<style scoped>
    #vs1__listbox{
        display: none !important;
    }
</style>

<script>
    import { mapGetters } from 'vuex';
    import HiddenRetryField from '../../components/prompt_field/HiddenRetryField.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';
    import ProductDialogMoveLines from './components/ProductDialogMoveLines.vue';
    
    export default{
        unmounted(){
            this.$store.dispatch("stockedDetailReport/clearSockDetailReport")
        },
        components:{
            RetryField,
            HiddenRetryField,
            ProductDialogMoveLines,
        },
        data(){
            return {
                menuProps:{
                    closeOnClick: true,
                    closeOnContentClick: false,
                    disableKeys: true,
                    openOnClick: false,
                    maxHeight: 0
                },

                mySelected: null,
                row: 10,

                fromDate: null,
                toDate: null,
                outOfFetch: 3,
                offset: 0,

                toLoadHidden: null,

                showProductMoveLine: false,
                productId: null,

                selectedFiltered: null,

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
                if ((event.page + 1) == event.pageCount && this.outOfFetch!=0 && this.validate()) {
                    await this.loadData()
                }
            },

            async loadData(){
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
            },
            exportStock() {
                this.$refs.dt.exportCSV();
            },

            onSelected(value){
                if(this.validate()){
                    this.offset=0
                    this.toLoadRetry= async()=>{
                        await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList",{
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: this.row*2,
                            offset:0,
                            listFilter: value
                        })
                    }
                }
            },

            onDeselecting(value){
                if(this.validate()){
                    this.offset=0
                    this.toLoadRetry= async()=>{
                        await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList",{
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: this.row*2,
                            offset:0,
                            listFilter: value
                        })
                    }
                }            
            },
        },
        watch:{
            mySelected(newValue){
                this.productId = newValue.product_id
                this.showProductMoveLine = newValue!=null
            },
            row:{
                immediate: true,
                handler: async function(){
                    if(this.validate()){
                        this.outOfFetch = 3
                        await this.loadData()
                    }
                }
            }
        }
    }
</script>