<template>
    <BaseFieldForm
    :baseData="baseData"
    @onClickSubmit="onFormSubmit"
    :FieldNotActive="FieldNotActive"
    :disabledField="disabledField"
	:myUserId="myUserId"
    v-model:myCustomUserId="myCustomUserId"
    :popup="myPopUp" :vanishField="vanishField"
    :tabViewDisabled="tabViewDisabled"
    :editMode="false"
    >
        <template #myTop>
            <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
        </template>    

		<template #orderedButton="mySlot">
			<div class="col-12 md:col-12 lg:col-12">
                <div class="flex">
                    <Button v-if="!FieldNotActive" :label="baseData.buttonSubmit" class="flex-none fixedWidthButton p-button-success mr-2 mb-2" @click="mySlot.popUpProductDialog"></Button>
                    <Button label="Import Products" @click="navigateToMassImport(mySlot.data, mySlot.validation)" class="flex-none fixedWidthButton p-button-secondary mr-2 mb-2"></Button>
                </div>
            </div>
		</template>

        <template #myButton="mySlot">
            <Button label="Create" class="p-button-success mr-2" @keyup.enter="mySlot.onClick" @click="mySlot.onClick"/>
            <Button v-show="myErrorList.length>0" label="Show Not Found" class="p-button-secondary mr-2" @click="changeNotFoundDialogState"></Button>
            <Button v-show="errorList2.length>0" label="Error Products" severity="danger" class="mr-2" @click="changeCantCreateProductState"></Button>
        </template>

        <template #dialog="mySlot">
            <ImportResultDialog v-model="myNotFoundDialog" :successList="mySuccessList" :errorList="myErrorList" header="Products Result">
                <template #dialogButton>
                    <slot name="dialogButton">
                        <Button @click="onClickMassCreate(mySlot.data)" label="Create Product" severity="success" class="mb-4"></Button>
                    </slot>
                </template>
                <template #columns="mySlot">
                    <Column field="product_name" header="Product Name" style="min-width: 12rem;"></Column>
                    <Column field="category_name" header="Category" style="min-width:5rem"></Column>
                    <Column field="sku" header="Product Reference" style="min-width:12rem"></Column>
                    <Column field="demand" header="Demand" style="min-width:5rem"></Column>
                    <Column field="status" header="Status">
                        <template #body>
                            <div class="flex align-items-center justify-content-center">
                                <font-awesome-icon v-if="mySlot.errorList.length==0" :icon="['fas', 'check']" />
                                <font-awesome-icon v-else :icon="['fas', 'xmark']" />
                            </div>
                        </template>
                    </Column>
                </template>
            </ImportResultDialog>
            <ImportResultDialog v-model="myCantCreateProductDialog" :successList="successList2" :errorList="errorList2" header="Products Creation Result">
                <template #columns="mySlot">
                    <Column field="product_name" header="Product Name" style="min-width: 12rem;"></Column>
                    <Column field="category_name" header="Category" style="min-width:5rem"></Column>
                    <Column field="sku" header="Product Reference" style="min-width:12rem"></Column>
                    <Column field="status" header="Status">
                        <template #body>
                            <div class="flex align-items-center justify-content-center">
                                <font-awesome-icon v-if="mySlot.errorList.length==0" :icon="['fas', 'check']" />
                                <font-awesome-icon v-else :icon="['fas', 'xmark']" />
                            </div>
                        </template>
                    </Column>
                </template>
            </ImportResultDialog>
        </template>

    </BaseFieldForm>


</template>

<style src="../../assets/styles/style.css">
</style>

<script>
    import BaseFieldForm from './components/BaseFormField.vue'
    import { mapGetters } from 'vuex'
    import RetryField from '../../components/prompt_field/RetryField.vue'
    import { roleGroupId } from '../../domains/domain';
    import RouteName from '../../domains/Routename';
    import ImportResultDialog from '../../components/ImportResultDialog.vue';

    export default{
        async created(){
            this.toLoad = this.initData
        },
        emits:["onClickCreate"],
        data(){
            return{
                errorList2: [],
                successList2: [],
                // errorList: [],
                // successList: [],

                myCustomUserId: null,
                myNotFoundDialog: false,
                myCantCreateProductDialog: false,

                baseData:{
                    titleForm: "Add New Transfer",
                    buttonSubmit: "Add Product"
                },

                disabledField:{
                    scheduleDate:false,
                    recipient: false,
					shipper: true,
					source: false,
                    transfer_type_id: false,
					destination: false,
                    reference: false
                },
                
                vanishField: {
					scheduleDate: false,
					recipient: false,
					source: false,
					transfer_type_id: false,
					destination: false,
					reference: false,
					userSelector: false,
				},

                FieldNotActive: false,

                toLoad:null,
				message:{
					failed: "Error Loading Data. Try again?",
					yesButton: "Yes",
					noButton: "No"
				},
                errorToast:{
                    severity: "error",
                    summary: "Failed",
                    detail: "Error Creating Transfer",
                    life: 3000
                }
            }
        },

        components:{
            BaseFieldForm,
            RetryField,
            ImportResultDialog
        },

        computed:{
            ...mapGetters({
                products: "products/getProductState",
                myUserId: "auth/getUserId",
                userRole: "auth/getUserRole",
                myErrorList: "transferCreateState/getErrorList",
                mySuccessList: "transferCreateState/getSuccessList"
            }),

            myPopUp(){
                return {
                    header: "Product Quantity",
                    productDemandDisplay: "Quantity"
                }
            },
            
            tabViewDisabled(){
				return {
					ordered: false,
					operations: true,
					extraCharge: true,
				};
			}
        },
        
        methods:{
            onClickMassCreate(data){
                this.toLoad = async()=>{
                    this.changeNotFoundDialogState();
                    const res = await this.$store.dispatch("products/addMassProduct", {
                        products: this.myErrorList,
                        userId: this.myCustomUserId
                    });
                    this.$store.dispatch('transferCreateState/onClearAll');
                    this.successList2 = res.successList;
                    this.errorList2 = res.errorList;

                    data.transferProducts.push(...this.successList2)
                    
                    if((this.errorList2?.length ?? 0)>0){
                        this.changeCantCreateProductState();
                    }
                };                
            },
            changeCantCreateProductState(){
                this.myCantCreateProductDialog = !this.myCantCreateProductDialog;
            },
            changeNotFoundDialogState(){
                this.myNotFoundDialog = !this.myNotFoundDialog;
            },

			navigateToMassImport(data, validation){
                if(this.validateUserSelector(validation.userId)){
                    this.$store.dispatch("transferCreateState/onSetTransferCreateState", {data: data, userId:this.myCustomUserId ?? this.myUserId});
                    this.$router.push({name: RouteName.massImportTransferProductpage});
                }
			},	

            validateUserSelector(userSelector){
                if(this.userRole == roleGroupId.User){
                    return true;
                }

                userSelector.myFunction();
                return userSelector.value==null;
            },

            async initData(){
                if(this.userRole == roleGroupId.Admin){
					await this.$store.dispatch("user/fetchUser", {
						offset: 0,
						limit: 10,
					});
				}
                await this.$store.dispatch("transferType/getTransferType")
                await this.$store.dispatch("recipient/getRecipients", {
                    offset: 0,
                    userId: this.myuserId
                })
                await this.$store.dispatch("products/onFetchProducts", {offset:0, limit:20})
                if(this.myErrorList.length>0){
                    this.changeNotFoundDialogState();
                }
            },

            async onFormSubmit(transfer, addedTransfer, updatedTransfer, deletedTransfer, userId){
                // TODO: Implement bold text on Transfer List
                // When created new data 
                this.message.failed="Error Creating Data, Retry?"
                this.toLoad = async ()=>{
                    transfer.transferProducts = transfer.transferProducts.map((e)=>{
                        return {
                            "product_id":e.product_id,
                            "demand": e.demand,
                        }
                    });

                    await this.$store.dispatch("transfers/createTransfers", {tempTransfer: transfer, userId: userId ?? this.myuserId}); 
                    this.$store.dispatch("transferCreateState/onClearAll");
                    // TODO: Once the bug is fixed, movet his back to transferDetail
                    await this.$router.replace({name:"TransferList"});
                    this.$toast.add({severity:'success', summary: 'Success', detail:'Transfer Created Successfully', life: 3000});
                }
            }
        },
        watch:{
            // '$store.state.transferCreateState.successList':{
            //     deep:true,
            //     handler(newValue){
            //         if(newValue.length>0){
            //             this.successList = [...newValue];
            //         }
            //     }
            // },
            // '$store.state.transferCreateState.errorList':{
            //     deep: true,
            //     handler(newValue){
            //         console.log("newvalue: ");
            //         console.log(newValue);
            //         if(newValue.length>0){
            //             this.errorList = [...newValue];
            //         }
            //     }
            // }
        }
    }
</script>