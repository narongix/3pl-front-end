<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Stock Detail Report</h5>
                <div class="p-fluid formgrid grid">
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
                    <div class="md:col-4"></div>
                </div>

                <DataTable :value="getStockedList" ref="dt" class="p-datatable-sm" dataKey="barcode"
                    :rowHover="true" filterDisplay="row" responsiveLayout="scroll" v-model:rows="row"
                    :rowsPerPageOptions="[10, 20, 30]" v-model:selection="mySelected" :paginator="true"
                    @page="onPage($event)" selectionMode="single" :metaKeySelection="false">
                    <template #header>
                        <div style="text-align: left">
                            <Button icon="pi pi-external-link" label="Export" @click="exportStock($event)" />
                        </div>
                        <p></p>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-6 md:col-6 sm:col-6">
                                <label>Barcode</label>
                                <MultiSelectPagination 
                                    v-model="myFilters.myBarcode"
                                    :options="getProducts"
                                    optionLabel="barcode"
                                    optionValue="barcode"
                                    display="chip" 
                                    placeholder="Filter by Barcode"
                                    :whenLoad="whenLoadProduct"
                                    :whenSearch="whenSearchProduct"
                                    :maxLength="getProductLength"
                                    :displayOption ="myOption=>myOption.barcode"
                                    :v-model:offset="myFilterOffset" 
                                    @onChange="onSelectDate"
                                >

                                </MultiSelectPagination>
                            </div>
                            <div class="field col-6 md:col-6 sm:col-6">
                                <label>Product Name</label>

                                <MultiSelectPagination 
                                    v-model="myFilters.myProductSku"
                                    :options="getProducts"
                                    optionLabel="product_name"
                                    optionValue="sku"
                                    display="chip" 
                                    placeholder="Filter by product name"
                                    :whenLoad="whenLoadProduct"
                                    :whenSearch="whenSearchProduct"
                                    :maxLength="getProductLength"
                                    :displayOption ="myOption=>myOption.product_name"
                                    :v-model:offset="myFilterOffset" 
                                    @onChange="onSelectDate">

                                </MultiSelectPagination>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <p>No StockDetail Report found. Please select dates to fetch.</p>
                    </template>
                    <Column selectionMode="single"></Column>
                    <Column field="product_id" header="Product Id" exportHeader="Product Id" exportFooter="Product Id" :sortable="true" style="min-width:15rem"></Column>
                    <Column field="product_name" header="Product Name" exportHeader="Product Name" 
                    exportFooter="Product Name" :sortable="true" style="min-width:15rem" 
                    :showFilterMatchModes="false">
                    </Column>
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

    <ProductDialogMoveLines v-model="showProductMoveLine" :barcode="productId"></ProductDialogMoveLines>
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
    import MultiSelectPagination from './components/MultiSelectPagination.vue';
    import ProductDialogMoveLines from './components/ProductDialogMoveLines.vue';

    export default{
        unmounted(){
            this.$store.dispatch("stockedDetailReport/clearSockDetailReport")
        },
        async created(){
            this.toLoadRetry = async()=>{
                await this.$store.dispatch("products/onFetchProducts",{
                    offset: 0,
                    limit: 15
                })
            }
        },
        components:{
            RetryField,
            HiddenRetryField,
            ProductDialogMoveLines,
            MultiSelectPagination
        },
        data(){
            return {
                // filters:{
                //     barcode: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
                //     product_name: {operator: FilterOperator.AND, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                // },
                myFilterOffset: 0,
                myFilters:{
                    myBarcode: [],
                    myProductSku: [],
                },
                
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
                getStockedList: "stockedDetailReport/getStockedList",
                getProducts: "products/getProductState",
            }),

            getCalendarFormat(){
                return TimeConvert.getCalendarFormat()
            },

            getProductLength(){
                return this.getProducts.length
            },
        },
        methods:{
            async whenSearchProduct(filterValue){
                const products = await this.$store.dispatch("products/onFetchProducts",{
                    offset: 0,
                    limit: 30,
                    productName: filterValue
                })
                return products.length
            },

            async whenLoadProduct(offset){
               const products = await this.$store.dispatch("products/onFetchProducts",{
                    offset:offset,
                })
                return products.length
            },

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
                        offset: this.offset,
                        barcodes:this.myFilters.myBarcode,
                        sku: this.myFilters.myProductSku
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
                            offset:0,
                            barcodes:this.myFilters.myBarcode,
                            sku: this.myFilters.myProductSku
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
                this.productId = newValue?.barcode
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
            },
            showProductMoveLine(newValue){
                if(!newValue){
                    this.mySelected=null
                }
            }
        }
    }
</script>