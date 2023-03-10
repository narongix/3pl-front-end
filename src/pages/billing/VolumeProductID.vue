<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Volumes</h5>
                <p></p>
                <MyDataTable v-slot="mySlot" :initializeList="myArray" :total="length">
                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" :dataKey="mySlot.tmpId"
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
                        <Column field="total_volume" header="Total Volume" style="min-width:8rem"></Column>
                        <Column field="rate" header="Rate" style="min-width:4rem"></Column>
                        <Column field="volume_fee" header="Volume Fee" style="min-width:8rem"></Column>
                    </DataTable>
                </MyDataTable>
            </div>
        </div>
        <RetryField :toLoad="toLoadRetry" :message="messages" :retryToast="retryToast"></RetryField>
    </div>
</template>

<script>
    import MyDataTable from '../../components/MyDataTable.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';

    export default{
        created(){
            this.toLoadRetry = this.initData;
        },
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
        },

        methods:{
            async initData(){
                const volumeListProduct = await this.$store.dispatch("billing/onFetchVolumeWithProductId",{
                    offset: 0,
                    limit: this.row,
                    month: this.$route.query.month,
                    year: this.$route.query.year,
                    productId: this.$route.query.product_id
                });
                this.length= volumeListProduct.rows_total;
                this.myArray = volumeListProduct.rows;
            },

            async onPage(event, updateList){
                this.toLoadRetry = async ()=>{
                    const offset = event.first;
                    const limitForList = event.rows;

                    const data = await this.$store.dispatch("billing/onFetchVolumeWithProductId",{
                        offset: offset,
                        limit: this.row,
                        month: this.$route.query.month,
                        year: this.$route.query.year,
                        productId: this.$route.query.product_id
                    });
                    
                    updateList({offset: offset, row: limitForList, tempList: data.rows});
                } 
            },

            convertUTCToTime(time){
                return TimeConvert.formatUTCToDate(time);
            }
        }
    }
</script>