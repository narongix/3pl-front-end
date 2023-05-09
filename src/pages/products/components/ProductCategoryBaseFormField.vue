<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Product Categories</h5>
                <Button label="Create" class="p-button-success mr-2" @click="gotoCreateProduct"/>
                <p></p>
                <DataTable :value="dataList" :paginator="true" class="p-datatable-sm" v-model:rows="rows" :dataKey="tmpId"
                    :rowHover="true" filterDisplay="menu" responsiveLayout="scroll"
                    :rowsPerPageOptions="[10, 20, 30]" @page="onPage">
                    <template v-if="isAdmin" #header>
                        <slot :loadProductCategory="initData">
                            
                        </slot>
                    </template>
                    <Column field="category_name" header="Category Name" style="min-width:12rem" :sortable="false">
                        <template #body="{ data }"> 
                            <!-- <categories-item :data="data" :class="{ shake: activateOrNot(data.id) }"></categories-item> -->
                            <LinkParagraph :data="data.category_name" :myClass="{ shake: activateOrNot(data.id)}" @pushing="$emit('navigateToCategoryDetail', data.id)"></LinkParagraph>
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
    <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToastDeletingProCategory">
    </RetryField>
</template>


<style scoped lang="scss">
    @import '../../../assets/demo/badges.scss';

    ::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
    }
    ::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
    }
</style>

<script>
    // import CategoriesItem from './CategoriesItem.vue';
    import RetryField from "../../../components/prompt_field/RetryField.vue"
    import mixin from '../../../domains/mixin';
    import { roleGroupId } from '../../../domains/domain';
    import LinkParagraph from '../../../components/LinkParagraph.vue';

  export default {
    mixins: [mixin.myDataTable],
    emits: ["navigateToCategoryDetail"],
    components: {
        // CategoriesItem,
        RetryField,
        LinkParagraph
    },
    props:{
        gotoCreateProduct:{
            type: null,
            require: false,
        },
        userId: {
            type: String,
            required: false
        },
        onInit: {
            type: Function,
            required: false
        }            
    },
    created() {
        this.toLoad = this.initData
    },
    data() {
        return {
            deleteProductDialog: false,
            temp: null,
            toLoad: null,
            message: {
                failed: "Error Loading Data. Try again?",
                yesButton: "Yes",
                noButton: "No",
            },
            errorToastDeletingProCategory: {
                severity: "error",
                summary: "Error!",
                detail: "Failed Deleting Product Category!"
            },

            rows: 10,
            pagetracker: 0,
        }
    },
    computed: {
        prodCategories() {
            return this.$store.getters['products/prodCategories'];
        },
        isAdmin(){
            const myId= this.$store.getters['auth/getUserRole'];
            return myId == roleGroupId.Admin;
        }
    },
    methods: {
        
        activateOrNot(id) {
            return id == this.$route.query.id ?? false
        },

        confirmDeleteProduct(category) {
            this.temp = category;

            this.deleteProductDialog = true;
        },
        async deleteProductCategory() {
            this.toLoad = async () => {
                await this.$store.dispatch('products/deleteProductCategory', {
                    id: this.temp.id
                });

                this.deleteElement({key:'id', id: this.temp.id});
                
                this.temp = null;
                this.deleteProductDialog = false
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Deleted', life: 2000 });
            }
        },
        async initData(onPage) {
            // await this.$store.dispatch("products/onFetchProducts", {
            //     offset: 0
            // })
            const data = await this.$store.dispatch("products/getProdCategories",{
                userId: this.userId,
                offset: onPage ?? 0,
                limit: this.rows
            });
            await this.onInit?.();
            this.initList(data.rows_total);
            this.updateList({offset: onPage ?? 0, row: this.rows, tempList: data.rows});
        },

        onPage(event){
            this.pagetracker = event.page;
            this.toLoad = async () => {
            const data = await this.$store.dispatch("products/getProdCategories",{
                userId: this.userId,
                offset: event.first,
                limit: this.rows
            });

            const offset = event.first
            const limit = event.rows
            this.updateList({offset: offset, row: limit, tempList: data.rows})
            }
        }
    },
    watch:{
      userId:{
        immediate: true,
        handler(){
          this.toLoad = async ()=>{
            await this.initData(this.pagetracker);
          };
        }
      }
    }
  }
</script>