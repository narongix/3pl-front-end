<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Products</h5>
                <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToNewProduct" />
                <p></p>
                <DataTable :value="products" :paginator="true" class="p-datatable-sm" :rows="10" dataKey="product_id"
                    :rowHover="true" filterDisplay="menu" :loading="loading1" responsiveLayout="scroll"
                    :rowsPerPageOptions="[10, 20, 30]" v-model:filters="filters">
                    <template #loading v-if="isLoading">
                    </template>

                    <Column field="barcode" header="Barcode" style="min-width:15rem" :sortable="true" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <product-item :data="data"
                                :class="{ shake: activateOrNot(data.product_name) }"></product-item>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by barcode"/>
                        </template>
                    </Column>

                    <Column field="sku" header="VendorCode" style="min-width:12rem" :sortable="true" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.sku }}</p>
                        </template>
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by vendorCode"/>
                        </template> -->
                    </Column>

                    <Column field="product_name" header="Product Name" style="min-width:15rem" :sortable="true" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.product_name }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by name"/>
                        </template>
                    </Column>

                    <Column field="upc" header="UPC" style="min-width:12rem" :sortable="true" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            {{ data.upc }}
                        </template>
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by upc"/>
                        </template> -->
                    </Column>

                    <Column field="category_name" header="Product Category" style="min-width:12rem" :sortable="true" :showFilterMatchModes="false">
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by product category"/>
                        </template> -->
                    </Column>

                    <Column field="onHands" header="On Hands" style="width:10%" :sortable="true" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.onHands }}</p>
                        </template>
                        <!-- <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by on hands"/>
                        </template> -->
                    </Column>

                    <Column field="sync_status" header="Sync Status" style="width:10%" :sortable="true" :showFilterMatchModes="false">
                        <template #body="{ data }">
                            <p :class="{ shake: activateOrNot(data.product_name) }">{{ data.sync_status }}</p>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <Dropdown v-model="filterModel.matchMode" :options="customFilter" optionLabel="label" optionValue="value" 
                                @input="filterCallback()"/>
                            <InputText type="text" v-model="filterModel.value" @input="filterCallback()"
                                class="p-column-filter mt-3" placeholder="Search by status"/>
                        </template>
                    </Column>

                    <Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
    <template>
        <RetryField :toLoad="toLoadProduct" :message="message" :errorToast="errorToastDeletingProduct"></RetryField>
    </template>
</template>

<script>
import ProductItem from '../../components/ui/products/ProductItem.vue';
import router from '../../router';
import RetryField from "../../components/prompt_field/RetryField.vue"

import { FilterMatchMode } from "primevue/api";

export default {
    components: {
        ProductItem,
        RetryField
    },
    data() {
        return {
            loading1: true,
            productDialog: false,
            deleteProductDialog: false,
            disabled: false,
            myData: [],
            filters: {
                product_name:{ value: null, matchMode: FilterMatchMode.STARTS_WITH },
                sync_status:{ value: null, matchMode: FilterMatchMode.STARTS_WITH },
                barcode:{ value: null, matchMode: FilterMatchMode.STARTS_WITH },
                // sku:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                // upc:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                // category_name:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
                // onHands:{value: null, matchMode: FilterMatchMode.STARTS_WITH},
            },
            customFilter: [
                {label: "Starts with", value: FilterMatchMode.STARTS_WITH},
                {label: "Contains", value: FilterMatchMode.CONTAINS},
                {label: "Equals", value: FilterMatchMode.EQUALS},
            ],
            toLoadProduct: null,
            message: {
                failed: "Error Loading Data. Try again?",
                yesButton: "Yes",
                noButton: "No",
            },
            errorToastDeletingProduct: {
                severity:"error",
                summary: "Error!",
                detail: "Failed Deleting Product!"
            }
        }
    },
    computed: {
        products() {
            return this.$store.getters['products/getProductState'];
        },
        isLoading() {
            return this.loading1;
        }
    },
    created() {
        // TODO: Implement try catch and loading
        this.loadProducts();
        this.warnDisabled();
        this.toLoadProduct = this.initData
    },
    methods: {
        activateOrNot(product_name) {

            return product_name == this.$route.query.name ?? false
        },
        warnDisabled() {
            this.disabled = true;
            setTimeout(() => {
                this.disabled = false;
            }, 1500)
        },
        async loadProducts() {
            await this.$store.dispatch("products/onFetchProducts", {
                offset: 0,
            })

            this.loading1 = false;
        },
        goToNewProduct() {
            router.push('/products/new/');
        },
        confirmDeleteProduct(product) {
            this.product = product;
            this.deleteProductDialog = true;
        },
        async deleteProduct() {
            this.toLoadProduct = async ()=>{
                this.deleteProductDialog = false;
                const actionPayload = {
                    id: this.product.product_id,
                };
                await this.$store.dispatch('products/deleteProduct', actionPayload);
                this.product = {};
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            }
        },
        async initData(){
            await this.$store.dispatch("products/onFetchProducts",{
                offset: 0
            })
        }
    },
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
