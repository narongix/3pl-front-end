<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Volumes</h5>
                <p></p>
                <MyDataTable v-slot="mySlot" :initializeList="tempData">
                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" dataKey="id"
                    :rowHover="true" responsiveLayout="scroll" @page="$event=> onPage($event, mySlot.update)" :rowsPerPageOptions="[10,20,30]"
                    v-model:rows="row" >
                        <Column field="product_name" header="Product Name">
                            <template #body="{ data }">
                                <LinkParagraph :data="data.product_name" @pushing="pushing(data)"></LinkParagraph>
                            </template>
                        </Column>
                        <Column field="total_volume" header="Total Volume"></Column>
                        <Column field="rate" header="Rate"></Column>
                        <Column field="total_volume_fee" header="Total Volume Fee"></Column>
                    </DataTable>
                </MyDataTable>
            </div>
            <HiddenRetryField :toLoad="toLoadRetry" :message="messages" :retryToast="retryToast"></HiddenRetryField>
        </div>
    </div>
</template>

<script>
    import LinkParagraph from '../../components/LinkParagraph.vue';
import MyDataTable from '../../components/MyDataTable.vue';
    import HiddenRetryField from '../../components/prompt_field/HiddenRetryField.vue';

    export default{
        created(){
            this.toLoadRetry = this.initData;
        },
        data(){
            return {
                toLoadRetry: null,
                tempData: [], 
                row: 10
            }
        },

        components:{
            HiddenRetryField,
            MyDataTable,
            LinkParagraph
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
            //TODO: Figure out why the loading doesn't appear
            async initData(){
                const volumeList = await this.$store.dispatch("billing/onFetchVolume",{
                    offset: 0,
                    limit: this.row,
                    month: this.$route.query.month,
                    year: this.$route.query.year
                });
                this.tempData = volumeList;
            },

            async onPage(event, updateList){
                this.toLoadRetry = async ()=>{
                    const data = await this.$store.dispatch("billing/onFetchVolume",{
                        offset: event.first,
                        limit: this.row,
                        month: this.$route.query.month,
                        year: this.$route.query.year,
                    });

                    const offset = event.first;
                    const limit = event.rows;

                    updateList({offset: offset, row: limit, tempList: data});
                } 
            },

            pushing(data){
                this.$router.push({name: "volumeProductDetail", query: {product_id:data.product_id, ...this.$route.query}})
            }
        }
    }
</script>