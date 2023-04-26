<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Products</h5>
                <div class="flex flex-column md:flex-row gap-1">
                    <Button label="Create" class="p-button-success mr-2 fixedWidthButton" @click="goToCreateProduct"/>
                    <label for="myImport" class="mr-2 myFileImport">
                        <span>Import File</span>
                    </label>
                    <input id="myImport" type="File" accept=".xlsl, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" title=" " @change="onPickFile">
                    <a href="/files/product_template.xlsx" download="product_template.xlsx">
                        <Button class="mr-2" label="Download Template" severity="help">Download Template</Button>
                    </a> 
                    <Button v-if="errorProductList.length>0" severity="danger" @click="onSwitchErrorDialog" label="Show Error Products"></Button>
                </div>
                <p></p>
                <DataTable 
                    :value="dataList" 
                    :paginator="true" 
                    class="p-datatable-sm" 
                    :rows="rows" 
                    dataKey="tmpId"
                    :rowHover="true" 
                    filterDisplay="menu" 
                    responsiveLayout="scroll"
                    :rowsPerPageOptions="[10, 20, 30]" 
                    v-model:filters="filters" 
                    @page="onPage"
                >
                <template #empty>
                    <p>Empty...</p>
                </template>
                    <template #header>
                        <div class="flex flex-row-reverse">
                            <Button @click="onSearch" label="Search"></Button>
                        </div>
                        <div class="p-fluid formgrid grid">
                            <slot name="filter" :searchProduct="(id)=>SearchProduct(pageNumber, id)"></slot>
                            <div class="field col-12 md:col-4 lg:col-3">
                                <label for="productId">Product Id</label>
                                <Chips id="productid" type="text" v-model="productId" placeholder="Search By Id"></Chips>
                            </div>
                        </div>
                    </template>
                    <Column field="barcode" header="Barcode" style="min-width:15rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <LinkParagraph :data="data.barcode" @pushing="navigateToDetail(data.product_id)" :myClass="{ shake: activateOrNot(data.product_name) }"></LinkParagraph>
                        </template>
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label"
                                optionValue="value" @input="filterCallback()" />
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By Barcode" />
                        </template> -->
                    </Column>
                    <Column field="sku" header="Internal Reference" style="min-width:12rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.sku }}</p>
                        </template>
                        
                        <template #filter>
                            <Chips id="productReference" type="text" v-model="productReference" placeholder="Search By Reference"></Chips>
                        </template>

                        <template #filterclear>
                            <Button type="button" label="Clear" @click="onClearProductRefernceFilter()" severity="secondary" outlined></Button>
                        </template>
                        <template #filterapply>
                            <Button type="button" label="Apply" @click="onSearch()" severity="success"></Button>
                        </template>
                    </Column>
                    <Column field="product_name" style="min-width:15rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.product_name }}</p>
                        </template>
                         
                        <template #header>
                            <div class="flex formgrid grid grid-nogutter align-items-center justify-content-center" style="width:100%">
                                <div class="col-11">
                                    <p>&nbsp;Product Name</p>
                                </div>
                                <div class="col-1">
                                    <SortButton v-model="mySort.product_name" name="product_name"
                                    @onClick="onClickSortType"
                                    ></SortButton>
                                </div>
                            </div>  
                        </template>

                        <template #filter>
                            <!-- <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label"
                                optionValue="value" @input="filterCallback()" /> -->
                            <InputText type="text" v-model="myFilter.product_name"
                                class="p-column-filter mt-3" placeholder="Search By Name"/>
                        </template>

                        <template #filterclear>
                            <Button type="button" label="Clear" @click="onClearProductNameFilter" severity="secondary" outlined></Button>
                        </template>
                        <template #filterapply>
                            <Button type="button" label="Apply" @click="onSearch" severity="success"></Button>
                        </template>
                    </Column>
                    <Column field="upc" header="UPC" style="min-width:12rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.upc }}</p>
                        </template>
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By UPC"/>
                        </template> -->
                    </Column>
                    <Column field="category_name" header="Product Category" style="min-width:12rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.category_name }}</p>
                        </template>

                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By Product Category"/>
                        </template> -->
                    </Column>
                    <Column field="on_hands" style="min-width:9rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #header>
                            <div class="flex formgrid grid grid-nogutter align-items-center justify-content-center" style="width:100%">
                                <div class="col-10">
                                    <p>&nbsp;On Hands</p>
                                </div>
                                <div class="col-2">
                                    <SortButton v-model="mySort.on_hands" name="on_hands"
                                    @onClick="onClickSortType"
                                    ></SortButton>
                                </div>
                            </div>
                        </template>

                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.on_hands }}</p>
                        </template>
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By On Hands"/>
                        </template> -->
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="errorDialog" header="Unsuccessful Products" modal :closable="true" style="width: 75vh;">
        <DataTable :value="errorProductList" :paginator="true" class="p-datatable-sm" dataKey="id"
        v-model:rows="myErrorRow" responsiveLayout="scroll" :rowsPerPageOptions="[10,20,30]"
        >
            <Column field="name" header="Product Name"></Column>
            <Column field="category_name" header="Category"></Column>
            <Column field="sku" header="Product Reference"></Column>
            <Column field="reason" header="Reason"></Column>
        </DataTable>
    </Dialog>

    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingProduct"></RetryField>
    <slot name="additionalWidget" :onMassCreateProducts="onMassCreateProducts"></slot>
</template>
<style scoped>
     .fixedWidthButton{
        width: 8rem;
    }

    input[type="file"]{
        display: none;
    }

    .myFileImport{
        display: inline-block;
        cursor: pointer;
        width: 8rem;
        border: 1px solid grey;
        text-align: center;
        align-items: center;
        border-radius: 3px;
        padding: 7px 14px;
        background-color: grey;
    }

    .myFileImport span{
        display: inline-block;
        vertical-align: top;
        color: white;
        font-weight: normal;
        font-size: -apple--system , BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
</style>
<script>
    import router from '../../../router';
    import RetryField from "../../../components/prompt_field/RetryField.vue"
    import { FilterMatchMode } from "primevue/api";
    import { mapGetters } from 'vuex';
    import LinkParagraph from '../../../components/LinkParagraph.vue';
    import { roleGroupId, sheetId } from '../../../domains/domain';
    import SortButton from '../../../components/sortButton.vue';
    import { read } from 'xlsx';


    export default {
        async created() {
            this.toLoadRetry = this.initData
        },
        components: {
            RetryField,
            LinkParagraph,
            SortButton
        },
        props:{
            onInit: Function,
            userId: String || null,
            goToCreateProduct: Function,
            myRows: Number,
            createMassProductUserId: String || null,
        },
        emits:["update:myRows", "onPickedFile"],
        data() {
            return {
                myFilter:{
                    product_name: null,
                },

                mySort:{
                    product_name: null,
                    on_hands: null
                },
                myErrorRow: 10,

                productV2: null,
                productDialog: false,
                disabled: false,
                dataList: [],
                filters: {
                    product_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                    barcode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                    sku:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                    upc:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                    category_name:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                    on_hands:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                },
                customFilter: [
                    { label: "Starts with", value: FilterMatchMode.STARTS_WITH },
                    { label: "Contains", value: FilterMatchMode.CONTAINS },
                    { label: "Equals", value: FilterMatchMode.EQUALS },
                ],
                toLoadRetry: null,
                message: {
                    failed: "Error Loading Data. Try again?",
                    yesButton: "Yes",
                    noButton: "No",
                },
                errorToastDeletingProduct: {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Deleting Product!"
                },

                myPageTracker: 0,

                productId: [],
                productReference: [],
                errorProductList: [],

                archivedProduct: 0,

                errorDialog: false,
            }
        },
        computed: {
            ...mapGetters({
                getProductLength: "products/getProductLength",
                getAllSkus: "products/getAllSkus"
            }),

            getProductCategories(){
                const prodCategories = this.$store.getters["products/prodCategories"].filter((e)=>e.user_id == (this.userId ?? e.user_id));
                return prodCategories;
            },

            products() {
                return this.$store.getters['products/getProductState'];
            },

            rows:{
                get(){
                    return this.myRows;
                },

                set(newValue){
                    this.$emit("update:myRows", newValue);
                }
            }
        },
        
        methods: {
            async onPickFile(event){
                if(event.target.files[0]){
                    const file = event.target.files[0];
                    const data = await file.arrayBuffer();
                    const rows = read(data);
                    // SheetNames: ["rise"]
                    // Sheets: {
                        // rise: {
                            // margin:
                            // A1: 
                            // A2:
                        // }    
                    // }
                    const sheetData = rows?.Sheets[rows.SheetNames?.[0] ?? 0];
                    delete sheetData["!margins"];
                    delete sheetData["!ref"];

                    // Look for the start of the header
                    // A1, B1, C1, etc. is only effective if the letter 
                    // is only one digit. 
                    // TODO: If it has two digit we need to refactor this.
                    // possibly ^\w{1,2}1$
                    const headerRegex = new RegExp(`^.1$`);

                    // This algorithm depends on the fact that there's
                    // a header per column
                    const result = [];
                    // The position of the list, -1 because we ignore header
                    // otherwise, we will skip the first element
                    let index=-1;

                    // Start from 2 because the header is in column 1;
                    let oldIndicator = 0;
                    for(let columnCharacter in sheetData){
                        let indicator = columnCharacter?.substring(1, columnCharacter.length);
                        let characterColumn = columnCharacter[0];

                        // Skip the header or the row with 1 number
                        if(headerRegex.test(columnCharacter)){
                            oldIndicator = indicator;
                            continue;
                        }                   

                        // If the old indicator isn't equal to the new one
                        // It means that we're moving into a new row
                        // which mean a different product
                        if(oldIndicator!=indicator){
                            oldIndicator=indicator;
                            result.push({});
                            index++;
                        }
                        // Convert the characterColumn to their designated
                        // product field or product jsonKey
                        const productFieldKey = sheetId[characterColumn];

                        result[index][productFieldKey] = sheetData?.[columnCharacter]?.h?.trim?.() ?? sheetData?.[columnCharacter]?.v?.trim?.();
                    }
                    
                    this.$emit("onPickedFile", result, this.onMassCreateProducts);
                }
            },

            onMassCreateProducts(myMassProducts){
                this.toLoadRetry = async () => {
                    await this.$store.dispatch("products/getProdCategories",{
                        userId: this.createMassProductUserId,
                        offset: 0,
                        limit: 1000000,
                    });
                    this.$store.dispatch("products/getTotalSku");

                    for(let i=0; i<myMassProducts.length-1; i++){
                        try{
                            myMassProducts[i].categoryId = await this.categoryExist(myMassProducts[i]?.category_name);
                            const skuNotExist = this.skuNotExist(myMassProducts[i]);
                            const validated = this.validateProduct(myMassProducts[i]);

                            if(skuNotExist && validated){
                                await this.$store.dispatch("products/addProduct", {
                                    newlyCreatedProduct: myMassProducts[i],
                                    userId: this.createMassProductUserId,
                                });
                            }
                        }catch(e){
                            console.log(e);
                            this.errorProductList.push({...myMassProducts[i], reason: "Unknown"});
                        }
                    }

                    if(this.errorProductList.length){
                        this.$toast.add({severity: "error", summary: "Failed", detail:"Some Products Failed to create", life: 2000});
                        this.onSwitchErrorDialog();
                    }

                    this.clearValueImport();
                };
            },

            clearValueImport(){
                // Clear value of importing, otherwise it won't react to the same previous file
                document.getElementById('myImport').value = ''
            },

            async categoryExist(categoryName){
                if(categoryName){
                    const haveCategory = this.getProductCategories.findIndex((e)=>{
                        return (e?.category_name ?? "").toLowerCase().trim() == (categoryName ?? "").toLowerCase().trim();
                    });

                    if(haveCategory<0){
                        const addProdCat = {
                            category_name: categoryName,
                            user_id: this.createMassProductUserId
                        };
                        const newCat = await this.$store.dispatch("products/addProductCategory", addProdCat);
                        return newCat.id;
                    }

                    return this.getProductCategories[haveCategory].id;
                }
                return null;
            },

            validateProduct(product){
                const productNameValid = product.name && product.name?.trim?.() != "";
                if(!productNameValid){
                    this.errorProductList.push({...product, reason: "Product Name Cannot Be Empty"});
                }

                return productNameValid;
            },  

            skuNotExist(product){
                // TODO: Rather than finding the sku by the browser, use the api
                // there's more than 5000 sku in the database
                const index = this.getAllSkus.findIndex((e)=>{
                    return (e ?? "").toLowerCase() == (product?.sku ?? "").toLowerCase();
                });
                    
                const skuNotDuplicate = index<0;

                if(skuNotDuplicate){
                    this.errorProductList.push({...product, reason: "SKU/Internal Reference Already Exists"});
                }

                // If there's no sku here
                return skuNotDuplicate;
            },

            onSwitchErrorDialog(){
                this.errorDialog = !this.errorDialog;
            },

            activateOrNot(product_name) {
                return product_name == this.$route.query.name ?? false
            },
            
            onClickSortType({sortId, name}){
                // if in the future we have multiple sorts, just removed this
                this.mySort = {};
                this.mySort[name] = sortId;

                this.toLoadRetry = async () => {
                    await this.SearchProduct(this.myPageTracker, null, name, sortId);
                }
            },

            goToNewProduct() {
                const userRole = this.$store.getters["auth/getUserRole"];
                if(userRole == roleGroupId.Admin){
                    router.push({name: "createProductAdmin"});
                }else{
                    router.push({name: "createProduct"});
                }
            },

            async initData() {
                this.onInit?.();
                await this.SearchProduct();
            },

            async SearchProduct(pageNumber, myId, sortName, sortType){
                await this.$store.dispatch("products/getProductLength",{
                    userId: myId ?? this.userId,
                    productId: this.productId,
                    productReference: this.productReference,
                    productName: this.myFilter.product_name,
                });
                this.initList();

                const products = await this.$store.dispatch("products/onFetchProducts", {
                    offset: (pageNumber || 0) * this.rows,
                    limit: this.rows,
                    userId: myId ?? this.userId,
                    productId: this.productId,
                    productReference: this.productReference,
                    productName: this.myFilter.product_name,
                    sortName: sortName,
                    mySortType: sortType
                });

                this.updateList({offset: pageNumber? pageNumber*this.rows : 0, row: this.rows, tempList: products});
            },

            async onPage(event) {
                this.myPageTracker = event.page;
                this.toLoadRetry = async ()=>{
                    const products = await this.$store.dispatch("products/onFetchProducts", {
                        offset: event.first,
                        limit: this.rows,
                        userId: this.userId,
                    })
                    const offset = event.first
                    const limit = event.rows
                    this.updateList({offset: offset, row:limit, tempList: products})
                }
            },

            initList(){
                this.dataList.length=0;
                for(let i=0; i<this.getProductLength; i++){
                    this.dataList.push({tmpId: i});
                }
            },

            updateList({offset, row, tempList}){
                let index=0
                for(let i=offset; i<row+offset; i++){
                    if(!(tempList?.[index])){
                        break
                    }
                    const myId = this.dataList[i]?.tmpId;
                    this.dataList[i]={tmpId: myId, ...tempList[index]};
                    index++
                }
            },

            onDeleteList(id){
                const index = this.dataList.findIndex((e)=>e.product_id == id)
                if(index>=0){
                    this.dataList.splice(index, 1)
                }
            },

            navigateToDetail(id){
                this.$router.push({name: "productDetail", params: {id: id}});
            },

            onSearch(){
                this.toLoadRetry = async() => {
                    await this.SearchProduct(this.myPageTracker);
                };
            },

            onClearProductRefernceFilter(){
                this.productReference = [];
                this.toLoadRetry = async() =>{
                    await this.SearchProduct(this.myPageTracker);
                }
            },

            onClearProductNameFilter(){
                this.myFilter.product_name = null;
                this.toLoadRetry = async() => {
                    await this.SearchProduct(this.myPageTracker);
                };
            },
        }
    }
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>

<style scoped>
@import '../../../assets/styles/style.css';
</style>
