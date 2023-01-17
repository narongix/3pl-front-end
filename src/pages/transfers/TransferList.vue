
<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h5>Transfers</h5>
                <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToCreateTransfer" />
				<p></p>
				<DataTable :value="myTransfers" :paginator="true" class="p-datatable-sm" dataKey="id"
					:rowHover="true" filterDisplay="menu" :loading="isLoading" responsiveLayout="scroll" 
					v-model:selection="mySelected" v-model:filters="filters" @page="onPage($event)" v-model:rows="row" 
					:rowsPerPageOptions="[10,20,30]">

					<template #empty>
						No Transfer found.
					</template>
					
					<Column selectionMode="multiple"></Column>

					<Column field="id" header="Id" style="min-width:12rem" filterMatchMode="contains" :sortable="true">
						<template #body="{ data }">
							<TransferItem :data="data"></TransferItem>
						</template>

						<template #filter="{ filterModel }">
							<InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Reference"></InputText>
						</template>
					</Column>

					<Column field="created_at" header="Schedule Date" style="min-width:12rem">
					</Column>
					
					<Column field="transfer_status_id" header="Status"></Column>
					
					<Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
						<template #body="{ data }">
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning m-0" @click="onPressDeletedProduct(data)" />
						</template>
					</Column>
				</DataTable>
				
				<RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingTransfer"></RetryField>
				<PromptField :loading="promptDeleted" @onAccept="onConfirmDeletedPrompt" @onDecline="onDecline" :message="message"/>
				<HiddenRetryField :toLoad="toLoadHidden" :message="messageLoading" :errorToast="errorToastLoadingTransfer"></HiddenRetryField>
			</div>
		</div>
	</div>
</template>


<style scoped lang="scss">
	@import '@/assets/demo/badges.scss';

	::v-deep(.p-datatable-frozen-tbody) {
		font-weight: bold;
	}

	::v-deep(.p-datatable-scrollable .p-frozen-column) {
		font-weight: bold;
	}
</style>



<script>
	import { FilterMatchMode } from "primevue/api"
	import { mapGetters } from "vuex"
	import TransferItem from "../transfers/components/TransferItem.vue"
	import myTime from "../../components/utils/TimeConvert.js"
	import RetryField from "../../components/prompt_field/RetryField.vue"
	import PromptField from "../../components/prompt_field/PromptField.vue"
	import HiddenRetryField from "../../components/prompt_field/HiddenRetryField.vue"

	export default {
		created(){
			this.toLoadHidden=this.initData
		},
		components:{
			TransferItem,
			RetryField,
			PromptField,
			HiddenRetryField
		},
		data() {
			return {
				loading1: false,
				mySelected: [],
				promptDeleted: false,
				selectedForDelete: null,

				outOfFetch: 1,
				
				row: 10,

				filters:{	
					"id":{value: null, matchMode: FilterMatchMode.CONTAINS}
				},

				toLoadRetry: null,
				toLoadHidden: null,

				message:{
					failed: "Error Deleting Transfer, Try again",
					yesButton: "Yes",
					noButton: "No",
					decline: "No",
					accept: "Yes",
					prompt: null
				},

				messageLoading:{
					failed: "Error loading Transfer, Try again",
					yesButton: "Yes",
					noButton: "No",
				},

				errorToastDeletingTransfer:{
					severity:"error",
					summary: "Error!",
					detail: "Failed Deleting Transfer!"
				},

				errorToastLoadingTransfer:{
					severity: "error",
					summary: "Error!",
					detail: "Failed Loading Transfer!"
				}
			}
		},
		computed: {
			...mapGetters({
				myTransfers: "transfers/getTransfers",
				hasTransfers: "transfers/hasTransfers",
				LoginStatus: "isLoggedIn",
			}),

			multipleSelectMode(){
				return this.mySelected.length>0
			},

			accessToken() {
				return localStorage.accessToken;
			},

			isLoading(){
				return this.loading1 && !this.$store.state.transfers.transfers
			},

			translate (date){
				return myTime.fromUTCToLocal(Date(date.created_at))
			}
		},
		methods:{
			goToCreateTransfer(){
				this.$router.push({name: "TransferCreate"})
			},
			
			onPressDeletedProduct(data){
				//Do this else it will not recognize it's a new value on watch
				this.selectedForDelete = {...data}
				this.message.prompt = `Are you sure you want to delete ${ this.selectedForDelete.recipient ?? this.selectedForDelete.id ?? "this" } transfer?`
			},

			DiscardDeletedPrompt(){
				this.mySelected = []
				this.selectedForDelete = null
			},

			async onConfirmDeletedPrompt(){
				this.message.failed = `Failed to delete ${this.selectedForDelete.recipient} transfer, try again?`
				this.promptDeleted=false

				this.toLoadRetry = async ()=>{	
					await this.$store.dispatch("transfers/deleteSingleTransfer", {
					transfer: this.selectedForDelete
					})
					this.$toast.add({severity:'success', summary: "Success!", detail: "Transfer Deleted Successfully", life:3000})
					this.DiscardDeletedPrompt()
				}			
			},
			
			onPage(event){
				if(event.page+1 == Math.floor(this.myTransfers.length/10) && this.outOfFetch>0){
					this.loadData()
				}
			},

			async initData(){
				this.message.failed ="Loading failed, retry?"
				
				await this.$store.dispatch("transfers/getTransfers", {
					currentOffset: 0,
					limit: this.row*2
				})
			},

			async loadData(){
				this.toLoadHidden = async ()=>{
					// The Ui will first need 2 pages in order for pagination to work, 
					// Because it's triggered by pressing the button which does it in the background 
					// so we have to get data*2 then the current ui in order for the press next button to work
					const tranfers = await this.$store.dispatch("transfers/getTransfers", {
						currentOffset: this.row*2,
						limit: this.row*2
					})
					this.outOfFetch = tranfers.length
				}
			},

			noRetry(){
				this.loading1=false
			},

			onDecline(newValue){
				this.promptDeleted=newValue
			}
		},

		watch:{
			selectedForDelete(newValue){
				// First Exclamation mark means return false if there's data
				// Second means return true if there's data
				this.promptDeleted=!!newValue
			},

			mySelected(){
				if(this.mySelected<=0){
					this.promptDeleted=false
				}
			},
		}
	}
</script>