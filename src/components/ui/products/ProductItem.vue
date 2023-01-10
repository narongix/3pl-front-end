<template>
    <router-link :to="productLink">{{ data.barcode}}</router-link>
</template>
<script>
export default {
    props: ['data'],
    computed: {
       productLink() {
            return this.$route.path + '/' + this.data.id;
        }
    }
}
</script>