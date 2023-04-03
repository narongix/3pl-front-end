<template>
    <p>{{ converToName }}</p>
</template>

<script>
    import { transferTypeId } from '../../../domains/domain';

    export default{
        props:{
            data: Object
        },
        computed:{
            converToName(){
                return transferTypeId?.[this.data?.transfer_type_id] ?? null
            }
        }
    }
</script>