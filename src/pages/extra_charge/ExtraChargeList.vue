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
                @page="onPage" v-model:rows="rows"
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
                    
                    <Column header="Action">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.id" icon="pi pi-trash" class="p-button-rounded p-button-warning ma-0"
                                @click="onPromptDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="extraChargeDeleteDialog" :style="{ width: '450px' }" header="Confirm"
        :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Are you sure you want to delete <b>{{ extraChargeDelete.item_code }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text"
                @click="extraChargeDeleteDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="onConfirmDelete" />
        </template>
    </Dialog>
    <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
</template>

<script>
    import LinkParagraph from '../../components/LinkParagraph.vue';
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../components/utils/TimeConvert';
    import LocalStorageKeys from '../../domains/LocalStorageKeys';
    import myMixin from '../../domains/mixin';

    export default{
        mixins:[myMixin.myDataTable],
        created(){
            this.toLoad = this.initData;
        },
        components: { LinkParagraph, RetryField },
        data() {
            return {
                rows: 10,

                extraChargeDelete: null,
                extraChargeDeleteDialog:false,

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
            onPromptDelete(extraCharge){
                this.extraChargeDelete = extraCharge;
                this.extraChargeDeleteDialog = true;
            },

            onConfirmDelete(){
                this.toLoad = async ()=>{
                    this.extraChargeDeleteDialog=false;
                    await this.$store.dispatch("extraCharge/onDeleteExtraCharge", this.extraChargeDelete.id);
                    this.deleteElement({key: "id", id: this.extraChargeDelete.id});
                    this.extraChargeDelete=null;
                    
                };
            },

            createExtraCharge(){
                this.$router.push({name: "extraChargeCreate"})
            },

            linkToDetail(data){
                localStorage.setItem(LocalStorageKeys.tempExtraCharge, JSON.stringify(data))
                return this.$router.push({name: "extraChargeDetail", params:{id: data.id}});
            },

            async initData() {
                const extraCharge = await this.$store.dispatch("extraCharge/onFetchExtraCharges",{
                    limit: this.rows,
                    offset: 0
                });
                this.initList(extraCharge.rows_total);
                this.updateList({offset: 0, row: this.rows, tempList: extraCharge.rows});
            },

            onPage(event){
                this.toLoad = async ()=>{
                    const data = await this.$store.dispatch("extraCharge/onFetchExtraCharges", {
                        limit: this.rows,
                        offset: event.first
                    });

                    const offset= event.first;
                    const limit = event.rows;  

                    this.updateList({offset: offset, row:limit, tempList: data.rows});
                };
            },

            converDate(date) {
                return TimeConvert.formatUTCToDate(date);
            }
        }
    }
</script>