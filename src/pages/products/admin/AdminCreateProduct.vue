<template>
    <div>
        <CreateProductTemplate @onSubmit="onSubmit" :onInit="onInit" :additionalValidation="onValidate">
            <template #body>
                <div class="field col-12 md:col-12">
                    <label for="userId">Select User</label>
                    <DropDownPagination v-model="userSelecter" :options="myUsersList" id="user" placeholder="Please select a user"
                    :validation="validationField.userSelecter.value" :whenLoad="getUsers" :limit="myLimit"
                    :whenSearch="findUsers" :maxLength="userMaxLength" :offset="offset ?? 0"
                    :disabled="false" optionLabel="full_name" optionValue="id" :showOption="option=>option.full_name"
                    >
                    </DropDownPagination>
                    <small>{{ validationField.userSelecter.value }}</small>
                </div>
            </template>
        </CreateProductTemplate>
    </div>
</template>

<script>
    import DropDownPagination from '../../../components/DropDownPagination.vue';
    import { mapGetters } from 'vuex';
    import MyToast from "../../../components/utils/MyToast";
    import CreateProductTemplate from '../components/CreateProductTemplate.vue';

    export default{
        data() {
            return {
                userSelecter: null,
                offset: 0,

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
                myUsersList: "user/getUser"
            }),

            messages(){ 
                return {
                    failed: "Failed to create Product, Retry?",
                    yesButton: "Yes",
                    noButton: "No"                
                };
            },

            userMaxLength(){
                return this.myUsersList.length;
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
            async onInit(){
                await this.$store.dispatch("user/fetchUser", {
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
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                await this.$router.push({ name: "productList", query: { id: newProduct.product_id, name: newProduct.product_name } });
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

        components: { DropDownPagination, CreateProductTemplate }
    }
</script>