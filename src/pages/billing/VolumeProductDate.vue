<template>
    <Dialog header="Volumes" v-model:visible="myStatus" maximizable modal :style="{ width: '75vw' }">
        <div class="card">
            <p></p>
            <MyDataTable v-slot="mySlot" :initializeList="myArray" :total="length">
                <DataTable scrollable scrollHeight="flex" :value="mySlot.value" :paginator="true" class="p-datatable-sm" :dataKey="mySlot.tmpId"
                :rowHover="true" responsiveLayout="scroll" @page="$event=> onPage($event, mySlot.update)" :rowsPerPageOptions="[10,20,30]"
                v-model:rows="row" >
                    <template #empty>
                        <p>Empty...</p>
                    </template>
                    
                    <Column field="created_at" header="Created At" style="min-width:12rem">
                        <template #body="{ data }">
                            {{ convertUTCToTime(data.created_at) }}
                        </template>
                    </Column>
                    <Column field="product_name" header="Product Name" style="min-width:15rem"></Column>
                    <Column field="dimensions" header="Dimension" style="min-width:12rem"></Column>
                    <Column field="volume_per_unit" header="Volume Per Unit" style="min-width:12rem"></Column>
                    <Column field="qty" header="Qty" style="min-width:5rem"></Column>
                    <Column field="total_volume" header="Total Volume" style="min-width:8rem">
                        <template #body="{ data }">
                            {{ round4Number(data.total_volume) }}
                        </template>
                    </Column>
                    <Column field="rate" header="Rate" style="min-width:4rem"></Column>
                    <Column field="volume_fee" header="Volume Fee" style="min-width:8rem">
                        <template #body="{ data }">
                            {{ round4Number(data.volume_fee) }}
                        </template>
                    </Column>
                </DataTable>
            </MyDataTable>
        </div>
        <RetryField :toLoad="toLoadRetry" :message="messages" :retryToast="retryToast"></RetryField>
    </Dialog>
</template>

<script>
    import MyDataTable from '../../components/MyDataTable.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';
    import MyNumber from '../../components/utils/MyNumber';

    export default{
        props:{
            date: String,
            state: Boolean
        },
        
        emits:["update:state"],

        data(){
            return {
                toLoadRetry: null,
                myArray: [], 
                row: 10,
                length: 0
            }
        },

        components:{
            MyDataTable,
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
                this.length= volumeListProduct.rows_total;
                this.myArray = volumeListProduct.rows;
            },

            async onPage(event, updateList){
                this.toLoadRetry = async ()=>{
                    const offset = event.first;
                    const limitForList = event.rows;

                    const data = await this.$store.dispatch("billing/onFetchVolumeWithDate",{
                        offset: offset,
                        limit: this.row,
                        date: this.date
                    });
                    
                    updateList({offset: offset, row: limitForList, tempList: data.rows});
                } 
            },

            convertUTCToTime(time){
                return TimeConvert.formatUTCToDate(time);
            }
        },
        watch:{
            state(){
                this.toLoadRetry = this.initData;
            }
        }
    }
</script>