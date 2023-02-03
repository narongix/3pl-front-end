<template>
    <p>{{ converToName }}</p>
</template>

<script>
    import { transferType } from '../../../domains/domain';

    export default{
        props:{
            data: Object
        },
        computed:{
            converToName(){
                return transferType?.[this.data.transfer_type_id] ?? "Error"
            }
        }
    }
</script>