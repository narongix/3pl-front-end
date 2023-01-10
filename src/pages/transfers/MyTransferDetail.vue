<template>
	<BaseFieldForm  
	:baseData="baseData" 
	@onClickSubmit="onFormSubmit" 
	:data="oldData"
	:FieldNotActive="fieldNotActive"
	:disabledField="disabledField"
	>
		<template #myTop>
			<Dialog :visible="loadingData" :loading="loadingData" :modal=true :closable='false'>
				<ProgressSpinner v-if="!error"/>
				<p v-else>{{ textLoading }}</p>
				<template #footer>
					<div v-if="error">
						<Button label="No" class="p-button-secondary p-button-text" @click="noRetry"></Button>
						<Button label="Yes" class="p-button-text p-button-sucess" @click="retryLoading"></Button>
					</div>
				</template>
			</Dialog>
		</template>

		<template #myButton="mySlot">
			<Button v-if="fieldNotActive" label="Edit" class="p-button-success mr-2" @click="changeEditState" />
			<Button v-if="!fieldNotActive" label="Save" class="p-button-success mr-2" type="submit" />
			<Button v-if="!fieldNotActive" label="Discard" class="p-button-secondary mr-2" @click="revertBack(mySlot.myDiscardField)" />	
		</template>
</BaseFieldForm>
</template>

<script>
	import BaseFieldForm from './components/BaseFormField.vue';
	import ProgressSpinner from 'primevue/progressspinner';

	export default{
		async created(){
			await this.loadData()
		},
		components:{
			BaseFieldForm,
			ProgressSpinner
		},
		data(){
			return {
				disabledField:{
					scheduleDate: true,
					recipient: false,
					source: true,
					transfer_type_id: true,
					destination: true,
				},
                baseData:{
                    titleForm: "Add new Transfer",
                    titleField1: "Transfer Name",
                    titleField2: "Operation Type",
					buttonSubmit:"Create Move lines"
                },
				fieldNotActive: true,
				error: false,
				oldData: null,
				loadingData: false,
				textLoading: null,
				transferDetail: null,	
				productLoading: false,
			}
		},
		computed:{
			getDataState(){
				return  this.$store.getters["transfers/findTransferDetail"](this.$route.params.id)
			}
		},
		methods:{
			async noRetry(){
				this.loadingData=false
			},

			async retryLoading(){
				await this.loadData()				
			},

			async loadData(){
				try{
					this.loadingData = true
					
					await this.$store.dispatch("products/onFetchProducts",{
						offset: 0
					}) 
					await this.$store.dispatch("transferType/getTransferType")
					await this.$store.dispatch("recipient/getRecipients",{
						offset: 0
					})
					
					this.transferDetail = await this.getTransferDetail()

					//TODO: Change to Enum instead of hard coding transfer type
					if(this.transferDetail.transfer_type_id == 2){
						this.transferDetail.contact_id = this.$store.getters["recipient/findRecipientId"](this.transferDetail.recipient)
					}else{
						this.transferDetail.contact_id = 0
					}
					
					this.restoreData()
					this.loadingData = false
				}catch(e){
					console.log(e)
					this.textLoading="Error Loading Data. Try again?"
				}
			},
			async getTransferDetail(){
				const transferDetail = await this.$store.dispatch("transfers/getTransferDetail", {
					transferId: this.$route.params.id
				})
				return transferDetail
			},

			async onFormSubmit(transfer, created, updated, deleted){
				console.log("transfer: "+JSON.stringify(transfer))
                await this.$store.dispatch("transfers/updateTransfer", {
					recipient: this.$store.getters["recipient/getRecipientFullDetail"](transfer.contact_id),
					id : transfer.id,
					created, 
					updated, 
					deleted})
				
				this.changeEditState()
				
                this.$router.back()
            },

			changeEditState(){
				this.fieldNotActive=!this.fieldNotActive
			},
		
			revertBack(){
				this.restoreData()
				this.changeEditState()
			},

			restoreData(){
				this.oldData = {...this.transferDetail}
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