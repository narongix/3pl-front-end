<template>
	<BaseFieldForm  
	:baseData="baseData" 
	@onClickSubmit="onFormSubmit"
	:data="oldData"
	:FieldNotActive="fieldNotActive"
	:disabledField="disabledField"
	>
		
		<template #myTop>
			<RetryField :toLoad="toLoad" :message="message"></RetryField>
		</template>

		<template #myButton="mySlot">
			<Button v-if="fieldNotActive" label="Edit" :disabled="!isDraftStatus || isCancelStatus" class="p-button-success mr-2" @click="changeEditState" />
			<Button v-if="fieldNotActive" label="Submit" :disabled="!isDraftStatus || isCancelStatus" @click="onUpgradeStatus" class="mr-2"></Button>
			<Button v-if="fieldNotActive" label="Cancel" :disabled="!isDraftStatus || isCancelStatus" @click="onCancelStatus" class="p-button-secondary noFocus"></Button>
			<Button v-if="!fieldNotActive" label="Save" :disabled="isCancelStatus" class="p-button-success mr-2" type="submit" />
			<Button v-if="!fieldNotActive" label="Discard" :disabled="isCancelStatus" class="p-button-secondary mr-2" @click="revertBack(mySlot.myDiscardField)" />	
		</template>
	</BaseFieldForm>
</template>

<style>
	.noFocus{
		box-shadow: none !important;	
	}
</style>

<script>
	import BaseFieldForm from './components/BaseFormField.vue';
	import RetryField from '../../components/prompt_field/RetryField.vue';
	import { transferId } from '../../domains/domain';

	export default{
		async created(){
			this.toLoad = this.loadData
		},
		components:{
			BaseFieldForm,
			RetryField
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
                    titleForm: "Transfer Detail",
                    titleField1: "Transfer Name",
                    titleField2: "Operation Type",
					buttonSubmit:"Add Transfer Detail"
                },
				fieldNotActive: true,
				oldData: null,
				transferDetail: null,

				isDraftStatus: false,
				isCancelStatus: false,

				toLoad:null,
				message:{
					failed: "Error Loading Data. Try again?",
					yesButton: "Yes",
					noButton: "No"
				},
				errorToast:{
					severity: "error",
					summary: "Error!",
					detail: "Failed Editing Transfer"
				}
			}
		},
		computed:{
			getDataState(){
				return  this.$store.getters["transfers/findTransferDetail"](this.$route.params.id)
			}
		},
		methods:{
			async onUpgradeStatus(){
				this.toLoad= async()=>{
					const created = []
					const updated = []
					const deleted = []

					await this.$store.dispatch("transfers/updateTransfer", {
						recipient: this.transferDetail.recipient,
						transfer_status_id: transferId.Submitted,
						id : this.transferDetail.id,
						created, 
						updated, 
						deleted})

					this.isDraftStatus=false
					this.$toast.add({severity:"success",summary:"Success", detail:"Transfer Edited Successfully", life:3000})
				}
			},

			async onCancelStatus(){
				this.toLoad= async()=>{
					const created = []
					const updated = []
					const deleted = []

					await this.$store.dispatch("transfers/updateTransfer", {
						recipient: this.transferDetail.recipient,
						transfer_status_id: transferId.Cancel,
						id : this.transferDetail.id,
						created, 
						updated, 
						deleted})

					this.isCancelStatus=true
					this.$toast.add({severity:"success",summary:"Success", detail:"Transfer Canceled Successfully", life:3000})
				}
			},

			async loadData(){
				await this.$store.dispatch("products/onFetchProducts",{
					offset: 0
				}) 
				await this.$store.dispatch("transferType/getTransferType")
				await this.$store.dispatch("recipient/getRecipients",{
					offset: 0
				})
				
				this.transferDetail = await this.getTransferDetail()

				if(this.transferDetail.transfer_status_id == transferId.Draft){
					this.isDraftStatus=true
				}
				else if(this.transferDetail.transfer_status_id == transferId.Cancel){
					this.isCancelStatus=true
				}
				
				this.restoreData()
			},
			async getTransferDetail(){
				const transferDetail = await this.$store.dispatch("transfers/getTransferDetail", {
					transferId: this.$route.params.id
				})
				return transferDetail
			},

			async onFormSubmit(transfer, created, updated, deleted){
				// TODO: Implement Bold Text on Transfer List
				// When edited Transfer
				this.toLoad = async ()=>{
					await this.$store.dispatch("transfers/updateTransfer", {
						recipient: transfer.recipient,
						id : transfer.id,
						created, 
						updated, 
						deleted})
					this.changeEditState()
					this.$toast.add({severity:"success",summary:"Success", detail:"Transfer Edited Successfully", life:3000})
            
				}
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
			},
		},
	}
</script>