<template>
    <router-link :to="categoriesLink">{{ data.category_name }}</router-link>
</template>
<script>
export default {
    props: ['data'],
    computed: {
        categoriesLink() {
            return this.$route.path + '/' + this.data.id;
        }
    }
}
</script>