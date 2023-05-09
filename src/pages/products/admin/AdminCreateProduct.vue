<template>
    <div>
        <CreateProductTemplate :onSubmit="onSubmit" :onInit="onInit" :additionalValidation="onValidate" 
        :productCategoryOption="prodCategories" :myUserId="userSelecter ?? userId"
        :onCreateProductCategoryRequireUserId="onVerifyUserId" @onResetValidation="onResetValidation"
        >
            <template #body>
                <div class="field col-12 md:col-12">
                    <label for="userId" :class="{'p-error': validationField.userSelecter.value}">Select User</label>
                    <UserDropDownPagination v-model:userSelector="userSelecter" :validation="validationField.userSelecter.value!=null"></UserDropDownPagination>
                    <small v-if="validationField.userSelecter.value" class="p-error">{{ validationField.userSelecter.value }}</small>
                </div>
            </template>
        </CreateProductTemplate>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MyToast from "../../../components/utils/MyToast";
    import CreateProductTemplate from '../components/CreateProductTemplate.vue';
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
    import RouteName from '../../../domains/Routename';

    export default{
        components: { CreateProductTemplate, UserDropDownPagination },
        data() {
            return {
                userSelecter: null,
                validationField:{
                    userSelecter:{
                        value: null,
                        validate: ()=>{
                            if(this.userSelecter){
                                return this.validationField.userSelecter.value = null;
                            }
                            this.validationField.userSelecter.value = "User cannot be empty";
                        }
                    }
                }
            };
        },

        computed:{
            ...mapGetters({
                userId: "auth/getUserId",
                getUserRole: "auth/getUserRole",
            }),

            prodCategories() {
                const prod = this.$store.getters['products/prodCategories'].filter((e)=>e.user_id == (this.userSelecter ?? e.user_id));
                return prod;
            },

            messages(){ 
                return {
                    failed: "Failed to create Product, Retry?",
                    yesButton: "Yes",
                    noButton: "No"                
                };
            },

            errorToast(){
                return MyToast.showFailedToast({
                    msg: "Failed Creating User!",
                    summary: "Error!"
                });
            },

            myLimit(){
                return 10;
            }
        },

        methods:{
            onVerifyUserId(){
                this.onValidate();
                return this.userSelecter;
            },
            onResetValidation(){
                for(let i in this.validationField){
                    this.validationField[i].value=null;
                }
            },
            async onInit(){
                await this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    limit: this.myLimit
                });
            },

            async onSubmit(newlyCreatedProduct){
                const newProduct = await this.$store.dispatch('products/addProduct', {newlyCreatedProduct: newlyCreatedProduct, userId: this.userSelecter});
                // TODO: Refactor this to push to admin product list instead
                await this.$router.push({name: RouteName.adminProductListPage, query: { id: newProduct.product_id, name: newProduct.product_name }});
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            },

            async onValidate(){
                const myList = [];
                for(const i in this.validationField){
                    this.validationField[i].validate();
                    myList.push(this.validationField[i].value);
                }
                const index = myList.findIndex((e)=>e);
                return index;
            }            
        },

        watch:{
            userSelecter:{
                immediate:true,
                async handler(newVal){
                    if(newVal){
                        try{
                        await this.$store.dispatch("products/getProdCategories", {
                            offset: 0,
                            userId: newVal
                        })
                        }catch(e){
                            console.log(e);
                        }
                    }
                }
            }
        },
    }
</script>