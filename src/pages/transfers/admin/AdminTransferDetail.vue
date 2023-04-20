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
    v-model:extraChargeRow="extraChargeRow"
    v-model:myExtraCharge="extraChargeList"
    @onClickSubmit="onSaved"
    >
        <template #myTop>
            <RetryField :toLoad="toLoad" :errorToast="errorToast"></RetryField>
        </template>

        <template #myButton="">
            <Button v-if="fieldNotActive" label="Edit" :disabled="isCancelStatus" class="p-button-success mr-2" @click="changeEditState" />
			<Button v-if="!fieldNotActive" label="Cancel" :disabled="isCancelStatus" @click="onCancelStatus" class="p-button-secondary noFocus mr-2"></Button>
			<Button v-if="!fieldNotActive" label="Save" :disabled="isCancelStatus" class="p-button-success" type="submit" @click="onSaved"/>
		</template>

        <template #extra_charge_panel>
            <div v-if="!fieldNotActive" class="field col-12 md:col-4 lg:col-2">
                <Button label="Add Extra Charge" class="p-button-success" @click="changeStateDialog"></Button>
            </div>

            <Dialog v-model:visible="myDialog" header="Add Extra Charge" class="myDialogWidth">
                <div class="p-fluid formgrid grid">
                    <div class="field col-12">
                        <label class="mr-2">Extra Charge</label>
                        <Dropdown v-model="selectedExtraCharge" :options="getExtraCharge" 
                        placeholder="Select Extra Charge">
                            <template #option="{ option }">
                                {{ option.item_code }}
                            </template>

                            <template #value="option">
                                {{ option.value?.item_code ?? option.placeholder }}
                            </template>
                        </Dropdown>
                    </div>    
                    <div class="col-12">
                        <Button label="Save" class="p-button-success mt-5" @click="onSavedExtraCharge"></Button>
                    </div>
                </div>
            </Dialog>
        </template>
    </BaseFormField>
</template>

<style scoped>
    .myDialogWidth{
        width: 350px;
    }
</style>

<script>
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import { transferId } from '../../../domains/domain';
    import BaseFormField from '../components/BaseFormField.vue';

    export default{
        created(){
            this.toLoad = this.initData;
        },
        components:{ BaseFormField, RetryField },
        data(){
            return {
                myData: null,
                backUpData: null,
                myDialog: false,

                extraChargeRow: 10,
                extraChargeList: [],
                selectedExtraCharge: null,
                toLoad: null,
                fieldNotActive: true,

                errorToast: {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed to add Extra Charges",
                    life: 2000
                }
            };
        },
        computed:{
            getExtraCharge(){
                return this.$store.getters["extraCharge/getExtraCharges"];
            },

            isCancelStatus(){
                return this.myData?.transfer_status == transferId.Canceled
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
                    operations: true,
                    extraCharge:false
                }
            },
        },
        methods:{
            async initData(){
                this.errorToast.summary="Error Loading!"
                this.toLoad= async () => {
                    this.myData = await this.$store.dispatch("transfers/getTransferDetail", {
                        transferId: this.$route.params.id
                    });
                    // Cloning Object without reference
                    this.backUpData = JSON.parse(JSON.stringify(this.myData));

                    await this.$store.dispatch("extraCharge/onFetchExtraCharges");
                };
            },

            // validate(){
            //     this.extraChargeList.forEach((e)=>{
            //         if(e.draft){
            //             return true;
            //         }
            //     });
            //     return false;
            // },

            onSaved(){
                // if(this.validate()){
                // }
                this.changeEditState();
            },

            onCancelStatus(){
                this.extraChargeList = [];
                this.changeEditState();
            },

            async onSavedExtraCharge(){
                if(this.selectedExtraCharge){
                    this.changeStateDialog();
                    this.errorToast.summary="Error Adding Extra Charge!"
                    this.toLoad = async () => {
                        const msg = await this.$store.dispatch("extraCharge/onAddTransferDetailWithExtraCharge", {transferId: this.$route.params.id, extraChargeId: this.selectedExtraCharge.id});
                        if(msg?.status=="success"){
                            this.extraChargeList.unshift(this.selectedExtraCharge);
                        }

                        this.$toast.add({ severity: msg?.status ?? "success", summary: msg?.summary ?? "" , detail: msg?.message ?? "", life: 2000 });
                        
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