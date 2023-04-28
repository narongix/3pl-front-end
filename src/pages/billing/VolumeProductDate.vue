<template>
    <Dialog header="Volumes" v-model:visible="myStatus" maximizable modal :style="{ width: '75vw' }">
        <div class="card">
            <p></p>
            <DataTable scrollable scrollHeight="flex" :value="dataList" :paginator="true" class="p-datatable-sm" :dataKey="tmpId"
                :rowHover="true" responsiveLayout="scroll" @page="$event=> onPage($event)" :rowsPerPageOptions="[10,20,30]"
                v-model:rows="row" >
                    <template #empty>
                        <p>Empty...</p>
                    </template>
                    
                    <Column field="created_at" header="Created At" style="min-width:8rem">
                        <template #body="{ data }">
                            {{ convertUTCToTime(data.created_at) }}
                        </template>
                    </Column>
                    <Column field="product_name" header="Product Name" style="min-width:15rem"></Column>
                    <Column field="sku" header="Internal Reference" style="min-width: 10rem"></Column>
                    <Column field="dimensions" header="Dimension" style="min-width:12rem"></Column>
                    <Column field="volume_per_unit" header="Volume Per Unit" style="min-width:12rem"></Column>
                    <Column field="qty" header="Qty" style="min-width:12rem"></Column>
                    <Column field="total_volume" header="Total Volume" style="min-width:12rem">
                        <template #body="{ data }">
                            {{ round4Number(data.total_volume) }}
                        </template>
                    </Column>
                    <Column field="rate" header="Rate" style="min-width:12rem"></Column>
                    <Column field="volume_fee" header="Volume Fee" style="min-width:12rem">
                        <template #body="{ data }">
                            {{ round4Number(data.volume_fee) }}
                        </template>
                    </Column>
                </DataTable>
        </div>
        <RetryField :toLoad="toLoadRetry" :message="messages" :retryToast="retryToast"></RetryField>
    </Dialog>
</template>

<script>
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';
    import MyNumber from '../../components/utils/MyNumber';
    import mixins from "../../domains/mixin";

    export default{
        mixins:[ mixins.myDataTable ],
        props:{
            date: String,
            state: Boolean
        },
        
        emits:["update:state"],

        data(){
            return {
                toLoadRetry: null,
                row: 10,
            }
        },

        components:{
            RetryField
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
                    return this.state;
                },

                set(newValue){
                    this.$emit("update:state", newValue);
                }
            }
        },

        methods:{
            roundMyNumber(data){
                return MyNumber.convertToTwoDecimal(data);
            },

            round4Number(data){
                return MyNumber.convertToFourDecimal(data);
            },

            async initData(){
                const volumeListProduct = await this.$store.dispatch("billing/onFetchVolumeWithDate",{
                    offset: 0,
                    limit: this.row,
                    date: this.date
                });
                this.initList(volumeListProduct.rows_total);
                this.updateList({
                    offset: 0,
                    row: this.row ?? 10,
                    tempList: volumeListProduct.rows
                });
            },

            async onPage(event){
                this.toLoadRetry = async ()=>{
                    const offset = event.first;
                    const limitForList = event.rows;

                    const data = await this.$store.dispatch("billing/onFetchVolumeWithDate",{
                        offset: offset,
                        limit: this.row,
                        date: this.date
                    });
                    
                    this.updateList({offset: offset, row: limitForList, tempList: data.rows});
                } 
            },

            convertUTCToTime(time){
                return TimeConvert.formatUTCToDateNoTime(time);
            }
        },
        watch:{
            state(){
                this.toLoadRetry = this.initData;
            }
        }
    }
</script>