<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Volumes</h5>
                <p></p>
                <MyDataTable v-slot="mySlot" :initializeList="tempData" :total="length">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label>Search by Product name or reference</label>
                            <div class="p-fluid grid field">
                                <div class="col-8">
                                    <InputText type="search" v-model="searchFilter" placeholder="Product Name or Reference" />
                                </div>
                                <div class="col-4">
                                    <Button label="Submit" @click="onSearch(mySlot.updateReplaceAll)" style="float:end; max-width: 100px;"></Button>
                                </div>
                            </div>
                            
                        </div>
                        <div class="field col-0 md:col-6 "></div>
                    </div>

                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" :dataKey="mySlot.tmpId"
                    :rowHover="true" responsiveLayout="scroll" @page="$event=> onPage($event, mySlot.update)" :rowsPerPageOptions="[10,20,30]"
                    v-model:rows="row">
                        <template #header>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-6 md:col-6 sm:col-6">
                                </div>
                                <div class="field col-2 md:col-2 sm:col-6">
                                    <div class="justify-content-center" style="height=100%">
                                    </div>
                                </div>
                                <div class="field col-4 md:col-4"></div>
                            </div>
                        </template>

                        <template #empty>
                            <p>Empty...</p>
                        </template>

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
            <RetryField :toLoad="toLoadRetry" :message="messages" :retryToast="retryToast"></RetryField>
        </div>
    </div>
</template>

<script>
    import LinkParagraph from '../../components/LinkParagraph.vue';
    import MyDataTable from '../../components/MyDataTable.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';

    export default{
        created(){
            this.toLoadRetry = this.initData;
        },
        data(){
            return {
                toLoadRetry: null,
                tempData: [], 
                row: 10,
                length:0,
                searchFilter: null
            }
        },

        components:{
            MyDataTable,
            LinkParagraph,
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
            activateFilter(updateReplaceAll){
                this.toLoadRetry = async ()=>{
                    const data = await this.$store.dispatch("billing/onFetchVolume",{
                        offset: 0,
                        limit: this.row,
                        month: this.$route.query.month,
                        year: this.$route.query.year,
                        searchFilter: this.searchFilter
                    });
                    updateReplaceAll(data.rows);
                }
            },

            async onSearch(updateReplaceAll){
                if(this.searchFilter){
                    return this.activateFilter(updateReplaceAll);
                }
                this.toLoadRetry = this.initData;
            },
            
            async initData(){
                const volumeList = await this.$store.dispatch("billing/onFetchVolume",{
                    offset: 0,
                    limit: this.row,
                    month: this.$route.query.month,
                    year: this.$route.query.year,
                    searchFilter: this.searchFilter
                });
                this.length = volumeList.rows_total;

                this.tempData = volumeList.rows;
            },

            async onPage(event, updateList){
                this.toLoadRetry = async ()=>{
                    const data = await this.$store.dispatch("billing/onFetchVolume",{
                        offset: event.first,
                        limit: this.row,
                        month: this.$route.query.month,
                        year: this.$route.query.year,
                        searchFilter: this.searchFilter
                    });

                    const offset = event.first;
                    const limit = event.rows;

                    updateList({offset: offset, row: limit, tempList: data.rows});
                } 
            },

            pushing(data){
                this.$router.push({name: "volumeProductDetail", query: {product_id:data.product_id, ...this.$route.query}})
            }
        }
    }
</script>