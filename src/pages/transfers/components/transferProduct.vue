<template>
    <a @click="pushing" style="cursor: pointer;">{{ data.product_id }}</a>
</template>

<script>
    export default{
        props: ["data", "props"],    
    }
    
</script>