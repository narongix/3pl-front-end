<template>
    <DropDownPagination v-model="myValue" :options="getUsers" :optionLabel="optionLabel" :optionValue="optionValue"
    :disabled="disabled" id="id" inputId="id" placeholder="Please select a user" 
    :whenLoad="onLoadUser" :limit="getUserLimit" :whenSearch="findUser"
    :showClear="true"  :class="myClass"
    :errorToastLoading="errorToastLoadingUsers" :messageLoad="messageLoadUser"
    :showOption="option => option.full_name" :validation="validation" @change="onChange"
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
            },
            myClass: String,
            validation:{
                type: Boolean,
                default: false
            },
            disabled:{
                type: Boolean,
                default: false
            }
        },
        emits:["update:userSelector", "onChange"],
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
                    searchString: filterValue,
                    limit: this.rows
                });
            },

            async onLoadUser(offset, filterValue){
                const users = await this.$store.dispatch("user/fetchUser", {
                    offset: offset,
                    limit: this.rows,
                    searchString: filterValue,
                });

                return users.length;
            },  

            onChange(event){
                this.$emit('onChange', event)
            }
        }
    }
</script>
