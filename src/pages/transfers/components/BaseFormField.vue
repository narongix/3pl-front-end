<template>
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
                        <!-- <Dropdown :options="rise" v-model="ree" :virtualScrollerOptions="{lazy:true, onLazyLoad: testtt, showLoader:true, loading: false}"></Dropdown> -->
                        
                        <div class="field col-12 md:col-3 sm:col-12">
                            <label for="scheduleDate" :class="{'p-error': validationField1.scheduledDate.value}">Schedule Date</label>
                            <Calendar :manualInput="false" :showIcon="true" :disabled="FieldNotActive || disabledField['scheduleDate']" id="scheduleDate" v-model="transferData.scheduledDate" :showTime="true" hourFormat="12" showButtonbar="true"/>
                            <small id="scheduleDate-help" class="p-error" v-if="validationField1.scheduledDate.value">Cannot be Empty</small>
                        </div>

                        <div class="field col-12 md:col-3 sm:col-12">
                            
                            <label for="transfer_type_id" :class="{'p-error': validationField1.transfer_type_id.value}">Transfer Type</label>
                            <Dropdown :disabled="FieldNotActive || disabledField['transfer_type_id']" 
                            id="transfer_type_id" v-model="transferData.transfer_type_id" 
                            :options="transfer_type" :optionLabel="getTransferTypeName" 
                            :class="{'p-invalid': validationField1.transfer_type_id.value}" 
                            :placeholder="transferLoading? 'Loading' : 'Please select a transfer'" 
                            :loading="transferLoading" optionValue="transfer_type_id" :selectOnFocus="true" 
                            :filterMessage="filterMessage">
                            <!-- <template #value="slotProps" >
                                <p v-if="slotProps.value">{{ getDisplayText(slotProps) }}</p>
                                
                                <p v-else>{{ slotProps.placeholder }}</p>
                            </template>
                            <template #option="slotProps">
                                <p>{{ getDisplayText(slotProps) }}</p>
                            </template> -->
                        </Dropdown>
                            <small id="transfer_type_id-help" class="p-error" v-if="validationField1.transfer_type_id.value">Cannot be Empty</small>
                        </div>

                        <div v-if="showRecipientField" class="field col-12 md:col-3 sm:col-12">
                            <label for="recipient" :class="{'p-error': validationField1.contact_id.value}">Recipient</label>
                            
                            <Dropdown :disabled="FieldNotActive || disabledField['recipient']" 
                            id="recipient" v-model="transferData.contact_id" 
                            :options="tempReceipientList" optionLabel="full_name" 
                            :class="{'p-invalid': validationField1.contact_id.value}" 
                            placeholder="Please select a recipient" 
                            optionValue="contact_id" :selectOnFocus="true" :filter="true"
                            :virtualScrollerOptions="{lazy:true, onLazyLoad: onloadRecipient, showLoader:true, loading: recipientLoading, itemSize: 38}">

                                <template #emptyfilter>
                                    <p :onload="findRecipient()">No Result Found!</p>
                                </template>
                            </Dropdown>
                            <!-- <InputText :disabled="FieldNotActive || disabledField['recipient']" id="recipient=" type="text" v-model="transferData.recipient"></InputText> -->
                            <small id="recipient-help" class="p-error" v-if="validationField1.contact_id.value">Cannot be Empty</small>
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
                :paginator="true" class="p-datatable-gridlines" :rows="10" datakey="productId" :rowHover="true" responsiveLayout="scroll">
                    <template #empty>
                        <p :class="{'p-error': validationField1.transferProducts.value}">Please create transfer detail</p>
                    </template>
                    <Column field="product_name" header="Name" style="min-width:12rem">
                        <template #body="{ data }">
                            <p :class="{highlight: !FieldNotActive}">{{ data.product_name }}</p>
                        </template>
                    </Column>
                    <Column field="demand" header="Demands" style="min-width:12rem">
                        <template #body="{ data }">
                            <p :class="{highlight: !FieldNotActive}">{{ data.demand }}</p>
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

    <Dialog v-model:visible="promptCreateField" :style="{width: '450px'}" header="Create New Product" :modal=true>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-12 sm:col-12">
                <label for="product_id" :class="{'p-error': validationField2.product_id.value!=null}">Product Id</label>
                <Dropdown :disabled="FieldNotActive" 
                id="product_id" v-model="product_id" 
                :options="tempProductList"
                :class="{'p-invalid': validationField2.product_id.value}" 
                placeholder="Please select a product" 
                optionValue="product_id" optionLabel="product_name" :filter="true" 
                :selectOnFocus="true" @filter="onFilter" 
                :virtualScrollerOptions="{lazy:true, onLazyLoad: onLoadProduct, showLoader:true, loading: productLoading, itemSize:38}">

                <template #emptyfilter>
                    <p :onload="findProduct()">No Result Found!</p>
                </template>

                <template v-slot:loader="{ options }">
                    <div class="flex align-items-center p-2" style="height: 38px" >
                        <Skeleton :width="options.even ? '60%' : '50%'" />
                    </div>
                </template>

                </Dropdown>
                <small id="product_id-help" class="p-error" v-if="validationField2.product_id.value!=null">{{ validationField2.product_id.value }}</small>
            </div>
            <div class="field col-12 md:col-12 sm:col-12">
                <label for="demand" :class="{'p-error': validationField2.demand.value!=null}">Product Quantity</label>
                <InputText :disabled="FieldNotActive" id="demand" type="text" v-model="demand" :class="{'p-invalid':validationField2.demand.value}"></InputText>
                <small id="demand-help" class="p-error" v-if="validationField2.demand.value!=null">{{ validationField2.demand.value }}</small>
            </div>
        </div>
        <template #footer>
            <Button label="Discard" class="p-button-secondary p-button-text" @click="changeStateDiaglog"></Button>
            <Button v-if="editedIndex!=null" :disabled="productLoading" label="Udate" class="p-button-text" @click="updateField"></Button>
            <Button v-else :disabled="productLoading" label="Create" class="p-button-text" @click="createTransferProduct"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="promptDeleted" :style="{width: '450px'}" header='Confirm' :modal=true>
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span>Are you sure you want to delete this transfer product?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="changeDeletedStateDialog"/>
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="onConfirmDeletedPrompt"></Button>
        </template>
    </Dialog>
</template>

<style scoped>
    .highlight{
        color: var(--primary-color);
    }
</style>

<script>
import { mapGetters } from 'vuex'
    import StringFunction from '../../../components/utils/StringFunction'

    export default{
        created(){
            console.log("treeee: "+JSON.stringify(this.getProducts))
        },
        props:{
            baseData: Object,
            FieldNotActive: Boolean,
            data: Object,
            disabledField: Object,
            // productLoading: Boolean,
        },
        
        emits:["onClickSubmit"],

        data(){
            return {
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

                filterMessage: null,

                transferData:{
                    scheduledDate: null,
                    recipient: null,
                    transfer_type_id:null,
                    contact_id: null,
                    transferProducts: [],
                },

                validationField1:{
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

                    contact_id:{
                        value: null,
                        myFunction:()=>{
                            // id 2 = delivery
                            if(this.transferData.transfer_type_id!=2){
                                return this.validationField1.contact_id.value=null
                            }
                            
                            if (this.transferData.contact_id){
                                return this.validationField1.contact_id.value=null
                            }
                            this.validationField1.contact_id.value="Field cannot be empty!"
                        }
                    },

                    transfer_type_id:{
                        value: null,
                        myFunction: ()=>{
                            if(this.transferData.transfer_type_id){
                                    return this.validationField1.transfer_type_id.value = null
                            }
                            return this.validationField1.transfer_type_id.value = "Cannot be Empty"
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

                offsetProduct: 0,
                limitProduct: 20,
                // To keep track of pages when loading in the dropdown
                // It will load even if we scroll up
                trackPaginationProduct: 0,
                tempProductList:[],


                offsetReceipient:0,
                limitReceipient:20,
                trackPaginationRecipient: 0,
                tempReceipientList:[],

                productLoading: false,
                transferLoading: false,
                recipientLoading:false,

                filterValue: null,
                rise:[1,2],
                ree:null
            }
        },
        computed:{
            ...mapGetters({
                getProducts: "products/products",
                getRecipientsState: "recipient/getRecipientsState",
                transfer_type: "transferType/getTansferType",
                user: "auth/user"
            }),

            getProductLength(){
                console.log("this.getProducts.length: "+JSON.stringify(this.getProducts.length))
                return this.getProducts.length
            },

            getDisplayTranser(){
                return this.transferData.transferProducts.map()
            },
            
            findIndexUpdatedPositionLocalProduct(){
                return this.editedIndex - (this.originalLength - this.deletedTransferProducts.length)
            },
        },

        methods:{
            initializeData(){
                this.transferData={
                    id: this.data?.id,
                    scheduledDate: this.data?.created_at,
                    recipient: this.data?.recipient,
                    transfer_type_id: this.data?.transfer_type_id,
                    transferProducts: this.data?.transfer_products? [...this.data.transfer_products] : [],
                    contact_id: this.data?.contact_id
                }
                this.originalLength = this.data.transfer_products?.length ?? 0
            },

            findProductAfterSelected(){
                // TODO: Either cache the product ID or develop an algorithm for this,
                // also this code belongs to MyTransferDetails.vue not in the shared component
                const myIndex = this.getProducts.findIndex((e)=>e.product_id == this.product_id)
                this.demand = parseInt(this.demand) || ""

               // We do this because it's going to dilute or modify the original temp Product with demand key
                if(this.editedIndex || this.editedIndex==0){
                    this.tempMove = {...this.transferData.transferProducts[this.editedIndex]}
                    this.tempMove.product_id = this.product_id
                    this.tempMove.product_name = this.getProducts[myIndex].product_name
                }
                else{
                    this.tempMove = this.getProducts[myIndex]
                }
                this.tempMove["demand"] = this.demand
            },

            async createTransferProduct(){
                const index = this.onValidateField2()
                // < 0 = If there's no error
                if(index<0){
                    this.cleanseField2
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

            validateAndSubmit(e){
                const index = this.onValidateField1()
                if(index<0){
                    this.$emit('onClickSubmit', this.transferData, this.addedTransferProducts, this.updatedTransferProducts,  this.deletedTransferProducts)
                }
                e.preventDefault();
            },

            promptEditField(data){
               if(!this.FieldNotActive) {
                    this.editedIndex = data.index
                    this.product_id = this.transferData.transferProducts[this.editedIndex].product_id
                    this.demand = this.transferData.transferProducts[this.editedIndex].demand
                    this.changeStateDiaglog()
                }
            },

            changeStateDiaglog(){
                this.promptCreateField=!this.promptCreateField
            },

            onPopUpDeletedPrompt(data){
                this.editedIndex = data.index
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
                console.log("filterValue: "+this.filterValue)
            },

            getTransferTypeName(slotProps){
                return StringFunction.capitalize(slotProps?.transfer_type_name)
            },

            async onloadRecipient(event){
                if(event.last>this.trackPaginationRecipient){
                    // TODO: this pagination only accounts for this page, if the recipient already loaded
                    // there will be be bugs, implement a global offsetRecipient for recipient so it's sync everywhere
                    this.recipientLoading = true
                    this.offsetReceipient=this.offsetReceipient+ this.$store.getters["recipient/getLimit"]

                    await this.$store.dispatch("recipient/getRecipients",{
                        offset: this.offsetReceipient
                    })

                    this.trackPaginationRecipient=event.last
                    this.recipientLoading = false
                }
            },

            async onLoadProduct(event){
                console.log("event: "+JSON.stringify(event))
                console.log("pages: "+this.trackPaginationProduct)
                if(event.last>this.trackPaginationProduct){
                    // TODO: this pagination only accounts for this page, if the product already loaded
                    // there will be be bugs, implement a global offsetProduct for product so it's sync everywhere
                    this.productLoading = true
                    this.offsetProduct = this.offsetProduct + this.$store.getters["products/limit"]
                    console.log("myOffset: " + this.offsetProduct)
                    console.log("offsetProduct: "+this.offsetProduct)
                    
                    await this.$store.dispatch("products/onFetchProducts", {
                        offset: this.offsetProduct,
                    })
                    
                    console.log("getProducts: " + this.getProducts.length)
                    this.trackPaginationProduct=event.last
                    this.productLoading = false
                }
            },
            findProduct(){
                this.productLoading = true
                //TODO: Intergrate search product
                console.log("riseeee")
            },
            findRecipient(){
                this.recipientLoading = true
                //TODO: Intergrate search receipient  
                console.log("loading")
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
                console.log("this.transferData.transferProducts[newValue]?.product_id: "+this.transferData.transferProducts[newValue]?.product_id)
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
                    this.transferData.contact_id = null
                }else{
                    this.showRecipientField = true
                }
            },

            filterMessage(newVal){
                console.log("newVal: "+JSON.stringify(newVal))
            },

            getProducts:{
                handler (newValue){
                    this.tempProductList=[...newValue]
                },
                deep:true,
                immediate:true
            },

            getRecipientsState:{
                handler(newValue){
                    this.tempReceipientList=[...newValue]
                },
                deep:true,
                immediate:true
            }
        }
    }
</script>
