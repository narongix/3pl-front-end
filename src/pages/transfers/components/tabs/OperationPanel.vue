<template>
    <DataTable :value="myOperationData"
    :paginator="true" 
    class="p-datatable-sm" 
    :rows="myRows" 
    dataKey="tmpId"
    :rowHover="true" 
    filterDisplay="menu" 
    responsiveLayout="scroll"
    :rowsPerPageOptions="[10, 20, 30]" 
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
</template>

<script>
import { defineComponent } from 'vue';
import TimeConvert from '../../../../components/utils/TimeConvert';
import { movementType } from '../../../../domains/domain';

    export default defineComponent({
        props:{
            myOperationData: Array,
        },
        data(){
            return {
                myRows: 10,
            }
        },
        methods:{
            convertUTCToNormal(date){
                return TimeConvert.formatUTCToDate(date);
            },
            convertMovementType(id){
                return movementType[id];
            }
        }
    })
</script>