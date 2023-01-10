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
			<Button v-if="fieldNotActive" label="Edit" class="p-button-success mr-2" @click="changeEditState" />
			<Button v-if="!fieldNotActive" label="Save" class="p-button-success mr-2" type="submit" />
			<Button v-if="!fieldNotActive" label="Discard" class="p-button-secondary mr-2" @click="revertBack(mySlot.myDiscardField)" />	
		</template>
	</BaseFieldForm>
</template>

<script>
	import BaseFieldForm from './components/BaseFormField.vue';
	import RetryField from './components/RetryField.vue';

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
                    titleForm: "Add new Transfer",
                    titleField1: "Transfer Name",
                    titleField2: "Operation Type",
					buttonSubmit:"Create Move lines"
                },
				fieldNotActive: true,
				oldData: null,
				transferDetail: null,

				toLoad:null,
				message:{
					failed: "Error Loading Data. Try again?",
					yesButton: "Yes",
					noButton: "No"
				}
			}
		},
		computed:{
			getDataState(){
				return  this.$store.getters["transfers/findTransferDetail"](this.$route.params.id)
			}
		},
		methods:{
			async loadData(){
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
			},
			async getTransferDetail(){
				const transferDetail = await this.$store.dispatch("transfers/getTransferDetail", {
					transferId: this.$route.params.id
				})
				return transferDetail
			},

			async onFormSubmit(transfer, created, updated, deleted){
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
			},
		},
	}
</script>