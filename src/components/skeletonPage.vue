<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Volumes</h5>
                <p></p>
                <MyDataTable v-slot="mySlot" :initializeList="myArrayMaxLength">
                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" dataKey="id"
                    :rowHover="true" responsiveLayout="scroll" @page="$event=> onPage($event, mySlot.update)" :rowsPerPageOptions="[10,20,30]"
                    v-model:rows="row" >
                        <Column field="" header=""></Column>
                        <Column field="" header=""></Column>
                        <Column field="" header=""></Column>
                        <Column field="" header=""></Column>
                        <Column field="" header=""></Column>
                        <Column field="" header=""></Column>
                    </DataTable>
                </MyDataTable>
            </div>
        </div>
        <HiddenRetryField :toLoad="toLoadRetry" :message="messages" :retryToast="retryToast"></HiddenRetryField>
    </div>
</template>

<script>
    import MyDataTable from '../../components/MyDataTable.vue';
    import HiddenRetryField from '../../components/prompt_field/HiddenRetryField.vue';

    export default{
        created(){
            this.toLoadRetry = this.initData;
        },
        data(){
            return {
                toLoadRetry: null,
                myArrayMaxLength: null, 
                row: 10
            }
        },

        components:{
            HiddenRetryField,
            MyDataTable
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
                const volumeList = await this.$store.dispatch("billing/onFetchVolume",{
                    offset: 0,
                    limit: this.row,
                    month: this.$route.query.month,
                    year: this.$route.query.year
                });
                this.myArrayMaxLength = volumeList;
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

                    updateList({offset: offset, row: limit, tempList: data.rows});
                } 
            },
        }
    }
</script>