<template>
    <div>
        <slot name="myTop"></slot>
        <div class="card">
            <form @submit="validateAndSubmit">
                <div class="grid">
                    <div class="col-12">
                        <h5>{{ baseData.titleForm }}</h5>
                        <slot name="myButton" :onClick="validateAndSubmit" :myDiscardField="changeStateDiaglog"></slot>
                        <hr>
                        <p></p>

                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4 sm:col-12">
                                <label for="scheduleDate" :class="{'p-error': validationField1.scheduledDate.value}">Schedule Date</label>

                                <!-- A bug from the dev team, not from the code's fault -->
                                <Calendar :manualInput="false" :showIcon="true" :disabled="FieldNotActive || disabledField['scheduleDate']"
                                        id="scheduleDate" v-model="transferData.scheduledDate"
                                        :showTime="true" hourFormat="12" showButtonbar="true" :dateFormat="getFormatCalendar" :inputClass="{'p-invalid': validationField1.scheduledDate.value}"/>
                                <small id="scheduleDate-help" class="p-error" v-if="validationField1.scheduledDate.value">Cannot be Empty</small>
                            </div>

                            <div class="field col-12 md:col-3 sm:col-12">
                                <label for="transfer_type_id" :class="{'p-error': validationField1.transfer_type_id.value}">Transfer Type</label>

                                <Dropdown :disabled="FieldNotActive || disabledField['transfer_type_id']" 
                                id="transfer_type_id" v-model="transferData.transfer_type_id"
                                :options="transfer_type" :optionLabel="getTransferTypeName"
                                :class="{'p-invalid': validationField1.transfer_type_id.value}"
                                :placeholder="transferLoading? 'Loading' : 'Please select a transfer'"
                                :loading="transferLoading" optionValue="transfer_type_id" :selectOnFocus="false"                              >
                                </Dropdown>

                                <small id="transfer_type_id-help" class="p-error" v-if="validationField1.transfer_type_id.value">{{ validationField1.transfer_type_id.value }}</small>
                            </div>

                            <div v-if="showRecipientField" class="field col-12 md:col-5 sm:col-12">
                                <label for="recipient" :class="{'p-error': validationField1.recipient.value}">Recipient</label>
                                <div class="field grid col-12 md:col-9 sm:col-12">
                                    <div class="col-11 pl-0">
                                        <InputText v-model="transferData.recipient" @input="onInput" 
                                        placeholder="Recipient" type="text" :disabled="FieldNotActive || disabledField['recipient']"
                                        :class="{'p-invalid': validationField1.recipient.value}"
                                        >
                                        </InputText>
                                        <small id="recipient-help" class="p-error" v-if="validationField1.recipient.value">Cannot be Empty</small>

                                        <OverlayPanel ref="myOverLayPanel">
                                            <div>
                                                <Button label="Create Template" class="p-button-link" @click="createRecipientTemplateNow"></Button>
                                            </div>
                                            <div>
                                                <Button label="Create and edit" class="p-button-link" @click="openCreateRecipientTemplate"></Button>
                                            </div>                                        
                                        </OverlayPanel>
                                    </div>
                                    
                                    <div class="field col-1">
                                        <Button icon="pi pi-bookmark" :disabled="FieldNotActive || disabledField['recipient']" 
                                        class="p-button-rounded p-button-secondary p-button-text" @click="openRecipientPanel" 
                                        v-tooltip="'Choose From Template'"/>
                                    </div>
                                </div>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="InternalReference" :class="{'p-error': validationField1.reference.value}">Internal Reference</label>
                                <InputText :disabled="FieldNotActive || disabledField['reference']" id="InternalReference" 
                                type="text" v-model.trim="transferData.reference" :class="{'p-invalid': validationField1.reference.value}"></InputText>
                                <small id="InternalReference-help" class="p-error" v-if="validationField1.reference.value">{{ validationField1.reference.value }}</small>
                            </div>

                            <div v-if="adminOrUser() && !vanishField['userSelector']" class="field col-12 md:col-3">
                                <label for="adminUserId" :class="{'p-error': validationField1.userId.value}">User</label>
                                <UserDropDownPagination v-model:userSelector="userSelector" :disabled="FieldNotActive || disabledField['userSelector']" :validation="validationField1.userId.value!=null"></UserDropDownPagination>
                                <small id="adminuserId-help" class="p-error" v-if="validationField1.userId.value">{{ validationField1.userId.value }}</small>
                            </div>

                            <div class="field col-12 md:col-3 sm:col-12">
                                <label for="status">Status</label>
                                <InputText :disabled="true" id="status" 
                                type="text" v-model="myTransferStatus"></InputText>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>  

        <div class="card">
            <div class="grid">
                <div class="col-12 md:col-12 sm:col-12">
                    <Button v-if="!FieldNotActive" label="SAVE" class="p-button-success mr-2 mb-2" @click='changeStateDiaglog'>
                        {{ baseData.buttonSubmit }}
                    </Button>
                </div>

                <div class="col-12 md:col-12 sm:col-12">
                    <small class="p-error" v-if="validationField1.transferProducts.value">{{ validationField1.transferProducts.value }}</small>
                    <DataTable :value="transferData.transferProducts" selectionMode="single" @rowSelect="promptEditField"
                    :paginator="true" class="p-datatable-sm" :rows="10" datakey="productId" :rowHover="true" responsiveLayout="scroll"
                    v-model:filters="filters"  filterDisplay="menu"
                    >
                        <template #empty>
                            <p :class="{'p-error': validationField1.transferProducts.value}">Please create transfer detail</p>
                        </template>

                        <Column field="product_name" header="Name" :sortable="true" style="min-width:12rem">
                            <template #body="{ data }">
                                <p :class="{highlight: !FieldNotActive}">{{ data.product_name }}</p>
                            </template>

                        <template #filter="{filterModel, filterCallback}">
                            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by name"></InputText>
                        </template>
                        </Column>
                        <Column field="sku" header="Internal Reference" style="min-width:12rem"></Column>
                        <Column field="barcode" header="Barcode" style="min-width:15rem"></Column>
                        <Column field="demand" header="Demands" :sortable="true" style="min-width:12rem">
                            <template #body="{ data }">
                                <p :class="{highlight: !FieldNotActive}">{{ data.demand }}</p>
                            </template>

                            <template #filter="{ filterModel, filterCallback }">
                            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by demands"></InputText>
                            </template>
                        </Column>
                        <Column v-if="!FieldNotActive" header="Actions" style="min-width:12rem">
                            <template #body="props">
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="onPopUpDeletedPrompt(props)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="promptCreateField" :style="{width: '450px'}" :header="popup.header ?? 'Select New Product'" :modal=true>
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-12 sm:col-12">
                    <label for="product_id" :class="{'p-error': validationField2.product_id.value!=null}">Product</label>
                    <DropDownPagination v-model="product_id" :options="getProductByUser" optionLabel="search_key" optionValue="product_id"
                    :disabled="FieldNotActive" id="product_id" placeholder="Please select a product" 
                    :validation="validationField2.product_id.value"
                    :whenLoad="onLoadProductV2" :limit="getProductLimit" :whenSearch="findProduct"
                    :maxLength="getProductLength"
                    :errorToastLoading="errorToastLoadingProducts" :messageLoad="messageLoadProducts"
                    :showOption="option => option.search_key"
                    >

                    </DropDownPagination>
                    <small id="product_id-help" class="p-error" v-if="validationField2.product_id.value!=null">{{ validationField2.product_id.value }}</small>
                </div>

                <div class="field col-12 md:col-12 sm:col-12">
                    <label for="demand" :class="{'p-error': validationField2.demand.value!=null}">{{ popup.productDemandDisplay ?? "Product Quantity" }}</label>
                    <InputText :disabled="FieldNotActive" id="demand" type="text" v-model="demand" :class="{'p-invalid':validationField2.demand.value}"></InputText>
                    <small id="demand-help" class="p-error" v-if="validationField2.demand.value!=null">{{ validationField2.demand.value }}</small>
                </div>
            </div>

            <template #footer>
                <Button label="Discard" class="p-button-secondary p-button-text" @click="changeStateDiaglog"></Button>
                <Button v-if="editedIndex!=null" :disabled="productLoading" label="Update" class="p-button-text" @click="updateField"></Button>
                <Button v-else :disabled="productLoading" label="Create" class="p-button-text" @click="createTransferProduct"></Button>
            </template>
        </Dialog>

        <Dialog v-model:visible="promptFindRecipient" header="Choose from template" :style="{width: '350px'}">
            <div class="grid">
                <div class="col-12 md:col-12 sm:col-12">
                    <DropDownPagination v-model="myContact" :options="getRecipientByUser"
                    :disabled="FieldNotActive || disabledField['recipient']" id="recipient" placeholder="Please select a recipient"
                    :validation="validationField1.recipient.value"
                    :whenLoad="onloadRecipientV2" :limit="getRecipientLimit" :whenSearch="findRecipient"
                    :maxLength="getRecipientLength"
                    :showOption="option=>option.full_name"
                    :showValue="showValueRecipient" :offset="offset ?? 0"
                    >
                    </DropDownPagination>
                </div>
            </div>

            <template #footer>
                <Button label="Discard" @click="changeRecipientState"></Button>
                <Button label="Select" @click="onConfirmSelectRecipientState"></Button>
            </template>
        </Dialog>

        <PromptField :loading="promptDeleted" @onAccept="onConfirmDeletedPrompt" @onDecline="changeDeletedStateDialog" :message="messageDeletePrompt"/>
        <RecipientField v-model="transferData.recipient" v-model:state="state" :userId="userSelector ?? myUserId"></RecipientField>
        <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
    </div>
</template>

<style scoped>
    .highlight{
        color: var(--primary-color);
    }
</style>

<script>
    import { mapGetters } from 'vuex'

    import StringFunction from '../../../components/utils/StringFunction'
    import DropDownPagination from '../../../components/DropDownPagination.vue';
    import PromptField from '../../../components/prompt_field/PromptField.vue';

    import TimeConvert from "@/components/utils/TimeConvert";
    import {FilterMatchMode, FilterOperator} from "primevue/api";

    import { transferStatus } from '../../../domains/domain';
    import RecipientField from './RecipientField.vue';
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import { roleGroupId } from '../../../domains/domain';
    import UserDropDownPagination from '../../../components/UserDropDownPagination.vue';


    export default{
        props:{
            baseData: Object,
            FieldNotActive: Boolean,
            data: Object,
            disabledField: Object,
            offset: Number,
            myUserId: null,
            editMode: {
                type: Boolean,
                default: false
            },
            popup: {
                header: String,
                productDemandDisplay: String
            },
            vanishField: Object,
            // validatedBeforeCreatingRecipient: {
            //     type: Function,
            //     default: ()=>{
            //         console.log("userselctor: "+this.userSelector)
            //         return this.userSelector!=null
            //     },
            // }
        },
        
        emits:["onClickSubmit"],
        components:{
            DropDownPagination,
            PromptField,
            RecipientField,
            RetryField,
            UserDropDownPagination
        },

        data(){
            return {
                myContact: null,

                state:false,

                filters:{
                    product_name: {operator: FilterOperator.AND, constraints:[{value: null, matchMode: FilterMatchMode.CONTAINS}]},
                    demand: {operator: FilterOperator.AND, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]}
                },
                messageDeletePrompt:{
                    decline: "No",
                    accept: "Yes",
                    prompt: null
                },

                promptCreateField: false,
                promptDeleted:false,

                addedTransferProducts: [],
                updatedTransferProducts:[],
                deletedTransferProducts:[],

                editedIndex: null,
                editedId: null,

                originalLength: null,
                
                tempMove: {},

                product_id: null,
                demand: null,

                showRecipientField:false,

                myTransferStatus: transferStatus[1],
                promptFindRecipient:false,

                toLoad: null,

                message: {
                    failed: "Failed to create, Retry?",
                    yesButton: "Yes",
                    noButton: "No"
                },
                
                errorToast:{
                    severity:"error",
                    summary: "Error!",
                    detail: "Failed Creating Recipient!"
                },

                transferData:{
                    scheduledDate: null,
                    transfer_type_id:null,
                    recipient: null,
                    transferProducts: [],
                    reference: null,
                },

                validationField1:{
                    userId:{
                        value: null,
                        myFunction:()=>{
                            if(this.editMode){
                                return this.validationField1.userId.value = null
                            }
                            if(this.getUserRole == roleGroupId.User){
                                return this.validationField1.userId.value = null
                            }

                            if(this.userSelector){
                                return this.validationField1.userId.value = null
                            }
                            
                            this.validationField1.userId.value = "User field cannot be blank"
                            return this.validationField1.userId.value
                        }
                    },
                    transferProducts:{
                        value: null,
                        myFunction: ()=>{                            
                            if(this.transferData?.transferProducts?.length>0){
                                return this.validationField1.transferProducts.value = null
                            }
                            return this.validationField1.transferProducts.value = "Transfer Detail Cannot be Empty"
                        }
                    },

                    scheduledDate:{
                        value: null,
                        myFunction: ()=>{
                            if(this.transferData.scheduledDate){
                                return this.validationField1.scheduledDate.value = null
                            }
                            return this.validationField1.scheduledDate.value = "Field cannot be empty!"
                        }
                    },

                    recipient:{
                        value: null,
                        myFunction:()=>{
                            // id 2 = delivery
                            if(this.transferData.transfer_type_id!=2){
                                return this.validationField1.recipient.value=null
                            }
                            
                            if(this.transferData.recipient){
                                return this.validationField1.recipient.value=null
                            }
                            this.validationField1.recipient.value="Field cannot be empty!"
                        }
                    },

                    transfer_type_id:{
                        value: null,
                        myFunction: ()=>{
                            if(this.transferData.transfer_type_id){
                                    return this.validationField1.transfer_type_id.value = null
                            }
                            this.validationField1.transfer_type_id.value = "Cannot be Empty"
                        }
                    },

                    reference:{
                        value: null,
                        myFunction: ()=>{
                            return this.validationField1.reference.value = null
                        }
                    }
                },
                
                validationField2:{
                    product_id:{
                        value:null,
                        myFunction:()=>{
                            const temp = this.product_id?.split(" ").join("")
                            if(temp){
                                return this.validationField2.product_id.value = null
                            }
                            this.validationField2.product_id.value = "Cannot be Empty"
                        }
                    },
                    demand:{
                        value:null,
                        myFunction:()=>
                        {
                            const trimText = this.demand?.toString().trim()
                            const tempNum = Number(trimText)
                            
                            this.demand = trimText
                            
                            // if field empty,
                            if(!trimText){
                                return this.validationField2.demand.value = "Cannot Be Empty!"
                            }

                            if(tempNum>0){
                                return this.validationField2.demand.value = null
                            }

                            if(tempNum == 0){
                                return this.validationField2.demand.value = "Must Be Atleast 1"
                            }

                            this.validationField2.demand.value = "Please Enter Numeric Value Only"
                        }
                    }
                },

                tempProductList:[],
                userSelector: null,
                tempReceipientList:[],

                productLoading: false,
                transferLoading: false,
                recipientLoading:false,

                filterValue: null, 
                countdown: 2,
                countdownTracker: null,


                messageLoadRecipient:{
                    failed: "Error loading Recipient, retry?",
                    yesButton: "Yes",
                    noButton: "No"
                },

                errorToastLoadingRecipient:{
                    severity:"error",
                    summary: "Error!",
                    detail: "Failed Loading Recipient!"
                },

                messageLoadProducts:{
                    failed: "Error loading Products, retry?",
                    yesButton: "Yes",
                    noButton: "No",
                },

                errorToastLoadingProducts:{
                    severity:"error",
                    summary: "Error!",
                    detail: "Failed Loading Products!"
                }
            }
        },
        computed:{
            ...mapGetters({
                getProducts: "products/getProductState",
                getRecipientsState: "recipient/getRecipientsState",
                transfer_type: "transferType/getTansferType",
                user: "auth/user",
                // userId: "auth/getUserId",
                getUserRole: "auth/getUserRole",
                // Limit offset
                getProductLimit: "products/limit",
                getRecipientLimit: "recipient/getLimit",
            }),


            getProductByUser(){
                const newProduct = this.getProducts.filter((e)=>e.user_id == (this.userSelector ?? this.myUserId));
                return newProduct;
            },

            getRecipientByUser(){
                // TODO: Fix Dialog Select Recipient. Everytime Recipient Dialog is loaded, it would refresh the entire widget
                const newRecipient = this.getRecipientsState.filter((e)=>e.user_id == (this.userSelector ?? this.myUserId))

                return newRecipient;
            },

            getProductLength(){
                return this.getProductByUser?.length ?? 0
            },

            getRecipientLength(){
                return this.getRecipientsState.length
            },

            getDisplayTranser(){
                return this.transferData.transferProducts.map()
            },
            
            findIndexUpdatedPositionLocalProduct(){
                return this.editedIndex - (this.originalLength - this.deletedTransferProducts.length)
            },

            getFormatCalendar(){
                return TimeConvert.getCalendarFormat()
            }
        },

        methods:{
            
            showValueRecipient(value){
                return value?.full_name ?? "Empty"
            },
            
            createRecipientTemplateNow(){
                if(this.validatedBeforeCreatingRecipient()){
                    this.toLoad = async ()=>{                        
                        await this.$store.dispatch("recipient/createRecipient", {
                            firstName: this.transferData.recipient,
                            userId: this.userSelector ?? this.myUserId
                        })
                    };
                    this.$refs.myOverLayPanel.hide();
                }else{
                    this.$toast.add(this.toast ?? {
                        severity: "error",
                        summary: "No User",
                        detail: "Please select a user before creating",
                        life: 1000
                    })
                }
            },

            openCreateRecipientTemplate(){
                if(this.validatedBeforeCreatingRecipient()){
                    this.toLoad = async ()=>{
                        await this.$store.dispatch("user/fetchCountries");
                        await this.$store.dispatch("user/fetchCities");
                        await this.$store.dispatch("user/fetchDistricts");

                        this.changeRecipientTemplateState();
                    };
                }else{
                    this.$toast.add(this.toast ?? {
                        severity: "error",
                        summary: "No User",
                        detail: "Please select a user before creating",
                        life: 1000
                    })
                }
            },

            changeRecipientTemplateState(){
                this.state=!this.state
            },

            onInput(input){
                if(!this.transferData.recipient){
                    return this.$refs.myOverLayPanel.hide(input)
                }

                this.$refs.myOverLayPanel.show(input)
            },
            
            openRecipientPanel(){
                this.changeRecipientState()
            },

            initializeData(){
                this.transferData={
                    id: this.data?.id,
                    scheduledDate: TimeConvert.formatUTCToDate(this.data?.created_at),
                    recipient: this.data?.recipient ?? null,
                    transfer_type_id: this.data?.transfer_type_id,
                    transferProducts: this.data?.transfer_products? [...this.data.transfer_products] : [],
                    reference: this.data?.reference ?? null
                }
                this.originalLength = this.data.transfer_products?.length ?? 0
                this.myTransferStatus = transferStatus?.[this.data?.transfer_status_id] ?? transferStatus[1]
            },

            findProductAfterSelected(){
                // TODO: Either cache the product ID or develop an algorithm for this,
                // also this code belongs to MyTransferDetails.vue not in the shared component
                const myIndex = this.getProducts.findIndex((e)=>e.product_id == this.product_id)
                this.demand = parseInt(this.demand) ?? "1"

                this.tempMove = {...(this.transferData.transferProducts?.[this.editedIndex] ?? this.getProducts[myIndex])}
                this.tempMove.product_id = this.product_id ?? null
                this.tempMove.product_name = this.getProducts?.[myIndex]?.product_name ?? null
                this.tempMove["demand"] = this.demand
            },

            async createTransferProduct(){
                const index = this.onValidateField2()
                // < 0 = If there's no error
                if(index<0){
                    this.cleanseField2()
                    this.findProductAfterSelected()
                    this.transferData.transferProducts.push(this.tempMove)
                    this.addedTransferProducts.push({
                        product_id: this.product_id,
                        demand: this.demand
                    }) 
                    this.changeStateDiaglog()
                }
            },

            onValidateField1(){
                const myList = []
                for(const i in this.validationField1){
                    this.validationField1[i].myFunction()
                    const error = this.validationField1[i].value != null
                    myList.push(error)
                }
                const index = myList.findIndex((e)=>e)
                return index
            },

            onValidateField2(){
                const myList = []
                // Valide each field 
                for(const i in this.validationField2){
                    this.validationField2[i].myFunction()
                    const error = this.validationField2[i].value != null
                    myList.push(error)
                }
                // Find field to check if there's any errors
                const index = myList.findIndex((e)=>e)
                return index
            },

            resetValidationField1(){
                for(const i in this.validationField1){
                    this.validationField1[i].value=null
                }
            },

            resetValidationField2(){
                for(const i in this.validationField2){
                    this.validationField2[i].value=null
                }
            },
            
            cleanseField2(){
                this.demand = this.demand.trim()
            },

            updateField(){
                const index = this.onValidateField2()

                if(index<0){
                    this.findProductAfterSelected()
                    
                    this.transferData.transferProducts[this.editedIndex] = {...this.tempMove}
                    
                    const alreadyUpdatedTransferProduct = this.updatedTransferProducts.findIndex((e) => e.id == this.editedId)
                    const transfer = {
                        product_id: this.product_id,
                        demand: this.demand
                    }

                    const UpdateTransfer = {
                        id: this.editedId,
                        updates: transfer
                    } 

                    if(alreadyUpdatedTransferProduct>=0){
                        this.updatedTransferProducts[alreadyUpdatedTransferProduct] = UpdateTransfer
                    }else if(this.tempMove.id!=null){
                        this.updatedTransferProducts.push(UpdateTransfer)
                    }
                    else{
                        this.addedTransferProducts[this.findIndexUpdatedPositionLocalProduct] = transfer
                    }
                    
                    this.changeStateDiaglog()
                }
            },

            adminOrUser(){
                return this.getUserRole == roleGroupId.Admin
            },

            validateAndSubmit(e){
                const index = this.onValidateField1();
                if(index<0){
                    // TODO: Implement Proper Time conversion to API
                    // this.transferData.scheduledDate = this.transferData.scheduledDate.toUTCString()
                    this.$emit('onClickSubmit', this.transferData, this.addedTransferProducts, this.updatedTransferProducts,  this.deletedTransferProducts, this.userSelector)
                }
                e.preventDefault();
            },

            promptEditField(data){
               if(!this.FieldNotActive) {
                    this.editedIndex = data.index
                    this.product_id = this.data.product_id

                    this.demand = this.data.demand
                    this.changeStateDiaglog()
                }
            },

            changeStateDiaglog(){
                this.promptCreateField=!this.promptCreateField
            },

            onPopUpDeletedPrompt(data){
                this.editedIndex = data.index

                this.messageDeletePrompt.prompt = `Are you sure you want to delete ${ data.data.product_name ?? 'this' }?`
                this.changeDeletedStateDialog()
            },

            changeDeletedStateDialog(){
                this.promptDeleted = !this.promptDeleted
            },

            onConfirmDeletedPrompt(){
                const id = this.transferData.transferProducts[this.editedIndex].id
                if(id!=null){
                    this.deletedTransferProducts.push(id)
                    const index = this.updatedTransferProducts.findIndex((e)=>e.id == id)
                    if(index>=0){
                        this.updatedTransferProducts.splice(index, 1)
                    }
                }
                else{
                    this.addedTransferProducts.splice(this.findIndexUpdatedPositionLocalProduct, 1)
                }
                this.transferData.transferProducts.splice(this.editedIndex, 1)
                
                this.editedIndex=null
                this.changeDeletedStateDialog()
            },

            onFilter(event){
                this.filterValue=event.value
            },

            getTransferTypeName(slotProps){
                return StringFunction.capitalize(slotProps?.transfer_type_name)
            },

            async onLoadProductV2(offset){
                const products = await this.$store.dispatch("products/onFetchProducts", {
                    offset: offset,
                    userId: this.userSelector ?? this.myUserId,
                })

                return products.length
            },

            async onloadRecipientV2(offset){
                const recipients = await this.$store.dispatch("recipient/getRecipients",{
                    offset: offset,
                    userId: this.userSelector ?? this.myUserId
                })
                return recipients.length
            },


            stopLoadingProduct(){
                this.productLoading=false
            },

            stopLoadingRecipient(){
                this.recipientLoading=false
            },

            async findProduct(filterValue){ 
                await this.$store.dispatch("products/onFetchProducts", {
                    offset: 0,
                    // TODO: Find a better solution to get a large amount of products
                    // Possibly, implement pagination on search result
                    limit: 30,
                    searchKey: filterValue,
                    userId: this.userSelector
                })
            },

            async findRecipient(filterValue){
                await this.$store.dispatch("recipient/getRecipients", {
                    offset: 0,
                    searchString: filterValue,
                    user_id: this.userSelector ?? this.myUserId
                })
            },
            
            changeRecipientState(){
                this.promptFindRecipient = !this.promptFindRecipient
            },

            onConfirmSelectRecipientState(){
                this.transferData.recipient = this.getRecipientValue();
                this.changeRecipientState()
            },

            getRecipientValue(){
                const myAddress = this.myContact.street_address? " - "+this.myContact.street_address : "";
                return this.myContact.full_name + myAddress;
            },

            validatedBeforeCreatingRecipient(){
                if(this.adminOrUser()){
                    return this.userSelector!=null;
                }else{
                    return this.myUserId;
                }
            }
        },
        
        watch:{
            promptCreateField(newValue){
                if(!newValue){
                    // Losing focus or stop clicking the row, remove all selected row and stuf
                    this.tempMove={}
                    this.editedIndex=null
                    this.product_id=null
                    this.demand=null

                    this.resetValidationField2()
                }
            },

            FieldNotActive(newValue){
                if(newValue){
                    this.resetValidationField1()
                }
            },

            editedIndex(newValue){
                if(newValue || newValue == 0){
                    this.product_id = this.transferData.transferProducts[newValue].product_id
                    this.demand = this.transferData.transferProducts[newValue].demand
                    this.editedId = this.transferData.transferProducts[newValue].id
                }else{
                    this.product_id=null
                    this.demand=null
                    this.editedId=null
                }
            },

            data(newVal){
                this.initializeData(newVal)
            },

            "transferData.transfer_type_id"(newVal){
                if(newVal!=2){
                    this.showRecipientField = false
                    this.transferData.recipient = null
                }else{
                    this.showRecipientField = true
                }
            },

            promptFindRecipient:{
                immediate:true,
                handler(newValue){
                    if(newValue){
                        // Doing this to ensure that whenever 
                        // a new user in admin is loaded, 
                        // it wouldn't take a contact of the old selected user
                        this.myContact=null

                        try{
                            // TODO: Fix this, everytime the dialog is tap, 
                            // it shoudl have loaded this,
                            // Temp Fix
                            this.onloadRecipientV2(0);
                        }catch(e){
                            console.log(e);
                        }
                    }
                }
            },  
        }
    }
</script>
