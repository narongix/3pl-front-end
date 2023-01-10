<template>
    <slot :onLoad="onLoad"></slot>
</template>

<script>
    export default{
        props:{
            limit: number
        },
        data(){
            return {
                offset:0,
            }
        },
        actions:{
            onLoad(){
                this.offset=this.offset+this.limit
                return this.offset
            }
        }
    }
</script>