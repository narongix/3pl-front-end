<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Products</h5>
                <div class="flex flex-column md:flex-row gap-1">
                    <Button label="Create" class="p-button-success mr-2 fixedWidthButton" @click="goToCreateProduct"/>
                    <Button class="mr-2" label="Import File" @click="$emit('massCreateNavigation')" severity="secondary"></Button>
                    <Button v-if="getErrorProducts.length>0" severity="danger" @click="onSwitchErrorDialog" label="Show Error Products"></Button>
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
                    <Column field="barcode" header="Barcode" style="min-width:8rem" :sortable="false"
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
                    <Column field="upc" header="UPC" style="min-width:4rem" :sortable="false"
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
                    <Column field="category_name" header="Product Category" style="min-width:8rem" :sortable="false"
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
                    <Column field="volume" header="Volume">
                        <template #body="{ data }">
                            {{ convertToFourDecimal(data.volume) }}
                        </template>
                    </Column>
                    <Column field="on_hands" style="min-width:8rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #header>
                            <MyHeader header="On Hands">
                                <SortButton v-model="mySort.on_hands" name="on_hands"
                                @onClick="onClickSortType"
                                ></SortButton>
                            </MyHeader>
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
                    <Column field="total_volume" header="">
                        <template #header>
                            <MyHeader header="Total Volumes">
                                <SortButton v-model="mySort.total_volume" name="total_volume" @onClick="onClickSortType"></SortButton>
                            </MyHeader>
                        </template>
                        <template #body="{ data }">
                            {{ convertToFourDecimal(data.total_volume) }}
                        </template>
                    </Column>
                    <Column field="est_charge_per_day" header="" style="min-width:8rem;">
                        <template #header>
                            <MyHeader header="Charge Per Day">
                                <SortButton v-model="mySort.est_charge_per_day" name="est_charge_per_day" @onClick="onClickSortType"></SortButton>
                            </MyHeader>
                        </template>

                        <template #body="{ data }">
                            {{ convertToTwoDecimal(data.est_charge_per_day) }}$
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
    <ImportResultDialog v-model="errorDialog" header="Unsuccessful Products" :successList="successAmount" :errorList="getErrorProducts">
        <template #columns="mySlot">
            <Column field="product_name" header="Product Name" style="min-width: 12rem;"></Column>
            <Column field="category_name" header="Category" style="min-width:5rem"></Column>
            <Column field="sku" header="Product Reference" style="min-width:12rem"></Column>
            <Column field="status" header="Status">
                <template #body>
                    <div class="flex align-items-center justify-content-center">
                        <font-awesome-icon v-if="mySlot.errorList.length==0" :icon="['fas', 'check']" />
                        <font-awesome-icon v-else :icon="['fas', 'xmark']" />
                    </div>
                </template>
            </Column>
            
        </template>
    </ImportResultDialog>
    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingProduct"></RetryField>
</template>
<style scoped>
     .fixedWidthButton{
        width: 8rem;
    }

    .myErrorImportDialog{
        background-color: rgb(255, 236, 236);
        padding: 5px 6px;
        border-radius: 5px;
    }
</style>
<script>
    import router from '../../../router';
    import RetryField from "../../../components/prompt_field/RetryField.vue"
    import { FilterMatchMode } from "primevue/api";
    import { mapGetters } from 'vuex';
    import LinkParagraph from '../../../components/LinkParagraph.vue';
    import { roleGroupId } from '../../../domains/domain';
    import SortButton from '../../../components/sortButton.vue';
    import MyHeader from '../../../components/MyHeader.vue';
    import MyNumber from '../../../components/utils/MyNumber';
    import ImportResultDialog from '../../../components/ImportResultDialog.vue';

    export default {
        async created() {
            this.toLoadRetry = this.initData;
            this.errorProductList = JSON.parse(this.$route.query.errorList ?? null);
            if(this.errorProductList?.length){
                this.onSwitchErrorDialog();
            }
            this.successList = JSON.parse(this.$route.query.successList ?? null);
        },
        components: {
            RetryField,
            LinkParagraph,
            SortButton,
            MyHeader,
            ImportResultDialog
        },
        props:{
            onInit: Function,
            userId: String || null,
            goToCreateProduct: Function,
            myRows: Number,
            createMassProductUserId: String || null,
        },
        emits:["update:myRows", "massCreateNavigation"],
        data() {
            return {
                myFilter:{
                    product_name: null,
                },

                mySort:{
                    product_name: null,
                    on_hands: null,
                    total_volume: 2,
                },

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
                successList: [],

                archivedProduct: 0,

                errorDialog: false,
            }
        },
        computed: { 
            ...mapGetters({
                getProductLength: "products/getProductLength",
            }),

            getErrorProducts(){
                return this.errorProductList ?? [];
            },

            successAmount(){
                return this.successList ?? [];
            },

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
            convertToFourDecimal(data){
                return MyNumber.convertToFourDecimal(data);
            },

            convertToTwoDecimal(data){
                return MyNumber.convertToTwoDecimal(data);
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
                if(!name){
                    delete this.mySort[name];
                }
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
                await this.SearchProduct(null, null, "total_volume", 2);
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
                    const sortName = Object.keys(this.mySort)[0] ?? null;
                    const sortType = this.mySort[sortName];
                    const products = await this.$store.dispatch("products/onFetchProducts", {
                        offset: event.first,
                        limit: this.rows,
                        userId: this.userId,
                        productReference: this.productReference,
                        productName: this.myFilter.product_name,
                        sortName: sortName,
                        mySortType: sortType
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
