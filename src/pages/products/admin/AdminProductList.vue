<template>
    <ProductListTemplate 
    :onInit="myFunction" v-model:myRows="rows"
    :userId="userSelecter" :goToCreateProduct="goToCreateProductAdmin"
    :createMassProductUserId="userFieldForCreate"
    @massCreateNavigation="goToAdminImportTemplate"
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
    import RouteName from '../../../domains/Routename';
    
    export default{
        created(){
            this.myFunction= this.onInit;
        },
        components: { ProductListTemplate, UserDropDownPagination },
        data(){
            return {
                userFieldForCreate: null,
                myFilePopUp: false,
                myMassProducts: null,

                validationField:{
                    userFieldForCreate:{
                        value: null,
                        validate: ()=>{
                            if(this.userFieldForCreate){
                                return this.validationField.userFieldForCreate.value=null;
                            }
                            return this.validationField.userFieldForCreate.value="Cannot Be Empty";
                        }
                    }
                },

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
                    detail: "Failed Creating Products!"
                }   
            }
        },
        methods:{
            async goToAdminImportTemplate(){
                this.$router.push({name: RouteName.adminMassCreateProductPage});
            },
            async onConfirmCreateProduct(onMassCreateProducts){
                if(this.validate()){
                    await onMassCreateProducts(this.myMassProducts);
                    this.onSwitchStateDialog();
                }    
            },

            onCancelCreateProduct(){
                this.myMassProducts=null;
                this.clearValueImport();
                this.onSwitchStateDialog();
            },

            clearValueImport(){
                // Clear value of importing, otherwise it won't react to the same previous file
                document.getElementById('myImport').value = ''
            },

            goToCreateProductAdmin(){
                this.$router.push({name:"createProductAdmin"})
            },

            validate(){
                const list = [];
                for(let i in this.validationField){
                    this.validationField[i].validate();
                    list.push(this.validationField[i].value!=null);
                }
                const index = list.findIndex((e)=>e);
                return index<0
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