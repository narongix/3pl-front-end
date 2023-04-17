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
                <label class="mr-2">Extra Charge</label>
                <Dropdown v-model="selectedExtraCharge" :options="getExtraCharge" 
                placeholder="Select Extra Charge"
                @change="onChange">
                    <template #option="{ option }">
                        {{ option.item_code }}
                    </template>

                    <template #value="option">
                        {{ option.value?.item_code ?? option.placeholder }}
                    </template>
                </Dropdown>
            </div>
        </template>
    </BaseFormField>
</template>

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

                extraChargeRow: 10,
                extraChargeList: [],
                selectedExtraCharge: null,
                toLoad: null,
                fieldNotActive: true,
            };
        },
        computed:{
            getExtraCharge(){
                return this.$store.getters["extraCharge/getExtraCharges"];
            },

            errorToast(){
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed to Load Transfer",
                    life: 2000
                };
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
            }
        },
        methods:{
            async initData(){
                this.myData = await this.$store.dispatch("transfers/getTransferDetail", {
					transferId: this.$route.params.id
				});
                // Cloning Object without reference
                this.backUpData = JSON.parse(JSON.stringify(this.myData));

                await this.$store.dispatch("extraCharge/onFetchExtraCharges");
            },

            validate(){
                this.extraChargeList.forEach((e)=>{
                    if(e.draft){
                        return true;
                    }
                });
                return false;
            },

            onSaved(){
                if(this.validate()){
                    this.$store.dispatch();
                }
                this.changeEditState();
            },

            onChange(event){
                if(event.value){
                    this.extraChargeList.unshift({
                        ...event.value,
                        draft: true,
                    })
                }
            },

            onCancelStatus(){
                this.extraChargeList = [];
                this.changeEditState();
            },

			changeEditState(){
                console.log('rise')
				this.fieldNotActive=!this.fieldNotActive
			}
        }
    }
</script>