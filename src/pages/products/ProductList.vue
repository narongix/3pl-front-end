<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Products</h5>
                <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToNewProduct" />
                <p></p>
                <DataTable :value="products" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id"
                    :rowHover="true" filterDisplay="menu" :loading="loading1" responsiveLayout="scroll" :rowsPerPageOptions="[10,20,30]">

                    <!-- <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">

                        </div>
                    </template> -->
                    <!-- <template #empty>
                        No products found.
                    </template> -->
                    <template #loading v-if="isLoading">
                        Loading product data. Please wait.
                    </template>


                    <Column field="Barcode" header="Barcode" style="min-width:15rem">
                        <template #body="{ data }">
                            <product-item :data="data"></product-item>
                        </template>
                    </Column>

                    <Column field="VendorCode" header="VendorCode" style="min-width:12rem">
                        <template #body="{ data }">
                            {{ data.sku }}
                        </template>
                    </Column>

                    <Column field="ProductName" header="Product Name" style="min-width:15rem">
                        <template #body="{ data }">
                            {{ data.product_name }}
                        </template>
                    </Column>

                    <Column field="UPC" header="UPC" style="min-width:12rem">
                        <template #body="{ data }">
                            {{ data.upc }}
                        </template>
                    </Column>

                    <Column field="ProductCategory" header="Product Category" style="min-width:12rem">
                        <template #body="{}">
                            {{}}
                        </template>
                    </Column>

                    <Column field="OnHands" header="On Hands" style="width:10%">
                        <template #body="{ data }">
                            {{ data.onHands }}
                        </template>
                    </Column>

                    <Column field="SyncStatus" header="Sync Status" style="width:10%">
                        <template #body="{ data }">
                            {{ data.sync_status }}
                        </template>
                    </Column>
        
                    <Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editProduct(slotProps.data)" /> -->
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deleteProductDialog=false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>
            </div>
        </div>

    </div>
</template>

<script>
    import ProductItem from '../../components/ui/products/ProductItem.vue';
    import router from '../../router';
    export default {
        components: {
            ProductItem
        },
        data() {
            return {
                loading1: true,
                productDialog: false,
                deleteProductDialog: false,
            }
        },
        computed: {
            products() {
                return this.$store.getters['products/products'];
            },
            isLoading() {
                return this.loading1;
            }
        },
        created() {
            this.loadProducts();
        },
        methods: {
            async loadProducts(refresh = false) {
                // try {
                //     await this.$store.dispatch('products/getProducts', {
                //         forceRefresh: refresh,
                //     });
                // } catch (error) {
                //     this.error = error.message || 'Something went wrong!';
                // }
                await this.$store.dispatch('products/getProducts', {
                        forceRefresh: refresh,
                    });

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
                this.deleteProductDialog = false;
                const actionPayload = {
                    id: this.product.id,
                };
                await this.$store.dispatch('products/deleteProduct', actionPayload);
                this.product = {};
                this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
            },
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
