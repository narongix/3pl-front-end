<template>
    <DataTable :value="innerExtraCharge"
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

            <!-- <Column v-if="!FieldNotActive" header="Actions" style="min-width:12rem">
                <template #body="props">
                    <Button v-if="props?.data?.draft" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="onDeleteExtraCharge(props)" />
                </template>
            </Column> -->
    </DataTable>
</template>
<script>
    export default{
        props:{
            mySecondExtraCharge: Array,
        },
        emits:["update:mySecondExtraCharge"],
        computed:{
            innerExtraCharge:{
                get(){
                    return this.mySecondExtraCharge;
                },
                set(newValue){
                    return this.$emit("update:mySecondExtraCharge", newValue);
                }
            },

            getExtraCharges(){
                // TODO when we have extra charge here, let change the query
                const data = this.$store.getters["extracharge/getExtraCharges"];
                return data;
            },
        },
        data(){
            return {
                innerExtraChargeRow: 10,
            };
        },
        methods:{
            onDeleteExtraCharge(prop){
                this.innerExtraCharge.splice(prop.index, 1);
            },
        }
    }

</script>