<template>
    <DropDownPagination v-model="myValue" :options="getUsers" :optionLabel="optionLabel" :optionValue="optionValue"
    :disabled="false" id="id" inputId="id" placeholder="Please select a user" 
    :whenLoad="onLoadUser" :limit="getUserLimit" :whenSearch="findUser"
    :maxLength="getUserLength" :showClear="true"
    :errorToastLoading="errorToastLoadingUsers" :messageLoad="messageLoadUser"
    :showOption="option => option.full_name"
    >
    </DropDownPagination>
</template>

<script>
    import { mapGetters } from 'vuex';
    import DropDownPagination from './DropDownPagination.vue';

    export default{
        props:{
            userSelector: null,
            loading: String,
            errorLoad: String,
            rows: Number,
            optionLabel:{
                type: String,
                default: "full_name",
            },
            optionValue:{
                type: String,
                default: "id"
            }
        },
        emits:["update:userSelector"],
        components:{
            DropDownPagination
        },
        computed:{
            ...mapGetters({
                getUsers: "user/getUser",
                getUserLength: "user/getUserLength",
                getUserLimit: "user/getUserLimit",
            }),
            myValue:{
                get(){
                    return this.userSelector;
                },
                set(newValue){
                    return this.$emit('update:userSelector', newValue);
                }
            },

            messageLoadUser(){
                return {
                    failed: "Error loading Users, retry?",
                    yesButton: "Yes",
                    noButton: "No",
                };
            },

            errorToastLoadingUsers(){
                return{
                    severity:"error",
                    summary: "Error!",
                    detail: "Failed Loading Users!"    
                };
            },
        },
        methods:{
            async findUser(filterValue) {
                await this.$store.dispatch("user/fetchUser", {
                    offset: 0,
                    userName: filterValue,
                    limit: this.rows
                });
            },

            async onLoadUser(offset){
                const users = await this.$store.dispatch("user/fetchUser", {
                    offset: offset,
                    limit: this.rows,
                });

                return users.length;
            },  
        }
    }
</script>
