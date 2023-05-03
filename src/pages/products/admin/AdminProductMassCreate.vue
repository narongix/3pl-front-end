<template>
    <ProductMassCreateTemplate 
    :getUserId="userFieldForCreate" 
    @onPressImport="switchUserState" 
    @onFinishImport="onFinishImport" 
    v-slot="mySlot">
        <Dialog v-model:visible="userSelectorDialog" header="Mass Create Products" modal :closable="true" @update:visible="clearValueImport()">
            <div class="formgrid grid">
                <div class="field col-12">
                    <label :class="{'p-error': validationField.userFieldForCreate.value!=null}">Select User</label>
                    <UserDropDownPagination v-model="userFieldForCreate" :validation="validationField.userFieldForCreate.value!=null"></UserDropDownPagination>
                    <small class="p-error" v-if="validationField.userFieldForCreate.value">{{ validationField.userFieldForCreate.value }}</small>
                </div>
            </div>
            <template #footer>
                <Button severity="danger" label="Cancel" @click="onCancelCreateProduct"></Button>
                <Button severity="success" label="Confirm" @click="onProceedToImport(mySlot.proceedWithImportOperation)"></Button>
            </template>
        </Dialog>
    </ProductMassCreateTemplate>
</template>

<script>
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';
    import ProductMassCreateTemplate from '../components/ProductMassCreateTemplate.vue';
    import RouteName from "../../../domains/Routename";

    export default{
        components: { 
            ProductMassCreateTemplate, 
            UserDropDownPagination 
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
        computed: {},
        methods: {
            onCancelCreateProduct(){                
                this.switchUserState();
            },

            onProceedToImport(proceedWithImportOperation){
                if(this.validate()){
                    this.switchUserState();
                    proceedWithImportOperation();
                }
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

            onFinishImport(errorList, total){
                const myParam = JSON.stringify(errorList);
                this.$router.replace({name: RouteName.adminProductListPage, query:{
                    errorList: myParam,
                    total: total
                }})
            }
        }
    }
</script>