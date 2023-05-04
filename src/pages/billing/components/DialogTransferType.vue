<template>
    <div>
        <Dialog header="Transfer Volumes" v-model:visible="myStatus" :modal="true" maximizable :style="{ width: '75vw' }">
            <div class="card">
                <DataTable :value="dataList" :paginator="true" class="p-datatable-sm" :data-key="tmpId"
                    :rowHover="true" responsiveLayout="scroll" @page="onPage" :rowsPerPageOptions="[10,20,30]"
                    v-model:rows="row" 
                    >
                        <template #empty>
                            <p>Empty...</p>
                        </template>
                        <Column field="id" header="Id"></Column>
                        <Column field="reference" header="Reference"></Column>
                        <Column field="volume" header="Volume">
                            <template #body="{ data }">
                                {{ round4Number(data.volume) }}
                            </template>
                        </Column>
                        <Column field="charged_volume" header="Charged Volume">
                            <template #body="{ data }">
                                {{ round4Number(data.charged_volume) }}
                            </template>
                        </Column>
                        <Column field="rate" header="Rate"></Column>
                        <Column field="volume_fee" header="Subtotal($)">
                            <template #body="{ data }">
                                {{ round2Number(data.volume_fee) }}
                            </template>
                        </Column>
                        <Column field="created_at" header="CreatedAt">
                            <template #body="{ data }">
                                <p>{{ convertUTCToTimeFormat(data.created_at) }}</p>
                            </template>
                        </Column>
                    </DataTable>
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
    import TimeConvert from '../../../components/utils/TimeConvert';
    import { convertToFourDecimal, convertToTwoDecimal } from '../../../components/utils/MyNumber';
    import myMixin from '../../../domains/mixin'

    export default{
        mixins:[myMixin.myDataTable],
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
            RetryField
        },
        data(){
            return {
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
            round4Number(data){
                return convertToFourDecimal(data);
            },

            round2Number(data){
                return convertToTwoDecimal(data);
            },

            async initData(){
                const data = await this.$store.dispatch("billing/onFetchTransferTrx", {
                    offset: 0,
                    limit: this.row,
                    month: this.$route.query.month,
                    year: this.$route.query.year,
                    transferType: this.type
                });

                this.initList(data.rows_total);
                this.updateList({offset:0, row: this.row, tempList: data.rows});
            },

            async onPage(event){
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

                    this.updateList({offset: offset, row: limit, tempList: data.rows});
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
            }
        }
    }
</script>