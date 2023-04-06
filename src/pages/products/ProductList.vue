<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Products</h5>
                <Button label="Create" class="p-button-success mr-2" @click="goToNewProduct" />
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
                    <template v-if="isAdmin" #header>
                        <div class="flex flex-row-reverse">
                            <Button @click="onSearch" label="Search"></Button>
                        </div>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4 lg:col-3">
                                <label for="id">User</label>
                                <UserDropDownPagination v-model:userSelector="userSelector"></UserDropDownPagination>
                            </div>
                            <div class="field col-12 md:col-4 lg:col-3">
                                <label for="productId">Product Id</label>
                                <Chips id="productid" type="text" v-model="productId" placeholder="Search By Id"></Chips>
                            </div>

                            <div class="field col-12 md:col-4 lg:col-3">
                                <label for="transferReference">Product Reference</label>
                                <Chips id="transferReference" type="text" v-model="productReference" placeholder="Search By Reference"></Chips>
                            </div>
                        </div>
                    </template>
                    <Column field="barcode" header="Barcode" style="min-width:15rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <LinkParagraph :data="data.barcode" @pushing="navigateToDetail(data.product_id)" :myClass="{ shake: activateOrNot(data.product_name) }"></LinkParagraph>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label"
                                optionValue="value" @input="filterCallback()" />
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By Barcode" />
                        </template>
                    </Column>
                    <Column field="sku" header="Internal Reference" style="min-width:12rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.sku }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By Internal Reference"/>
                        </template>
                    </Column>
                    <Column field="product_name" header="Product Name" style="min-width:15rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.product_name }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label"
                                optionValue="value" @input="filterCallback()" />
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By Name" />
                        </template>
                    </Column>
                    <Column field="upc" header="UPC" style="min-width:12rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.upc }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By UPC"/>
                        </template>
                    </Column>
                    <Column field="category_name" header="Product Category" style="min-width:12rem" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.category_name }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By Product Category"/>
                        </template>
                    </Column>
                    <Column field="on_hands" header="On Hands" style="width:10%" :sortable="false"
                        :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.on_hands }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search By On Hands"/>
                        </template>
                    </Column>
                    <!-- <Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.product_name" icon="pi pi-trash" class="p-button-rounded p-button-warning m-0"
                                @click="confirmDeleteProduct(slotProps.data)" />
                                <div else>
                                    <p></p>
                                    <p></p>
                                    <p></p>
                                </div>
                        </template>
                    </Column> -->
                </DataTable>
                
            </div>
        </div>
    </div>
    <template>
        <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingProduct"></RetryField>
    </template>
</template>
<script>
import router from '../../router';
import RetryField from "../../components/prompt_field/RetryField.vue"
import { FilterMatchMode } from "primevue/api";
import { mapGetters } from 'vuex';
import LinkParagraph from '../../components/LinkParagraph.vue';
import { roleGroupId } from '../../domains/domain';
import UserDropDownPagination from '../../components/UserDropDownPagination.vue';

export default {
    async created() {
        this.toLoadRetry = this.initData
    },
    components: {
        RetryField,
        LinkParagraph,
        UserDropDownPagination
    },
    data() {
        return {
            rows: 10,        
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

            userSelector: null,
            myPageTracker: 0,

            productId: [],
            productReference: [],

            archivedProduct: 0
        }
    },
    computed: {
        ...mapGetters({
            getProductLength: "products/getProductLength",
            getUserId: "auth/getUserId",
            getUserRole: "auth/getUserRole"
        }),

        products() {
            return this.$store.getters['products/getProductState'];
        },

        isAdmin(){
            return this.getUserRole == roleGroupId.Admin;
        },
    },
    
    methods: {
        activateOrNot(product_name) {
            return product_name == this.$route.query.name ?? false
        },

        goToNewProduct() {
            const userId = this.$store.getters["auth/getUserRole"];
            if(userId == roleGroupId.Admin){
                router.push({name: "createProductAdmin"});
            }else{
                router.push({name: "createProduct"});
            }
        },

        async initData() {
            if(this.isAdmin){
                await this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    limit: 10,
                });
            }
            await this.SearchProduct();
        },

        async SearchProduct(pageNumber){

            await this.$store.dispatch("products/getProductLength",{
                userId: this.userSelector,
                productId: this.productId,
                productReference: this.productReference,
            });
            this.initList();

            const products = await this.$store.dispatch("products/onFetchProducts", {
                offset: (pageNumber || 0) * this.rows,
                limit: this.rows,
                userId: this.userSelector,
                productId: this.productId,
                productReference: this.productReference
            });

            this.updateList({offset: pageNumber? pageNumber*this.rows : 0, row: this.rows, tempList: products});
        },

        async onPage(event) {
            this.myPageTracker = event.page;
            this.toLoadRetry = async ()=>{
                const products = await this.$store.dispatch("products/onFetchProducts", {
                    offset: event.first,
                    limit: this.rows,
                    userId: this.userSelector
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
      }
    },

    watch:{
        userSelector:{
            immediate:true,
            handler(newValue){
                if(newValue){
                    this.toLoadRetry = async () => {
                        await this.SearchProduct(this.myPageTracker);
                    }
                }
                this.toLoadRetry = async() => {
                    await this.SearchProduct(this.myPageTracker);
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../assets/demo/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>

<style scoped>
@import '../../assets/styles/style.css';
</style>
