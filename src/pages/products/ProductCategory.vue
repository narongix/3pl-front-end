<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Product Categories</h5>
                <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToNewProduct" />
                <p></p>
                <DataTable :value="prodCategories" :paginator="true" class="p-datatable-sm" :rows="10" dataKey="id"
                    :rowHover="true" filterDisplay="menu" :loading="loading1" responsiveLayout="scroll"
                    :rowsPerPageOptions="[10, 20, 30]">
                    <template #loading v-if="isLoading">
                    </template>
                    <Column field="category_name" header="Category Name" style="min-width:12rem" :sortable="false">
                        <template #body="{ data }">
                            <categories-item :data="data" :class="{ shake: activateOrNot(data.id) }"></categories-item>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning m-0"
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm"
                    :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="temp">Are you sure you want to delete <b>{{ temp.category_name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text"
                            @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProductCategory" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
    <template>
        <RetryField :toLoad="toLoadCategory" :message="message" :errorToast="errorToastDeletingProCategory">
        </RetryField>
    </template>
</template>
<script>
import CategoriesItem from './components/CategoriesItem.vue';
import router from '../../router';
import RetryField from "../../components/prompt_field/RetryField.vue"

export default {
    components: {
        CategoriesItem,
        RetryField
    },
    data() {
        return {
            loading1: true,
            deleteProductDialog: false,
            temp: null,
            toLoadCategory: null,
            message: {
                failed: "Error Loading Data. Try again?",
                yesButton: "Yes",
                noButton: "No",
            },
            errorToastDeletingProCategory: {
                severity: "error",
                summary: "Error!",
                detail: "Failed Deleting Product Category!"
            }
        }
    },
    computed: {
        prodCategories() {
            return this.$store.getters['products/prodCategories'];
        },
        isLoading() {
            return this.loading1;
        }
    },
    created() {
        this.loadProductCategories();
        this.toLoadCategory = this.initData
    },
    methods: {
        activateOrNot(id) {
            return id == this.$route.query.id ?? false
        },
        async loadProductCategories(refresh = false) {
            const userId = this.$store.getters["auth/getUserId"];
            try {
                await this.$store.dispatch('products/getProdCategories', {
                    forceRefresh: refresh,
                    userId: userId
                });
            } catch (error) {
                this.error = error.message || 'Something went wrong!';
            }
            this.loading1 = false;
        },
        async goToNewProduct() {
            await router.push('/product-categories/new/');
        },
        confirmDeleteProduct(category) {
            this.temp = category;

            this.deleteProductDialog = true;
        },
        async deleteProductCategory() {
            this.toLoadCategory = async () => {
                const actionPayload = {
                    id: this.temp.id,
                };
                await this.$store.dispatch('products/deleteProductCategory', {
                    payload: actionPayload
                });
                this.temp = null;
                this.deleteProductDialog = false
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Deleted', life: 3000 });
            }
        },
        async initData() {
            const userId = this.$store.getters["auth/getUserId"];
            await this.$store.dispatch("products/onFetchProducts", {
                offset: 0
            })
            await this.$store.dispatch("products/getProdCategories",{
                userId: userId
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
