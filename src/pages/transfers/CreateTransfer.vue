<template>
    <BaseFieldForm
    :baseData="baseData"
    @onClickSubmit="onFormSubmit"
    :FieldNotActive="FieldNotActive"
    :disabledField="disabledField"
    :data="{}"
    >
        <template #myTop>
            <Dialog :visible="loadingData" :modal=true :closable='false'>
				<ProgressSpinner v-if="loadingData"/>
				<p v-else>{{ textLoading }}</p>
				<template #footer>
					<div v-if="error">
						<Button label="No" class="p-button-secondary p-button-text" @click="loadingData=!loadingData"></Button>
						<Button label="Yes" class="p-button-text p-button-sucess" @click="initData"></Button>
					</div>
				</template>
			</Dialog>
        </template>    

        <template #myButton="mySlot">
            <Button label="Create" class="p-button-success mr-2" @keyup.enter="mySlot.onClick" @click="mySlot.onClick"/>    
        </template>
    </BaseFieldForm>
</template>

<script>
    import BaseFieldForm from './components/BaseFormField.vue'
    import myTime from '../../components/utils/TimeConvert.js'
    import ProgressSpinner from 'primevue/progressspinner'
    import { mapGetters } from 'vuex'

    export default{
        async created(){
            await this.initData()
        },
        
        data(){
            return{
                baseData:{
                    titleForm: "Add new Transfer",
                    buttonSubmit: "Create Transfer Product"
                },
                disabledField:{
                    scheduleDate:false,
                    recipient: false,
					shipper: true,
					source: false,
                    transfer_type_id: false,
					destination: false
                },
                FieldNotActive: false,
                loadingData:false,
                error:false,
                textLoading: null,
            }
        },

        components:{
            BaseFieldForm,
            ProgressSpinner
        },

        computed:{
            ...mapGetters({
                products: "products/products"
            })
        },
        
        methods:{
            async initData(){
                this.loadingData = true
                console.log("prodcuts: "+this.products.length)
                await this.$store.dispatch("products/onFetchProducts",{
                    offset: 0
                })
                await this.$store.dispatch("transferType/getTransferType")
                await this.$store.dispatch("recipient/getRecipients", {
                    offset: 0,
                })
                this.loadingData = false
            },

            async onFormSubmit(transfer){
                try{
                    transfer.scheduledDate=myTime.formatDateFromScheduleDate(transfer.scheduledDate)
                    
                    if(transfer.contact_id!=null){
                        transfer.recipient = this.$store.getters["recipient/getRecipientFullDetail"](transfer.contact_id)
                        delete transfer["contact_id"]
                    }
                    else{
                        transfer.recipient="Recipient"    
                    }

                    transfer.transferProducts = transfer.transferProducts.map((e)=>{
                        return {
                            "product_id":e.product_id,
                            "demand": e.demand,
                        }
                    })
                    
                    this.textLoading=null
                    this.loadingData=true
                    await this.$store.dispatch("transfers/createTransfers", {tempTransfer: transfer})                    
                    this.loadingData=false
                    this.$router.back()
                }

                catch(e){
                    console.log(e)
                    this.textLoading="Error Creating Data. Try again"
                }
                
            }
        },

        watch:{
			textLoading(newValue){
				if(newValue=="Error Loading Data. Try again?" || newValue == "Error Creating Data."){
					this.error=true
				}
				else{
					this.error=false
				}
			}
		}
    }
</script>