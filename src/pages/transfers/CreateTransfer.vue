<template>
    <BaseFieldForm
    :baseData="baseData"
    @onClickSubmit="onFormSubmit"
    :FieldNotActive="FieldNotActive"
    :disabledField="disabledField"
    :data="{}" :popup="myPopUp" :vanishField="vanishField"
    >
        <template #myTop>
            <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
        </template>    

        <template #myButton="mySlot">
            <Button label="Create" class="p-button-success mr-2" @keyup.enter="mySlot.onClick" @click="mySlot.onClick"/>    
        </template>
    </BaseFieldForm>
</template>

<script>
    import BaseFieldForm from './components/BaseFormField.vue'
    import { mapGetters } from 'vuex'
    import RetryField from '../../components/prompt_field/RetryField.vue'

    export default{
        async created(){
            this.toLoad = this.initData
        },
        
        data(){
            return{
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
            RetryField
        },

        computed:{
            ...mapGetters({
                products: "products/getProductState",
                myuserId: "auth/getUserId"
            }),

            myPopUp(){
                return {
                    header: "Product Quantity",
                    productDemandDisplay: "Quantity"
                }
            }
        },
        
        methods:{
            async initData(){
                await this.$store.dispatch("transferType/getTransferType")
                await this.$store.dispatch("recipient/getRecipients", {
                    offset: 0,
                })
                await this.$store.dispatch("products/onFetchProducts", {offset:0, limit:20})
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

                    const newTransfer = await this.$store.dispatch("transfers/createTransfers", {tempTransfer: transfer, userId: userId ?? this.myuserId}); 
                    await this.$router.replace({name:"TransferDetail", params:{id: newTransfer.id}});
                    this.$toast.add({severity:'success', summary: 'Success', detail:'Transfer Created Successfully', life: 3000});
                }
            },
        },
    }
</script>