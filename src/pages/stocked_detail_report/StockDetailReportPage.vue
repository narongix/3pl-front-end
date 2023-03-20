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
                    <div class="field col-12 md:col-4">
                        <label>Product Filters</label>
                        <Dropdown :options="ProductListFilter" v-model="productFilter" @change="onSelectDate"
                        class="p-column-filter" placeholder="Search by status" optionLabel="title" optionValue="code"
                        >
                        </Dropdown>
                    </div>
                </div>

                <DataTable :value="dataList" ref="dt" class="p-datatable-sm" dataKey="product_id"
                    :rowHover="true" fiterDisplay="menu" responsiveLayout="scroll" v-model:rows="row"
                    :rowsPerPageOptions="[10, 20, 30]" v-model:selection="mySelected" :paginator="true"
                    @page="onPage($event)" selectionMode="single" :metaKeySelection="false">
                    <template #header>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-2">
                                <Button icon="pi pi-external-link" label="Export" @click="exportStock($event)" />
                            </div>
                            <div class="field col-12 md:col-2">
                                <Button label="Previous Month" @click="goBackByOneMonth"></Button>
                            </div>
                            <div class="field col-12 md:col-2">
                                <Button label="Next Month" @click="goForwardByOneMonth"></Button>
                            </div>

                            <div class="field col-12 md:col-2">
                                <Button label="This Month" @click="goToThisMonth"></Button>
                            </div>
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
                                    :maxLength="getProductCurrentLength"
                                    :displayOption ="myOption=>myOption.barcode"
                                    v-model:offset="myFilterOffset" 
                                    :limit="10"
                                    @onChange="onSelected"
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
                                    :maxLength="getProductCurrentLength"
                                    :displayOption ="myOption=>myOption.product_name"
                                    v-model:offset="myFilterOffset"
                                    :limit="10"
                                    @onChange="onSelected">

                                </MultiSelectPagination>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <p>No StockDetail Report found. Please select dates to fetch.</p>
                    </template>
                    <Column selectionMode="single"></Column>
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

    <ProductDialogMoveLines v-model="showProductMoveLine" :productId="productId"></ProductDialogMoveLines>
    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToast"></RetryField>
    <HiddenRetryField :toLoad="toLoadHidden" :message="messageHidden" :errorToast="errorToastHidden"></HiddenRetryField>
</template>

<style scoped>
    #vs1__listbox{
        display: none !important;
    }
    .p-multiselect-header{
        display: none !important;
    }
</style>

<script>
    import { mapGetters } from 'vuex';
    import HiddenRetryField from '../../components/prompt_field/HiddenRetryField.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import MultiSelectPagination from './components/MultiSelectPagination.vue';
    import ProductDialogMoveLines from './components/ProductDialogMoveLines.vue';
    import TimeConvert from '../../components/utils/TimeConvert';

    export default{
        unmounted(){
            this.$store.dispatch("stockedDetailReport/clearSockDetailReport")
        },
        async created(){
            this.toLoadRetry = async()=>{
                await this.$store.dispatch("products/onFetchProducts",{
                    offset: 0,
                    limit: 10
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
                myFilterOffset: 10,
                myFilters:{
                    myBarcode: [],
                    myProductSku: [],
                },
                
                dataList: [],
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
                },

                productFilter: 0,
                productMaxLength: 0,
            }
        },
        computed:{
            ...mapGetters({
                getStockedList: "stockedDetailReport/getStockedList",
                getProducts: "products/getProductState",
                // getProductMaxLength: "products/getProductLength"
            }),

            getCalendarFormat(){
                return TimeConvert.getCalendarFormat();
            },

            getProductCurrentLength(){
                return this.getProducts.length;
            },

            ProductListFilter(){
                return [
                    {title: "Active products", code: 1}, 
                    {title: "All Products", code: 0}
                ];
            }
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
                this.toLoadRetry = async()=>{
                    const stockReport = await this.$store.dispatch("stockedDetailReport/onfetchAndUpdateStockedList", {
                        from_date: this.fromDate,
                        to_date: this.toDate,
                        limit: this.row,
                        offset: event.first,
                        barcodes:this.myFilters.myBarcode,
                        sku: this.myFilters.myProductSku,
                        activeProduct: this.productFilter
                    })
                 
                    const offset= event.first
                    const limit = event.rows    
                    this.updateList({offset: offset, row:limit, tempList: stockReport})   
                }
            },
            
            async onSelectDate(){
                if(this.validate()){
                    this.toLoadRetry = async()=>{
                        const stockList = await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList", {
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: 100,
                            offset:0,
                            barcodes:this.myFilters.myBarcode,
                            sku: this.myFilters.myProductSku,
                            activeProduct: this.productFilter
                        })

                        this.productMaxLength = await this.$store.dispatch("stockedDetailReport/onFetchStockReportTotal", {
                            activeProduct: this.productFilter,
                            sku: this.myFilters.myProductSku,
                            barcodes:this.myFilters.myBarcode,
                            from_date: this.fromDate,
                            to_date: this.toDate,
                        });
                        
                        this.initingOrigList();
                        this.updateList({
                            offset: 0,
                            row: this.row,
                            tempList: stockList
                        });
                    }
                    this.offset = this.row*2;
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
                    this.toLoadRetry= async()=>{
                        const stockList = await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList",{
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: this.row,
                            offset:0,
                            listFilter: value,
                            barcodes:this.myFilters.myBarcode,
                            sku: this.myFilters.myProductSku,
                            activeProduct: this.productFilter?.code
                        })
                        if(this.myFilters.myBarcode.length==0 && this.myFilters.myProductSku.length==0){
                            this.initingOrigList()
                           return this.updateList({offset: 0, row: this.row, tempList: stockList})
                        }
                        this.initingFilteredList(stockList)
                    }
                }
            },

            initingFilteredList(myList){
                this.dataList.length=myList.length
                for(let i=0;i<myList.length;i++){
                    this.dataList[i] = myList[i]
                }
            },

            initingOrigList(){
                this.dataList.length=0;
                for(let i=0; i<this.productMaxLength; i++){
                    this.dataList.push({product_id: i.toString()})
                }
            },

            updateList({offset, row, tempList}){
                let index=0;
                for(let i=offset; i<row+offset; i++){
                    if(!(tempList?.[index])){
                        break;
                    }
                    this.dataList[i]={temp_id: this.dataList?.[i]?.temp_id,...tempList[index]}
                    index++
                }
            },

            goBackByOneMonth(){
                const currentDate = this.fromDate || new Date();
                currentDate.setMonth(currentDate.getMonth()-1)
                const lastDay = TimeConvert.getLastDayOfMonth(currentDate.getMonth(), this.fromDate?.getYear());

                this.setDate({
                    month: currentDate.getMonth(),
                    firstDay: 1,
                    lastDay: lastDay,
                    year: currentDate.getFullYear()
                });
            },
            
            goForwardByOneMonth(){
                // The reason we separate it into 2 variables are to calculate whether 
                // we should set it to the current month or the next month
                const currentDay = new Date();
                const year = this.fromDate?.getFullYear() || currentDay.getFullYear();
                // +1 to get the next month so we can calculate the last day of the next month
                // Null safety doesn't cover NAN, || does
                const userMonth = this.fromDate?.getMonth()+1 || currentDay.getMonth();
                const lastDay = TimeConvert.getLastDayOfMonth(userMonth, year);

                this.setDate({
                    month: userMonth,
                    firstDay: 1,
                    lastDay: lastDay,
                    year: year
                });
            },
            
            goToThisMonth(){
                const currentDay = new Date();
                const lastDay = TimeConvert.getLastDayOfMonth(currentDay.getMonth(), currentDay.getFullYear());

                this.setDate({
                    month: currentDay.getMonth(),
                    firstDay: 1,
                    lastDay: lastDay,
                    year: currentDay.getFullYear()
                });
            },

            setDate({month, firstDay, lastDay, year}){
                this.fromDate = new Date(year, month, firstDay);
                this.toDate = new Date(year, month, lastDay);
                this.onSelectDate();
            },
        },
        watch:{
            mySelected(newValue){
                this.productId = newValue?.product_id
                this.showProductMoveLine = newValue!=null
            },
            showProductMoveLine(newValue){
                if(!newValue){
                    this.mySelected=null
                }
            }
        }
    }
</script>