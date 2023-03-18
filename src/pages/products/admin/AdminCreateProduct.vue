<template>
    <div>
        <CreateProductPage>
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
        <RetryField :toLoad="toLoadRetry" :message="messages" :errorToast="errorToast"></RetryField>
    </div>
</template>

<script>
    import CreateProductPage from '../CreateProductPage.vue';
    import DropDownPagination from '../../../components/DropDownPagination.vue';
    import { mapGetters } from 'vuex';
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import MyToast from "../../../components/utils/MyToast";

    export default{
        created(){
            this.RetryField = this.initData;
        },

        data() {
            return {
                toLoadRetry: null,
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
            
            initData(){
                this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    limit: this.myLimit
                });
            },

            getUsers(offset){
                this.toLoadRetry = async ()=>{
                    await this.$store.dispatch("user/fetchUser", {
                        offset: offset,
                        limit: this.myLimit
                    });
                };
            },

            async findUsers(filterValue){
                await this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    userName: filterValue
                });
            },

            Submit(){

            }
        },

        components: { CreateProductPage, DropDownPagination, RetryField }
    }
</script>