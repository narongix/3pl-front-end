<template>
    <ExtraChargeBaseFormField labelCreateButton="Create" v-model:data="myData" @on-create="onCreate">

    </ExtraChargeBaseFormField>
    <RetryField :toLoad="toLoad" :errorToast="errorToast"></RetryField>
</template>

<script>
import RetryField from '../../components/prompt_field/RetryField.vue';
import LocalStorageKeys from '../../domains/LocalStorageKeys';
import ExtraChargeBaseFormField from './components/ExtraChargeBaseFormField.vue';

    export default{
    created() {
    },
    data() {
        return {
            toLoad: null,
            myData:{}
        };
    },
    computed: {
        errorToast(){
            return {
                severity: "error",
                summary: "Error!",
                detail: "Failed creating a new Extra Charge",
                life: 2000
            };
        }
    },
    methods: {
        async onCreate(myData){
            this.toLoad = async ()=>{
                const data = await this.$store.dispatch("extraCharge/onAddExtraCharge", myData);
                localStorage.setItem(LocalStorageKeys.tempExtraCharge, JSON.stringify(data));
                
                await this.$router.replace({name: "extraChargeDetail", params: {id: data.id}});
                this.$toast.add({severity:"success",summary:"Success", detail:"Extra Charge created successfully", life: 2000});
            };
        }
    },
    components: { ExtraChargeBaseFormField, RetryField }
}
</script>