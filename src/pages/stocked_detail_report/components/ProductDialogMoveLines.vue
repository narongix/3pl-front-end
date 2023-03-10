<template>
    <div>
        <Dialog header="Product Moves Lines History" v-model:visible="myState">
            <DataTable :value="getProductMoves" :paginator="true" v-model:rows="row"
                :rowHover="true" filterDisplay="menu" responsiveLayout="scroll"
                :rowsPerPageOptions="[10,20,30]" sortField="created_at" :sortOrder="-1" 
                class="p-datatable-sm" dataKey="id" v-model:filters="filters" @page="onPage($event)" 
                style="height: 100vh; width:100%;"
                >
                <template #empty>
                    No product history found.
                </template>
                <Column field="product_id" header="Product Id" style="min-width:12rem" :sortable="true">
                    <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template>
                </Column>
                <Column field="created_at" header="Created at" :sortable="true" sort :showFilterMatchModes="false">
                    <template #filter>
                        <CalendarTime @getValueMode="storeCreatedAtMode" @getValue="storeCreatedAtValue"></CalendarTime>
                    </template>
                    <template #body="{ data }">
                        {{ convert(data.created_at) }}
                    </template>
                </Column>
                <Column field="movement_name" header="Movement Name" style="min-width:12rem" :sortable="true">
                    <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template>
                </Column>
                <Column field="qty" header="Quantity" style="min-width:12rem" :sortable="true">
                    <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template>
                </Column>
                <Column field="serial" header="Serial/Lot Number" style="min-width:12rem" :sortable="true">
                    <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template>
                </Column>
                <Column field="odoo_reference" header="Odoo Reference" style="min-width:12rem" :sortable="true">
                    <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template>
                </Column>
            </DataTable>
        </Dialog>
    </div>
    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToast"></RetryField>
    <HiddenRetryField :toLoad="toLoadHidden" :message="message" :errorToast="errorToast"></HiddenRetryField>
</template>

<script>
    import {FilterMatchMode, FilterOperator} from "primevue/api"
    import { mapGetters } from 'vuex'
    import HiddenRetryField from '../../../components/prompt_field/HiddenRetryField.vue';
    import RetryField from '../../../components/prompt_field/RetryField.vue'
    import TimeConvert from '../../../components/utils/TimeConvert'
    import CalendarTime from "@/pages/transfers/components/CalendarTime.vue";

    export default{
    props: {
        modelValue: Boolean,
        productId: String,
    },
    emits: ["update:modelValue"],
    data() {
        return {
            showProductMoveLine: false,
            offset: 0,
            row: 10,

            toLoadHidden: null,
            toLoadRetry: null,
            outOfFetch: 3,

            filters: {
                product_id: {operator: FilterOperator.OR, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                created_at: {value: null, matchMode: "datesIn"},
                movement_name: {operator: FilterOperator.OR, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                qty: {operator: FilterOperator.OR, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                serial: {operator: FilterOperator.OR, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
                odoo_reference: {operator: FilterOperator.OR, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
            }
        };
    },
    computed: {
        ...mapGetters({
            getProducts: "products/getProductState"
        }),

        getProductDetail() {
            const index = this.getProducts.findIndex((e) => e.product_id == this.productId);
            if (index < 0) {
                this.$router.back;
            }
            return this.getProducts[index];
        },
        getProductMoves() {
            return this.getProductDetail?.product_moves ?? [];
        },
        myState: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            }
        },

        message(){
            return {
                failed: "Error Loading Product Moves Lines",
                yesButton: "Yes",
                noButton: "No"
            }
        },

        errorToast(){
            return {
                severity: "error",
                summary: "Loading Failed!",
                detail: "Error loading Product Moves Lines",
                life: 3000
            }
        }
    },
    methods: {
        convert(data) {
            return TimeConvert.formatUTCToDate(data);
        },
        async initData() {
            this.toLoadRetry = async ()=>{
                await this.$store.dispatch("products/getDetailProductOnStockDetail", { 
                    productId: this.productId, 
                    limit:this.row*2, 
                    offset: this.offset
                });
               
                this.offset =  this.row*2
            }
        },

        async loadData(){
            this.toLoadHidden = async ()=>{
                const data = await this.$store.dispatch("products/getDetailProductOnStockDetail", {
                    productId: this.productId,
                    limit: this.row,
                    offset: this.offset
                })

                if(data.product_moves.length==0){
                    this.outOfFetch=0
                }

                this.offset+=this.row
            }
        },

        onPage(event) {
            if (event.page + 1 == event.pageCount && this.outOfFetch > 0) {
                this.loadData()
            }
        },

        storeCreatedAtMode(newValue){
            this.filters.created_at.matchMode = newValue
        },
        
        storeCreatedAtValue(newValue){
            this.filters.created_at.value=newValue
        }
    },
    watch: {
        productId(newValue) {
            // TODO: Intergrate product movesline
            // with stock detail product
            if (newValue) {
                this.initData();
            }
        }
    },
    components: { RetryField, HiddenRetryField, CalendarTime }
}
</script>