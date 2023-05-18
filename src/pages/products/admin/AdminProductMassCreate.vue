<template>
    <MassCreateTemplate 
    @onPressImport="switchUserState" 
    :onValidate="onValidate"
    :getAllFields="getAllFields"
    >
        <template #importButton>
            <a href="/files/product_template.xlsx" download="product_template.xlsx">
                <Button class="mr-2" label="Download Template" severity="help">Download Template</Button>
            </a> 
        </template>
        <template #additionalFunction="mySlot">
            <Dialog v-model:visible="userSelectorDialog" header="Mass Create Products" modal :closable="true" @update:visible="mySlot.onDiscard()">
                <div class="formgrid grid">
                    <div class="field col-12">
                        <label :class="{'p-error': validationField.userFieldForCreate.value!=null}">Select User</label>
                        <UserDropDownPagination v-model="userFieldForCreate" :validation="validationField.userFieldForCreate.value!=null"></UserDropDownPagination>
                        <small class="p-error" v-if="validationField.userFieldForCreate.value">{{ validationField.userFieldForCreate.value }}</small>
                    </div>
                </div>
                <template #footer>
                    <Button severity="danger" label="Cancel" @click="onCancelCreateProduct"></Button>
                    <Button severity="success" label="Confirm" @click="onProceedToImport(mySlot.getPrepData)"></Button>
                </template>
            </Dialog>
        </template>

        <template #dialogColumn>
            <Column field="row" header="Index"></Column>
            <Column field="product_name" header="Product Name"></Column>
            <Column field="category_name" header="Category"></Column>
            <Column field="sku" header="Product Reference"></Column>
        </template>
    </MassCreateTemplate>
    <RetryField :toLoad="toLoad" errorToast="errorToast"></RetryField>
</template>

<script>
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
    import MassCreateTemplate from '../../../components/MassCreateTemplate.vue';
    import RouteName from "../../../domains/Routename";
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import mixin from '../../../domains/mixin';

    export default{
        mixins:[mixin.checkProductMassCreate],
        components: {
            MassCreateTemplate,
            UserDropDownPagination,
            RetryField
        },
        props:{
            myDataList: {
                type: [Array, null],
                default: ()=>([
                    {
                        categoryV2: "bottle4",
                        nameV2: "bottle123",
                        skuV2: "bottle43"
                    },
                    {
                        categoryV2: "bottle4",
                        nameV2: "medium bottle123",
                        skuV2: "bottle342"
                    }
                ])
            }
        },
        data() {
            return{
                toLoad: null,

                userFieldForCreate: null,
                userSelectorDialog: false,

                validationField: {
                    userFieldForCreate:{
                        value: null,
                        validate: ()=>{
                            if(this.userFieldForCreate){
                                return this.validationField.userFieldForCreate.value=null;
                            }
                            return this.validationField.userFieldForCreate.value="Cannot Be Empty";
                        }
                    }
                }
            };
        },
        methods: {
            onCancelCreateProduct(){                
                this.switchUserState();
            },

            switchUserState(){
                this.userSelectorDialog = !this.userSelectorDialog;
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

            async onProceedToImport(getPrepData){
                if(this.validate()){
                    this.toLoad = async ()=>{
                        this.switchUserState();
                        const prepData = getPrepData();
                        const newProuctListToCreate = prepData.filter((e)=>e.reason.length==0);
                        const data = await this.$store.dispatch("products/addMassProduct",{
                            userId: this.userFieldForCreate,
                            products: newProuctListToCreate
                        });
                        this.onFinishImport(data.errorList, data.successList, prepData.length)
                    }
                }
            },

            onFinishImport(errorList, successList, total){
                const myFailedProduct = JSON.stringify(errorList);
                const mySuccessProduct = JSON.stringify(successList);

                this.$router.replace({name: RouteName.adminProductListPage, query:{
                    errorList: myFailedProduct,
                    successList: mySuccessProduct,
                    total: total
                }})
            }
        }
    }
</script>