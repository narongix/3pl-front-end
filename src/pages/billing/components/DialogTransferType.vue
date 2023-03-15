<template>
    <div>
        <Dialog header="Transfer Volumes" v-model:visible="myStatus" :modal="true">
            <div class="card">
                <MyDataTable v-slot="mySlot" :initializeList="tempData" :row="row">
                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" dataKey="id"
                    :rowHover="true" responsiveLayout="scroll" @page="$event=> onPage($event, mySlot.update)" :rowsPerPageOptions="[10,20,30]"
                    v-model:rows="row" 
                    >
                        <template #empty>
                            <p>Empty...</p>
                        </template>
                        <Column field="id" header="Id"></Column>
                        <Column field="reference" header="Reference"></Column>
                        <Column field="volume" header="Volume"></Column>
                        <Column field="created_at" header="CreatedAt">
                            <template #body="{ data }">
                                <p>{{ convertUTCToTimeFormat(data.created_at) }}</p>
                            </template>
                        </Column>
                    </DataTable>
                </MyDataTable>
            </div>
        </Dialog>
        <RetryField :toLoad="toLoadRetry" :message="messages"></RetryField>
    </div>
</template>

<style>
    .myDataTable{
        width: 80%;
    }
</style>

<script>
    import RetryField from '../../../components/prompt_field/RetryField.vue'
    import MyDataTable from '../../../components/MyDataTable.vue';
    import TimeConvert from '../../../components/utils/TimeConvert';

    export default{
        props:{
            type: String,
            status: Boolean,
            onExitDialog: Function,
        },
        emits:[
            "update:status",
            "onExitDialog"
        ],
        components:{
            MyDataTable,
            RetryField
        },
        data(){
            return {
                tempData: [],
                toLoadRetry: null,
                row: 10,
                mySelected: null,
                myType: null
            };
        },
        computed:{
            messages(){
                return {
                    failed: "Loading Failed, Retry?",
                    yesButton: "Yes",
                    noButton: "No"
                }
            },
            retryToast(){
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Loading!",
                    life: 1000
                }
            },
            myStatus:{
                get(){
                    return this.status;
                },
                set(newValue){
                    this.$emit("update:status", newValue);
                    // OnExit
                    if(!newValue){
                        this.$emit("onExitDialog");
                    }
                }
            }
        },
        methods:{
            async initData(){
                const data = await this.$store.dispatch("billing/onFetchTransferTrx", {
                    offset: 0,
                    limit: this.row,
                    month: this.$route.query.month,
                    year: this.$route.query.year,
                    transferType: this.type
                });

                this.tempData = data.rows;
                return data.row_totals;
            },

            async onPage(event, updateList){
                this.toLoadRetry = async ()=>{
                    const data = await this.$store.dispatch("billing/onFetchTransferTrx",{
                        offset: event.first,
                        limit: this.row,
                        month: this.$route.query.month,
                        year: this.$route.query.year,
                        transferType: this.type
                    });

                    const offset = event.first;
                    const limit = event.rows;

                    updateList({offset: offset, row: limit, tempList: data.rows});
                } 
            },

            convertUTCToTimeFormat(time){
                return TimeConvert.formatUTCToDate(time);
            }
        },
        watch:{
            myStatus(newValue){
                if(newValue){
                   return this.toLoadRetry = this.initData
                }
                this.toLoadRetry=null;
                this.tempData.length=0
            }
        }
    }
</script>