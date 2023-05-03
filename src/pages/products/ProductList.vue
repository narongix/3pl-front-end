<template>
    <ProductListTemplate
    v-model:myRows="rows"
    :userId="getUserId"
    :createMassProductUserId="getUserId"
    :goToCreateProduct="goToCreateProductPage"
    @massCreateNavigation="goToImportTemplate"
    >

    </ProductListTemplate>
</template>

<script>
    import { mapGetters } from 'vuex';
    import ProductListTemplate from './components/ProductListTemplate.vue';
    import RouteName from '../../domains/Routename';

    export default{
        data(){
            return {
                rows: 10,
            };
        },
        components: { ProductListTemplate },
        computed:{
            ...mapGetters({
                getUserId: "auth/getUserId"
            })
        },
        methods:{
            async onPickedFile(products, createMass){
                await createMass(products);
            },

            goToCreateProductPage(){
                return this.$router.push({name: RouteName.createProductPage});
            },
            goToImportTemplate(){
                this.$router.push({name: RouteName.massCreatePage})
            }
        }
    }
</script>