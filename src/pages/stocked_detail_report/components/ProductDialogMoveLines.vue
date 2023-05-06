<template>
    <div>
        <Dialog header="Product Moves Lines History" v-model:visible="myState" maximizable modal :style="{ width: '75vw'}">
            <DataTable ref="myDt" :value="dataList" scrollable :paginator="true" v-model:rows="row"
            :rowHover="true" filterDisplay="menu" responsiveLayout="scroll"
            :rowsPerPageOptions="[10,20,30]" sortField="created_at" :sortOrder="-1" 
            class="p-datatable-sm" dataKey="id" v-model:filters="filters" @page="onPage($event)" 
            style="height: 100vh; width:100%;" :exportFilename="exportName()"
            >
                <template #empty>
                    No product history found.
                </template>
                <Column field="created_at" header="Created at" :sortable="false" sort :showFilterMatchModes="false">
                    <!-- <template #filter>
                        <CalendarTime @getValueMode="storeCreatedAtMode" @getValue="storeCreatedAtValue"></CalendarTime>
                    </template> -->
                    <template #body="{ data }">
                        {{ convert(data.created_at) }}
                    </template>
                </Column>
                <Column field="movement_name" header="Movement" style="min-width:12rem" :sortable="false">
                    <!-- <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template> -->
                </Column>
                <Column field="qty" header="Quantity" style="min-width:12rem" :sortable="false">
                    <!-- <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template> -->
                </Column>
                <Column field="serial" header="Serial/Lot Number" style="min-width:12rem" :sortable="false">
                    <!-- <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template> -->
                </Column>
                <Column field="odoo_reference" header="Odoo Reference" style="min-width:12rem" :sortable="false">
                    <!-- <template #filter="{filterModel, filterCallBack}">
                        <inputText v-model="filterModel.value" @input="filterCallBack()"></inputText>
                    </template> -->
                </Column>
            </DataTable>
        </Dialog>
    </div>
    <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToast"></RetryField>
</template>

<script>
    import {FilterMatchMode, FilterOperator} from "primevue/api"
    import { mapGetters } from 'vuex'
    import RetryField from '../../../components/prompt_field/RetryField.vue'
    import TimeConvert from '../../../components/utils/TimeConvert'
    import myMixin from "../../../domains/mixin";

    export default{
        mixins:[myMixin.myDataTable],
    components: { 
        RetryField
    },
    props: {
        modelValue: Boolean,
        productId: String,
        userId: String,
        fromDate: null,
        toDate: null,
        onExport: Boolean
    },
    emits: ["update:modelValue", "update:onExport"],
    data() {
        return {
            row: 10,
            blah: true,

            toLoadRetry: null,
            filters: {
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
        exportName(){
            const newFromDate = TimeConvert.formatDateToStockFormat(this.fromDate);
            const newToDate = TimeConvert.formatDateToStockFormat(this.toDate);
            return `Product_Movement(${newFromDate} - ${newToDate})`;
        },

        convert(data) {
            return TimeConvert.formatUTCToDate(data);
        },
        async initData() {
            this.toLoadRetry = async ()=>{
                const data = await this.$store.dispatch("products/getDetailProductOnStockDetail", { 
                    productId: this.productId, 
                    limit:this.row, 
                    offset: 0,
                    userId: this.userId,
                    fromDate: this.fromDate,
                    toDate: this.toDate
                });

                this.initList(data.rows_total);
                this.updateList({offset: 0, row: this.row, tempList: data.product_moves})
            }
        },

        onPage(event) {
            this.toLoadRetry = async ()=>{
                const data = await this.$store.dispatch("products/getDetailProductOnStockDetail", {
                    productId: this.productId,
                    limit: this.row,
                    offset: event.first,
                    userId: this.userId,
                    fromDate: this.fromDate,
                    toDate: this.toDate
                });
                const offset= event.first;
                const limit = event.rows;
                this.updateList({offset: offset, row:limit, tempList: data.product_moves});
            };
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
            if (newValue) {
                this.initData();
            }
        },
        onExport:{
            immediate: true,
            handler(newValue){
                if(newValue){
                    this.toLoadRetry = async () =>{
                        const data = await this.$store.dispatch("products/getAllProductMovement", { 
                            userId: this.userId,
                            fromDate: this.fromDate,
                            toDate: this.toDate
                        });

                        const newData = data.rows.map((e)=>{
                            return {
                                ...e,
                                created_at: this.convert(e.created_at)
                            }
                        })
                        this.updateList({offset: 0, row:data.rows_total, tempList: newData});
                        
                        this.$refs.myDt.exportCSV();
                        this.$emit("update:onExport", false);
                        this.myState=false;
                    }
                }
            }
        }
    }
}
</script>