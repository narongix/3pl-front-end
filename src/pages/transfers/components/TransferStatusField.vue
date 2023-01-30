<template>
    <p v-if="convertToName" class="main" :class="convertToName">{{ convertToName }}</p>
</template>

<style scoped>
    .main{
        font-weight: 700;
        letter-spacing: 0.3px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        border-radius: 5px;
        padding: 5px 0;
    }

    .Draft{
        color: cornflowerblue;
    }

    .submitted{
      color: grey;
    }

    .Processing{
      color: yellow;
    }

    .Complete{
      color: forestgreen;
    }

    .Waiting{
      color: darkorange;
    }

    .Cancel{
      color: darkred;
    }
</style>

<script>
    import { transferStatus } from '../../../domains/domain';

    export default{
        props:{
            data:Object
        },

        computed:{
            convertToName(){
                const status = transferStatus?.[this.data?.transfer_status_id ?? 0]
                return status
            }
        }
    }
</script>