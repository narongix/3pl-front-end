<template>
    <ExtraChargeBaseFormField v-slot="mySlot" :FieldNotActive="!onEditMode" v-model:data="myData" @onCreate="onValidate">
        <Button v-if="!onEditMode" @click="onEditMode=true" label="Edit"></Button>
        <Button v-if="onEditMode" @click="mySlot.onCreate()" label="Save"></Button>
        <Button v-if="onEditMode" @click="onCancel(mySlot.resetValidation)" label="Cancel" severity="secondary" class="ml-2"></Button>
    </ExtraChargeBaseFormField>

    <RetryField :toLoad="toLoad"></RetryField>
</template>

<script>
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import LocalStorageKeys from '../../domains/LocalStorageKeys';
    import ExtraChargeBaseFormField from './components/ExtraChargeBaseFormField.vue';

    export default{
        created() {
            this.myData = JSON.parse(localStorage.getItem(LocalStorageKeys.tempExtraCharge));
        },
        unmounted(){
            localStorage.removeItem(LocalStorageKeys.tempExtraCharge);
        },
        components: { ExtraChargeBaseFormField, RetryField },
        data() {
            return {
                onEditMode: false,
                toLoad: null,
                myData: null
            };
        },
        computed: {},
        methods: {
            initData(){
                this.$store.dispatch("extraCharge/")
            },
            onValidate(newlyUpdatedData){
                this.toLoad = async ()=>{
                    const newData = {
                        id: this.$route.params.id,
                        ...newlyUpdatedData
                    };
                    this.$store.dispatch("extraCharge/onUpdateExtraCharge", newData);
                    localStorage.setItem(LocalStorageKeys.tempExtraCharge, JSON.stringify(newData));
                    this.onEditMode=false;
                    this.$toast.add({severity:"success",summary:"Success", detail:"Extra Charge created successfully", life:2000})
                };
            },
            onCancel(resetValidation){
                this.myData = JSON.parse(localStorage.getItem(LocalStorageKeys.tempExtraCharge));
                resetValidation();
                this.onEditMode=false;
            }
        }
    }
</script>