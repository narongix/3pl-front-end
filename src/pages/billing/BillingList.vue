<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Billing Summary</h5>
                <p></p>
                <MyDataTable v-slot="mySlot" :initializeList="tempData" :row="row">

                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" 
                    dataKey="id" :rowHover="true" responsiveLayout="scroll" 
                    @page="onPage($event, mySlot.update)" :rowsPerPageOptions="[10, 20, 30]"
                    v-model:rows="row"
                    >

                    <template #empty>
                        <p>Empty...</p>
                    </template>
                        <Column field="reference" header="Reference">
                            <template #body="{ data }">
                               <ReferenceItem :data="data"></ReferenceItem>
                            </template>
                        </Column>
                        <Column field="month" header="Month"></Column>
                        <Column field="year" header="Year"></Column>
                        <Column field="total" header="Total"></Column>
                        <Column field="bill_status_id" header="Status"></Column>
                        <Column field="created_at" header="CreatedAt">
                            <template #body="{ data }">
                                {{ formatDate(data?.created_at ?? null) }}
                            </template>
                        </Column>
                    </DataTable>
                </MyDataTable>
            </div>
        </div>
        <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingTransfer"></RetryField>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MyDataTable from '../../components/MyDataTable.vue'
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';
    import ReferenceItem from './components/ReferenceItem.vue';

    export default{
        async created(){
            this.toLoadRetry = this.initData;
        },
        components:{
            MyDataTable,
            RetryField,
            ReferenceItem,
        },
        data(){
            return {
                row: 10,
                toLoadRetry: null,
                tempData: [],
            }
        },
        computed:{
            ...mapGetters({
                getBillings: "billing/getBilling"
            }),

            message(){
                return {
                    failed: "Error Loading Billing, Try again",
                    yesButton: "Yes",
                    noButton: "No"
                }
            },

            errorToastDeletingTransfer(){
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Loading Billing!"
                }
            }
        },
        methods:{
            async initData(){
                const myData = await this.$store.dispatch("billing/onFetchBilling", {
                    limit: this.row,
                    offset: 0
                })

                this.tempData = myData;
            },

            onPage(event, updateList) {
                this.toLoadRetry = async () => {
                    const billings = await this.$store.dispatch("billing/onFetchBilling", {
                        currentOffset: event.first,
                        limit: this.row
                    })

                    const offset= event.first;
                    const limit = event.rows;
                    updateList({offset: offset, row:limit, tempList: billings})
                }
            },

            formatDate(time){
                return TimeConvert.formatDateFromScheduleDate(time)
            }
        }
    }
</script>