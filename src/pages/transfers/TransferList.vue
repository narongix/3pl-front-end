<script>

import { FilterMatchMode } from "primevue/api"
import { mapGetters } from "vuex"
import TransferItem from "../transfers/components/TransferItem.vue"
import myTime from "../../components/utils/TimeConvert.js"
import ProgressSpinner from "primevue/progressspinner"

export default {
	components:{
		TransferItem,
		ProgressSpinner
	},
	data() {
		return {
			loading1: false,
			mySelected: [],
			promptDeleted: false,
			selectedForDelete: null,
			
			row: 5,
			error: null,
			loadingFunction: null,

			filters:{	
				"recipient":{value: null, matchMode: FilterMatchMode.STARTS_WITH},
				"source_location":{value: null, matchMode: FilterMatchMode.STARTS_WITH},
				"destination_location": {value:null, matchMode: FilterMatchMode.CONTAINS}
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
			this.selectedForDelete = data
		},

		DiscardDeletedPrompt(){
			this.mySelected = []
			this.selectedForDelete = null
		},

		async onConfirmDeletedPrompt(){
			await this.$store.dispatch("transfers/deleteSingleTransfer", {
				transfer: this.selectedForDelete
			})
			this.DiscardDeletedPrompt()
		},
		
		onPage(event){
			if(event.page == Math.floor(this.myTransfers.length/10)){
				this.loadData()
			}
		},

		async initData(){
			try{
				this.error=null
				this.loading1=true
				await this.$store.dispatch("transfers/getTransfers", {
					currentOffset: 0,
					limit: this.row*2
				})
				this.loadingFunction = this.loadData
				this.loading1=false
			}catch(e){
				this.error = "Loading failed, retry?"
			}
		},

		async loadData(){
			try{
				this.loading1 = false
				this.error=null
				// The Ui will first need 2 pages in order for pagination to work, 
				// Because it's triggered by pressing the button which does it in the background 
				// so we have to get data*2 then the current ui in order for the press next button to work
				await this.$store.dispatch("transfers/getTransfers", {
					currentOffset: this.row*2,
					limit: this.row*2
				})
			}catch(e){
				this.loading1 = true
				this.error = "Loading failed, retry?"
			}
		},

		noRetry(){
			this.loading1=false
		}
	},
	
	async created(){
		this.loadingFunction = this.initData
		this.initData()
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

<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h5>Transfers</h5>
                <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToCreateTransfer" />
				<p></p>
				<DataTable :value="myTransfers" :paginator="true" class="p-datatable-gridlines" dataKey="id"
					:rowHover="true" filterDisplay="menu" :loading="isLoading" responsiveLayout="scroll" 
					v-model:selection="mySelected" v-model:filters="filters" @page="onPage($event)" v-model:rows="row" 
					:rowsPerPageOptions="[5,20,30]">
					<!-- editMode="cell" @cell-edit-complete="onCellEditComplete"> -->

					<template #empty>
						No Transfer found.
					</template>
					
					<Column selectionMode="multiple"></Column>

					<Column field="recipient" header="Reference" style="min-width:12rem" filterMatchMode="contains" :sortable="true">
						<template #body="{ data }">
							<TransferItem :data="data"></TransferItem>
						</template>

						<template #filter="{ filterModel }">
							<InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by Reference"></InputText>
						</template>
					</Column>

					<Column field="created_at" header="Schedule Date" style="min-width:12rem">
						<!-- <template #body="{ data }">
							<p>{{ Date(data.created_at) }}</p>
						</template> -->

						<template #editor="slotProps">
							<InputText v-model="slotProps.data[slotProps.field]" />
						</template>
					</Column>
					
					<Column field="transfer_status_id" header="Status"></Column>
					
					<Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
						<template #body="{ data }">
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="onPressDeletedProduct(data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="promptDeleted" :style="{width: '450px'}" header='Confirm' :modal=true>
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
						<span>Are you sure you want to delete {{ selectedForDelete.recipient }} transfer?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="DiscardDeletedPrompt"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="onConfirmDeletedPrompt"></Button>
					</template>
				</Dialog>

				<Dialog :visible="loading1" :loading="loading1" :modal=true :closable='false'>
				<ProgressSpinner v-if="!error"/>
				<p v-else>{{ error }}</p>
				<template #footer>
					<div v-if="error">
						<Button label="No" class="p-button-secondary p-button-text" @click="noRetry"></Button>
						<Button label="Yes" class="p-button-text p-button-sucess" @click="loadingFunction()"></Button>
					</div>
				</template>
			</Dialog>
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