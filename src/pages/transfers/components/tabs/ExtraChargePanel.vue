<template>
    <DataTable :value="myExtraChargeData"
        :paginator="true" 
        class="p-datatable-sm" 
        :rows="innerExtraChargeRow" 
        dataKey="tmpId"
        :rowHover="true" 
        filterDisplay="menu" 
        responsiveLayout="scroll"
        :rowsPerPageOptions="[10, 20, 30]" 
        >
        <template #empty>
            Empty...
        </template>
            <Column field="item_code" header="Item Code"></Column>
            <Column field="description" header="description"></Column>

            <Column field="amount" header="Amount"></Column>
            <Column field="long_description" header="Full Description" style="min-width: 15rem;"></Column>
            <Column field="created_at" header="Created">
                <template #body="{ data }">
                    <p>{{ convertUTCToNormal(data.created_at) }}</p>
                </template>
            </Column>
            <slot>

            </slot>
    </DataTable>
</template>
<script>
    import TimeConvert from '../../../../components/utils/TimeConvert';

    export default{
        props:{
            myExtraChargeData: Array,
        },
        computed:{
            getExtraCharges(){
                // TODO when we have extra charge here, let change the query
                const data = this.$store.getters["extracharge/getExtraCharges"];
                return data;
            }
        },
        data(){
            return {
                innerExtraChargeRow: 10,
            };
        },
        methods:{
            convertUTCToNormal(date){
                return TimeConvert.formatUTCToDate(date);
            }
        }
    }
</script>