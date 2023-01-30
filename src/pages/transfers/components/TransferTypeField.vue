<template>
    <p class="special">{{ converToName }}</p>
</template>

<style scoped>
    .special{
        font-weight: 700;
    }
</style>

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