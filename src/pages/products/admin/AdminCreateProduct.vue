<template>
    <div>
        <CreateProductPage @onSubmit="onSubmit" @onInit="onInit">
            <template #body>
                <div class="field col-12 md:col-12">
                    <label for="userId">Select User</label>
                    <DropDownPagination v-model="userSelecter" :options="getUsers" id="user" placeholder="Please select a user"
                    :validation="validationField.userSelecter.value" :whenLoad="getUsers" :limit="myLimit"
                    :whenSearch="findUsers" :maxLength="userMaxLength" :showValue="showValueUser" :offset="offset ?? 0">
                    :disabled="true"
                    </DropDownPagination>
                    <small>{{ validationField.userSelecter.value }}</small>
                </div>
            </template>
        </CreateProductPage>
    </div>
</template>

<script>
    import CreateProductPage from '../CreateProductPage.vue';
    import DropDownPagination from '../../../components/DropDownPagination.vue';
    import { mapGetters } from 'vuex';
    import MyToast from "../../../components/utils/MyToast";

    export default{
        data() {
            return {
                userSelecter: null,
                offset: 0,

                validationField:{
                    userSelecter:{
                        value: null,
                        myFunction: ()=>{
                            if(this.userSelecter){
                                return this.validationField1.value = null;
                            }
                            this.validationField1.value = "User cannot be empty";
                        }
                    }
                }
            };
        },

        computed:{
            ...mapGetters({
                getUsers: "user/getUser"
            }),

            messages(){ 
                return {
                    failed: "Failed to create Product, Retry?",
                    yesButton: "Yes",
                    noButton: "No"                
                };
            },

            userMaxLength(){
                return this.getUsers.length;
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
            showValueUser(value){
                return value ?? "Empty";
            },
            
            onInit(){
                this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    limit: this.myLimit
                });
            },

            async getUsers(offset){
                await this.$store.dispatch("user/fetchUser", {
                    offset: offset,
                    limit: this.myLimit
                });
            },

            async findUsers(filterValue){
                await this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    userName: filterValue
                });
            },

            async onSubmit(newlyCreatedProduct){
                const newProduct = await this.$store.dispatch('products/addProduct', {newlyCreatedProduct: newlyCreatedProduct, userId: this.userSelecter});
                // TODO: Refactor this to push to admin product list instead
                await this.$router.push({ name: "productList", query: { id: newProduct.product_id, name: newProduct.product_name } });
            }
        },

        components: { CreateProductPage, DropDownPagination }
    }
</script>