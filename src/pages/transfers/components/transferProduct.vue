<template>
    <a @click="pushing" style="cursor: pointer;">{{ data.product_id }}</a>
</template>

<script>
    props=["data", "props"]
</script>