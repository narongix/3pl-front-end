<template>
    <ProductListTemplate 
    :onInit="myFunction" v-model:myRows="rows"
    :userId="userSelecter" :goToCreateProduct="goToCreateProductAdmin"
    >
        <template #filter="mySlot">
            <div class="field col-12 md:col-4 lg:col-3">
                <label>User</label>
                <UserDropDownPagination v-model="userSelecter" @change="onChange(mySlot.searchProduct)"></UserDropDownPagination>
            </div>
        </template>
    </ProductListTemplate>
</template>

<script>
    import ProductListTemplate from '../components/ProductListTemplate.vue';
    import { mapGetters } from 'vuex';
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
    
    export default{
        created(){
            this.myFunction= this.onInit;
        },
        components: { ProductListTemplate, UserDropDownPagination },
        data(){
            return {
                userSelecter: null,
                toLoadRetry: null,
                rows: 10,
                myFunction: null
            }
        },
        computed:{
            ...mapGetters({
                getProductLength: "products/getProductLength",
            }),

            products(){
                const newList = this.$store.getters["products/getProductState"].filter((e)=>e.user_id == this.userSelecter);
                return newList;
            },

            errorLoading() {
                return{
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Deleting Product!"
                }       
            }
        },
        methods:{
            goToCreateProductAdmin(){
                this.$router.push({name:"createProductAdmin"})
            },

            async onInit() {
                await this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    limit: 10,
                });
            },

            onChange(search){
                search(this.userSelecter);
            }
        }
    }
</script>