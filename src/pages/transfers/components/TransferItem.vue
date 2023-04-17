<template>
    <a @click="pushing" style="cursor: pointer;">{{ data?.id }}</a>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { roleGroupId } from '../../../domains/domain';

    export default {
        props: ["data"],
        computed:{
            ...mapGetters({
                getUserRole: "auth/getUserRole"
            }),
            isAdmin(){
                return this.getUserRole == roleGroupId.Admin;
            },
        },
        methods:{
            pushing(){
                if(this.isAdmin){
                    this.$router.push({name: "AdminTransferDetail", params:{id: this.data?.id}});
                }else{
                    this.$router.push({name:"TransferDetail", params:{id: this.data?.id}});
                }
            }
        }
    }
</script>