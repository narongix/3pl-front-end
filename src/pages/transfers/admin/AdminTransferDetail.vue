<template>
    <!-- TODO: Refactor this stupid emit, make validate from slot and we use submit function this way instead, way better-->
    <BaseFormField
    :baseData="baseData"
    :FieldNotActive="fieldNotActive"
    :disabledField="disabledField" 
	:vanishField="vanishField"
	:editMode="true"
	:data="backUpData"
    :tabViewDisabled="tabViewDisabled"
    :myExtraCharge="getTransferExtraCharges"
    @onClickSubmit="onSaved"
    >
        <template #myTop>
            <RetryField :toLoad="toLoad" :errorToast="errorToast"></RetryField>
        </template> 

        <template #myButton="">
            <Button v-if="fieldNotActive" label="Edit" :disabled="isCancelStatus" class="p-button-success mr-2" @click="changeEditState" />
            <Button v-if="fieldNotActive" label="Submit" :disabled="!isDraftStatus || isCancelStatus" @click="onUpgradeStatus" class="mr-2"></Button>
            <Button v-if="fieldNotActive" label="Cancel" :disabled="!isDraftStatus || isCancelStatus" @click="onCancelStatus" class="p-button-secondary noFocus"></Button>

			<Button v-if="!fieldNotActive" label="Discard" :disabled="isCancelStatus" @click="onDiscardStatus" class="p-button-secondary noFocus mr-2"></Button>
			<Button v-if="!fieldNotActive" label="Save" :disabled="isCancelStatus" class="p-button-success" type="submit" @click="onSaved"/>
		</template>

        <template #extra_charge_panel_column>
            <Column v-if="!fieldNotActive" header="Actions">
                <template #body="props">
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="onDeleteExtraCharge(props.data)" />
                </template>
            </Column>
        </template>

        <template #operationTab>
            <OperationPanel :myOperationData="operationData" :rowTotal="operationTotal"></OperationPanel>
        </template>
        <template #extra_charge_panel>
            <div v-if="!fieldNotActive" class="field col-12 md:col-4 lg:col-2">
                <Button label="Add Extra Charge" class="p-button-success" @click="changeStateDialog"></Button>
            </div>
        </template>
    </BaseFormField>
        <Dialog v-model:visible="myDialog" header="Add Extra Charge" class="myDialogWidth">
            <div class="p-fluid formgrid grid">
                <div class="field col-12">
                    <label class="mr-2">Extra Charge</label>
                    <DropDownPagination v-model="selectedExtraCharge" :options="getExtraCharge"
                    :whenLoad="onLoadExtraCharge" :limit="getExtraChargeLimit" :whenSearch="findExtraCharge"
                    :messageLoad="messageLoadExtraCharge"
                    :errorToastLoading="errorToastLoadingExtraCharge" 
                    placeholder="Select Extra Charge" :filterFields="['item_code', 'description','long_description']"
                    >

                    <template #value="parent">
                        <p>{{ parent?.mySlot.value?.item_code ?? parent.mySlot?.placeholder }}</p>
                    </template>

                    <template #option="parent">
                        <div :onload="parent.stopCountDown?.()">
                            <p class="mb-0 title">{{ parent.mySlot?.option.item_code }}</p>
                            <p class="mb-0 subtitle">{{ parent.mySlot?.option.description }}</p>
                        </div>
                    </template>
                    </DropDownPagination>
                </div>    
                <div class="col-12">
                    <Button label="Save" class="p-button-success mt-5" @click="onSavedExtraCharge"></Button>
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="extraChargeDeleteDialog" :style="{ width: '450px' }" header="Confirm"
            :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Are you sure you want to delete <b>{{ extraChargeDelete.item_code }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" class="p-button-text"
                    @click="onDiscardDelete" />
                <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="onConfirmDelete" />
            </template>
        </Dialog>
</template>

<style src="../../../assets/styles/style.css"></style>

<style scoped>
    .myDialogWidth{
        width: 350px;  
    }
</style>

<script>
    import DropDownPagination from '../../../components/DropDownPagination.vue';
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import { transferId } from '../../../domains/domain';
    import BaseFormField from '../components/BaseFormField.vue';
    import OperationPanel from '../components/tabs/OperationPanel.vue';

    export default{
        created(){
            this.initData();
        },
        components:{ BaseFormField, RetryField, OperationPanel, DropDownPagination },
        data(){
            return {
                extraChargeDelete:null,
                extraChargeDeleteDialog:false,

                myData: null,
                backUpData: null,
                myDialog: false,

                selectedExtraCharge: null,
                toLoad: null,
                fieldNotActive: true,

                errorToast: {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed to add Extra Charges",
                    life: 2000
                },

                operationData: [],
                operationTotal: 0
            };
        },
        computed:{
            messageLoadExtraCharge(){
                return {
                    failed: "Error loading Extra Charge, retry?",
                    yesButton: "Yes",
                    noButton: "No",
                };
            },

            errorToastLoadingExtraCharge(){
                return {
                    severity:"error",
                    summary: "Error!",
                    detail: "Failed Loading Extra Charge!"
                };
            },
            getExtraChargeLimit(){
                return this.getExtraCharge?.length ?? 0;
            },
            
            getDetailTransfer(){
                const data = this.$store.getters["transfers/getTransferDetail"](this.$route.params.id);
                return data;
            },

            getExtraCharge(){
                return this.$store.getters["extraCharge/getExtraCharges"];
            },
            
            getTransferExtraCharges(){
                return this.getDetailTransfer?.extra_charges ?? [];
            },

            isCancelStatus(){
                return this.myData?.transfer_status == transferId.Canceled
            },

            isDraftStatus(){
                if(this.myData?.transfer_status_id == transferId.Draft){
					return true;
				}
                return false;
            },

            baseData(){
                return {
                    titleForm: "Transfer Detail",
                    titleField1: "Transfer Name",
                    titleField2: "Operation Type",
                    // I don't know how many times I have changed this, god.
                    buttonSubmit:"Add Product"
                };
            },

            disabledField(){
                return {
                    scheduleDate: true,
                    recipient: true,
                    source: true,
                    transfer_type_id: true,
                    destination: true,
                    reference: true,
                    userSelector: true,
                    product: true,
                };
            },

            vanishField(){
                return {
                    scheduleDate: false,
                    recipient: false,
                    source: false,
                    transfer_type_id: false,
                    destination: false,
                    reference: false,
                    userSelector: true,
                };
            },
            tabViewDisabled(){
                return {
                    ordered: false,
                    operations: false,
                    extraCharge:false
                }
            }
        },
        methods:{
            async onLoadExtraCharge(offset){
                const extraCharge = await this.$store.dispatch('extraCharge/onFetchExtraCharges',{
                    limit: 10,
                    offset: offset
                });

                return extraCharge.rows_total;
            },

            async findExtraCharge(filterValue){
                const extraCharge = await this.$store.dispatch("extraCharge/onFetchExtraCharges", {
                    offset: 0,
                    limit: 30,
                    name: filterValue,
                })
                return extraCharge.length;
            },
  
            onDeleteExtraCharge(data){
                this.extraChargeDelete = data;
                this.extraChargeDeleteDialog = true;
            },

            async onConfirmDelete(){
                const body ={
                    transferId: this.$route.params.id,
                    extraChargeId: this.extraChargeDelete.id
                }
                const resp = await this.$store.dispatch("transfers/onDeleteExtraChargeFromTransfer", body);
                this.$toast.add({ severity: resp?.status ?? "success", summary: resp?.summary ?? "" , detail: resp?.message ?? "", life: 2000 });

                this.extraChargeDeleteDialog=false;
            },

            onDiscardDelete(){
                this.extraChargeDeleteDialog = false;
                this.extraChargeDelete = null;
            },

            async onCancelStatus(){
				this.toLoad= async()=>{
					const created = []
					const updated = []
					const deleted = []

					this.myData = await this.$store.dispatch("transfers/updateTransfer", {
						recipient: this.myData.recipient,
						reference: this.myData.reference,
						transfer_status_id: transferId.Canceled,
						id : this.myData.id,
						created, 
						updated, 
						deleted,
					})

					this.$toast.add({severity:"success",summary:"Success", detail:"Transfer Edited Successfully", life:3000})
				}
            },

            async onUpgradeStatus(){
				this.toLoad= async()=>{
					const created = []
					const updated = []
					const deleted = []

					this.myData = await this.$store.dispatch("transfers/updateTransfer", {
						recipient: this.myData.recipient,
						reference: this.myData.reference,
						transfer_status_id: transferId.Submitted,
						id : this.myData.id,
						created, 
						updated, 
						deleted,
					})

					this.$toast.add({severity:"success",summary:"Success", detail:"Transfer Edited Successfully", life:3000})
				}
			},

            async initData(){
                this.errorToast.summary="Error Loading!"
                this.toLoad= async () => {
                    await this.$store.dispatch("transfers/getTransferDetail", {
                        transferId: this.$route.params.id
                    });

                    const data = await this.$store.dispatch("transfers/getOperationTransfers", {transferId: this.$route.params.id, offset:0, limit: 10});
                    this.operationTotal = data.rows_total;
                    this.operationData = data.rows;

                    await this.$store.dispatch("extraCharge/onFetchExtraCharges",{
                        offset: 0,
                        limit: 10,
                    });
                    this.myData = this.getDetailTransfer
                    
                    // Cloning Object without reference
                    this.backUpData = JSON.parse(JSON.stringify(this.myData));
                };
            },

            onSaved(){
                this.changeEditState();
            },

            onDiscardStatus(){
                this.changeEditState();
            },

            async onSavedExtraCharge(){
                if(this.selectedExtraCharge){
                    this.changeStateDialog();
                    this.errorToast.summary="Error Adding Extra Charge!"
                    this.toLoad = async () => {
                        const resp = await this.$store.dispatch("transfers/onAddTransferDetailWithExtraCharge", {transferId: this.$route.params.id, extraCharge: this.selectedExtraCharge});
                        this.$toast.add({ severity: resp?.status ?? "success", summary: resp?.summary ?? "" , detail: resp?.message ?? "", life: 2000 });
                        this.selectedExtraCharge=null;
                    };
                } 
            },

			changeEditState(){
                this.fieldNotActive=!this.fieldNotActive
			},

            changeStateDialog(){
                this.myDialog=!this.myDialog;
            },
        }
    }
</script>