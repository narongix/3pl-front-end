<template>
    <div class="d-flex grid">
        <div class="col-12">
            <div class="card">
                <h5>Extra Charges</h5>
                <Button label="Create" class="p-button-success mr-2" @click="createExtraCharge">
                </Button>
                <p></p>
                <DataTable :value="dataList" :paginator="true" class="p-datatable-sm" dataKey="tmpId"
                :rowHover="true" filterDisplay="menu" responsiveLayout="scroll"
                @page="onPage($event)" v-model:rows="rows"
                :rowsPerPageOptions="[10,20,30]">
                    <Column field="item_code" header="Item Code">
                        <template #body="{ data }">
                            <LinkParagraph :data="data.item_code" @pushing="linkToDetail(data)"></LinkParagraph>
                        </template>
                    </Column>
                    <Column field="description" header="Description"></Column>
                    <Column field="long_description" header="Long Description"></Column>
                    <Column field="amount" header="Amount"></Column>
                    <Column field="created_at" header="created_at">
                        <template #body="{ data }">
                            {{ converDate(data.created_at) }}
                        </template>
                    </Column>
                    
                </DataTable>
            </div>
        </div>
    </div>

    <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
</template>

<script>
    import LinkParagraph from '../../components/LinkParagraph.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';
import LocalStorageKeys from '../../domains/LocalStorageKeys';

    export default{
        created(){
            this.toLoad = this.initData;
        },
        components: { LinkParagraph, RetryField },
        data() {
            return {
                rows: 10,
                dataList: [],

                toLoad: null
            };
        },
        computed: {
            message() {
                return{
                    failed: "Error Loading Extra Charges, Try again",
                    yesButton: "Yes",
                    noButton: "No"
                }
            },
            errorToast(){
                return{
                    severity: "error",
                    summary: "Error!",
                    detail: "Error Loading Extra Charges"
                }
            },
        },
        methods: {
            createExtraCharge(){
                this.$router.push({name: "extraChargeCreate"})
            },

            linkToDetail(data){
                localStorage.setItem(LocalStorageKeys.tempExtraCharge, JSON.stringify(data))
                return this.$router.push({name: "extraChargeDetail", params:{id: data.id}});
            },

            async initData() {
                const extraCharge = await this.$store.dispatch("extraCharge/onFetchExtraCharges");
                
                this.dataList = extraCharge;
                
                // this.initList();
                // this.updateList({offset: pageNumber? pageNumber*this.rows : 0, row: this.rows, tempList: products});
            },

            onPage(event){
                event
            },
            initList(){
                this.dataList.length=0;
                for(let i=0; i<this.getTotalRecords; i++){
                    this.dataList.push({tmpId: i});
                }
            },

            updateList({ offset, row, tempList }) {
                let index = 0;
                for (let i = offset; i < row + offset; i++) {
                    if (!(tempList?.[index])) {
                        break;
                    }
                    const myId = this.dataList[i]?.tmpId;
                    this.dataList[i] = { tmpId: myId, ...tempList[index] };
                    index++;
                }
            },
            converDate(date) {
                return TimeConvert.formatUTCToDate(date);
            }
        },
        watch: {},
    }
</script>