<template>
    <DataTable :value="dataList"
    :paginator="true" 
    class="p-datatable-sm" 
    :rows="myRows" 
    dataKey="tmpId"
    :rowHover="true" 
    filterDisplay="menu" 
    responsiveLayout="scroll"
    :rowsPerPageOptions="[10, 20, 30]"
    @page="onPage"
    >
    <template #empty>
        Empty...
    </template>
        <Column field="reference" header="Reference" style="min-width: 8rem;"></Column>
        <Column field="odoo_reference" header="Odoo Reference" style="min-width: 15rem;"></Column>
        <Column field="movement_type_id" header="Movement Type" style="min-width: 8rem;">
            <template #body="{ data }">
            <p>{{ convertMovementType(data.movement_type_id) }}</p>
            </template>
        </Column>
        <Column field="product_id" header="Product Id" style="min-width: 8rem;"></Column>
        <Column field="serial" header="Serial" style="min-width: 15rem;"></Column>
        <Column field="qty" header="Quantity" style="min-width: 8rem;"></Column>
        <Column field="source" header="Source" style="min-width: 8rem;"></Column>
        <Column field="destination" header="destination" style="min-width: 8rem;"></Column>
        <Column field="created_at" header="Created" style="min-width: 15rem;">
            <template #body="{ data }">
                <p>{{ convertUTCToNormal(data.created_at) }}</p>
            </template>
        </Column>
    </DataTable>
    <RetryField :toLoad="toLoad" :errorToast="errorToast"></RetryField>
</template>

<script>
    import { defineComponent } from 'vue';
    import TimeConvert from '../../../../components/utils/TimeConvert';
    import { movementType } from '../../../../domains/domain';
    import myMixin from '../../../../domains/mixin';
    import RetryField from '../../../../components/prompt_field/RetryField.vue';

    export default defineComponent({
        mixins: [myMixin.myDataTable],
        components: { 
            RetryField 
        },
        props: {
            myOperationData: Array,
            rowTotal: Number
        },
        data() {
            return {
                myRows: 10,
                toLoad: null,
            };
        },
        computed:{
            errorToast(){
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Loading!",
                    life: 1000
                };
            }
        },
        methods: {
            convertUTCToNormal(date) {
                return TimeConvert.formatUTCToDate(date);
            },
            convertMovementType(id) {
                return movementType[id];
            },
            onPage(event) {
                this.toLoad = async () => {
                    const offset = event.first;
                    const limitForList = event.rows;

                    const data = await this.$store.dispatch("transfers/getOperationTransfers", {
                        transferId: this.$route.params.id,
                        offset: offset, 
                        limit: this.row,
                    });

                    this.updateList({offset: offset, row: limitForList, tempList: data.rows});
                };
            }
        },
        watch:{
            myOperationData:{
                handler(newValue){
                    this.initList(this.rowTotal);
                    this.updateList({offset: 0, row: this.myRows, tempList: newValue});
                }
            }
        }
    })
</script>