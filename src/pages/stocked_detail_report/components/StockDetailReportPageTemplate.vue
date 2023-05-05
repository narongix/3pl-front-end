<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Stock Detail Report</h5>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-3 sm:col-12" >
                        <FromDate v-model="fromDate" :rows="rows" @onSelectDate="onSelectDate({limit: $event})"></FromDate>
                    </div>
                    
                    <div class="field col-12 md:col-3 sm:col-12">
                        <ToDate v-model="toDate" :rows="rows" @onSelectDate="onSelectDate({limit: $event})"></ToDate>
                    </div>
                    <div class="field col-12 md:col-3">
                        <label>Product Filters</label>
                        <Dropdown :options="ProductListFilter" v-model="productFilter" @change="onSelectDate({limit: rows})"
                        class="p-column-filter" placeholder="Search by status" optionLabel="title" optionValue="code"
                        >
                        </Dropdown>
                    </div>
                    <slot name="body">

                    </slot>
                </div>

                <DataTable :value="dataList" ref="dt" class="p-datatable-sm" dataKey="tmpId"
                    :rowHover="true" fiterDisplay="menu" responsiveLayout="scroll" v-model:rows="rows"
                    :rowsPerPageOptions="[10, 20, 30]" v-model:selection="mySelected" :paginator="true"
                    @page="onPage($event)" selectionMode="single" :metaKeySelection="false">
                    <template #header>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-2 xl:col-1 smallerButton">
                                <Button icon="pi pi-external-link" size="small" class="" label="Export" @click="exportStock($event)" text/>
                            </div>

                            <div class="field col-12 md:col-3 lg:col-2 xl:col-1 myMinWidth">
                                <Button label="This Month" size="small" class="smallerButton" @click="goToThisMonth"></Button>
                            </div>

                            <div class="field col-12 md:col-3 lg:col-2 xl:col-1 myMinWidth">
                                <Button label="Previous Month" size="small" class="smallerButton" @click="goBackByOneMonth"></Button>
                            </div>
                        </div>
                        <p></p>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-6">
                                <label>Product</label>
                                <MultiSelectPagination 
                                    v-model="myFilters.myProductSku"
                                    :options="getProducts"
                                    optionLabel="search_key"
                                    optionValue="sku"
                                    display="chip" 
                                    placeholder="Filter by sku or name"
                                    :whenLoad="whenLoadProduct"
                                    :whenSearch="whenSearchProduct"
                                    :maxLength="getProductCurrentLength"
                                    :displayOption ="myOption=>myOption.search_key"
                                    v-model:offset="myFilterOffset" 
                                    :limit="10"
                                    @onChange="onSelected"
                                >

                                </MultiSelectPagination>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <p>No StockDetail Report found. Please select dates to fetch.</p>
                    </template>
                    <Column selectionMode="single"></Column>
                    <Column field="product_name" header="Product Name" exportHeader="Product Name" 
                    exportFooter="Product Name" :sortable="false" style="min-width:15rem" 
                    :showFilterMatchModes="false">
                    </Column>
                    <Column field="sku" header="Internal Reference" exportHeader="Internal Reference" exportFooter="Internal Reference" :sortable="false" style="min-width:10rem"></Column>
                    <Column field="beginning" header="Beginning" exportHeader="Beginning" exportFooter="Beginning" :sortable="false"></Column>
                    <Column field="incoming" header="Incoming" exportHeader="Incoming" exportFooter="Incoming" :sortable="false"></Column>
                    <Column field="outgoing" header="Outgoing" exportHeader="Outgoing" exportFooter="Outgoing" :sortable="false"></Column>
                    <Column field="adjusted" header="Adjusted" exportHeader="Adjusted" exportFooter="Adjusted" :sortable="false"></Column>
                    <Column field="ending" header="Ending" exportHeader="Ending" exportFooter="Ending" :sortable="false"></Column>
                </DataTable>
            </div>
        </div>
    </div>

    <ProductDialogMoveLines v-model="showProductMoveLine" :productId="productId" :userId="userId" :fromDate="fromDate" :toDate="toDate"></ProductDialogMoveLines>
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
    .myMinWidth{
        min-width:150px
    }
</style>

<script>
    import { mapGetters } from 'vuex';
    import HiddenRetryField from '../../../components/prompt_field/HiddenRetryField.vue';
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import MultiSelectPagination from './MultiSelectPagination.vue';
    import ProductDialogMoveLines from './ProductDialogMoveLines.vue';
    import TimeConvert from '../../../components/utils/TimeConvert';
    import FromDate from '../../../components/FromDate.vue';
    import ToDate from '../../../components/ToDate.vue';

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
        props:{
            onValidate: Function,
            userId: String,
            myRows: Number,
        },
        emits: ["update:myRows"],
        components:{
            RetryField,
            HiddenRetryField,
            ProductDialogMoveLines,
            MultiSelectPagination,
            FromDate,
            ToDate
        },
        data(){
            return {
                myFilterOffset: 0,
                myFilters:{
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
                // row: 10,

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
                myPageTracker: 0
            }
        },
        computed:{
            ...mapGetters({
                getStockedList: "stockedDetailReport/getStockedList",
            }), 

            getProducts(){
                return this.$store.getters["products/getProductState"].filter((e) => e.user_id == this.userId);
            },

            rows: {
                get(){
                    return this.myRows;
                },
                set(newValue){
                    this.$emit("update:myRows", newValue);
                }
            },

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
                    searchKey: filterValue,
                    userId: this.userId,
                })
                return products.length
            },

            async whenLoadProduct(offset){
               const products = await this.$store.dispatch("products/onFetchProducts",{
                    offset:offset,
                    userId: this.userId
                })
                return products.length
            },

            async onPage(event){
                this.toLoadRetry = async()=>{
                    const stockReport = await this.$store.dispatch("stockedDetailReport/onfetchAndUpdateStockedList", {
                        from_date: this.fromDate,
                        to_date: this.toDate,
                        limit: this.rows,
                        offset: event.first,
                        sku: this.myFilters.myProductSku,
                        activeProduct: this.productFilter,
                        userId: this.userId
                    })
                 
                    const offset= event.first
                    const limit = event.rows    
                    this.updateList({start: offset, end:limit, tempList: stockReport})   
                }
            },
            
            async onSelectDate(query){
                if(this.validate()){
                    const pageNumber = query?.pageNumber ?? 0; 
                    this.toLoadRetry = async()=>{
                        this.productMaxLength = await this.$store.dispatch("stockedDetailReport/onFetchStockReportTotal", {
                            activeProduct: this.productFilter,
                            sku: this.myFilters.myProductSku,
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            userId: this.userId
                        });
                        this.initingOrigList();
                        const stockList = await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList", {
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: query?.limit ?? this.rows,
                            offset: (pageNumber || 0) * this.rows,
                            sku: this.myFilters.myProductSku,
                            activeProduct: this.productFilter,
                            userId: this.userId
                        })

                        this.updateList({
                            start: (pageNumber || 0) * this.rows,
                            end: query?.limit ?? this.rows,
                            tempList: stockList
                        });

                        await query.addtionalCommand?.();
                    }
                    this.offset = this.rows*2;
                }
            },

            validate(){
                // If the ToDate is smaller than fromDate
                const correctDate = TimeConvert.convertToMs(this.toDate) >= TimeConvert.convertToMs(this.fromDate);
                const isValidate = this.onValidate({toDate: this.toDate, fromDate: this.fromDate, correctDate: correctDate,})
                // const isValidate = this.toDate && this.fromDate && correctDate
                return isValidate
            },

            exportStock() {
                if(this.validate()){
                    this.toLoadRetry = async () => {
                        await this.onSelectDate({limit: 100000000000000, addtionalCommand: ()=>{
                            this.$refs.dt.exportCSV();
                        }});
                    };
                }
            },

            onSelected(value){
                if(this.validate()){
                    this.toLoadRetry= async()=>{
                        const stockList = await this.$store.dispatch("stockedDetailReport/onfetchedAndReplaceStockedList",{
                            from_date: this.fromDate,
                            to_date: this.toDate,
                            limit: this.rows,
                            offset:0,
                            listFilter: value,
                            sku: this.myFilters.myProductSku,
                            activeProduct: this.productFilter?.code,
                            userId: this.userId
                        })
                        if(this.myFilters.myProductSku.length==0){
                            this.initingOrigList()
                            return this.updateList({start: 0, end: this.rows, tempList: stockList})
                        }
                        // Incase there's filter, there's no pagination for it yet, so 
                        // we arrange the datatable to fit in the exact data
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
                    this.dataList.push({tmpId: i.toString()})
                }
            },

            updateList({start, end, tempList}){
                let index=0;
                // say that its suppose to be 20-29
                // start = 20, end 20+row(10) = 30, 20 - 29 (<30)
                for(let i=start; i<end+start; i++){
                    if(!(tempList?.[index])){
                        break;
                    }
                    const myId = this.dataList[i].tmpId;
                    this.dataList[i]={tmpId: myId,...tempList[index]}
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

            // goForwardByOneMonth(){
            //     // The reason we separate it into 2 variables are to calculate whether 
            //     // we should set it to the current month or the next month
            //     const currentDay = new Date();
            //     const year = this.fromDate?.getFullYear() || currentDay.getFullYear();
            //     // +1 to get the next month so we can calculate the last day of the next month
            //     // Null safety doesn't cover NAN, || does
            //     const userMonth = this.fromDate?.getMonth()+1 || currentDay.getMonth();
            //     const lastDay = TimeConvert.getLastDayOfMonth(userMonth, year);

            //     this.setDate({
            //         month: userMonth,
            //         firstDay: 1,
            //         lastDay: lastDay,
            //         year: year
            //     });
            // },
            
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
                this.onSelectDate({limit: this.rows});
            },

            async searchStockReport(pageNumber){
                await this.onSelectDate({pageNumber: pageNumber, limit: this.rows});
            }
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
            },

            userId:{
                immediate:true,
                handler(){
                    this.myFilterOffset = 0;
                    this.toLoadRetry = async () => {
                        await this.searchStockReport(this.myPageTracker);
                    }
                }
            }
        }
    }
</script>