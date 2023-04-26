<template>
    <div class="grid">
        <div class="col-12 md:col-6 lg:col-4">
            <div class="card">
                <h5>Extra Charge</h5>
                <slot :onCreate="onCreate" :resetValidation="resetValidation">
                    <Button :label="labelCreateButton" @click="onCreate"></Button>
                </slot>
                <hr>
                <p></p>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12">
                        <label for="item_code" :class="{'p-error': validationField.item_code.value}">Item Code</label>
                        <InputText id="item_code" v-model="myData.item_code"
                        :class="{'p-invalid': validationField.item_code.value}"
                        :disabled="FieldNotActive"
                        ></InputText>
                        <small id="item_code" class="p-error" v-if="validationField.item_code.value">
                            {{ validationField.item_code.value }}
                        </small>
                    </div>

                    <div class="field col-12">
                        <label for="description" :class="{'p-error': validationField.description.value}">description</label>
                        <InputText id="description" v-model="myData.description"
                        :class="{'p-invalid': validationField.description.value}"
                        :disabled="FieldNotActive"
                        ></InputText>
                        <small id="description" class="p-error" v-if="validationField.description.value">
                            {{ validationField.description.value }}
                        </small>
                    </div>

                    <div class="field col-12">
                        <label for="amount" :class="{'p-error': validationField.amount.value}">Amount($)</label>
                        <InputText id="amount" v-model="myData.amount" type="number"
                        :class="{'p-invalid': validationField.amount.value}"
                        :disabled="FieldNotActive"
                        ></InputText>
                        <small id="amount" class="p-error" v-if="validationField.amount.value">
                            {{ validationField.amount.value }}
                        </small>
                    </div>

                    <div class="field col-12">
                        <label for="longDesc">Long Description(optional)</label>
                        <InputText id="longDesc" v-model="myData.long_description" type="text"
                        :disabled="FieldNotActive"
                        ></InputText>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            labelCreateButton: {
                type: String,
                default: ()=>"Create"
            },
            FieldNotActive:{
                type: Boolean,
                default: ()=>false
            },
            data:{
                type: Object,
                default:()=>{}
            }
        },
        emits:["onCreate", "update:data"],
        data(){
            return {
                myData:{},

                validationField:{
                    item_code:{
                        value: null,
                        validate: ()=>{
                            if(this.myData?.item_code && this.myData?.item_code?.trim() != ""){
                                this.myData.item_code = this.myData.item_code.trim();
                                return this.validationField.item_code.value=null;
                            }
                            return this.validationField.item_code.value = "Cannot Be Empty";
                        }
                    },
                    description:{
                        value: null,
                        validate: () => {
                            if(this.myData?.description && this.myData?.description?.trim() != ""){
                                this.myData.description = this.myData.description.trim()
                                return this.validationField.description.value=null;
                            }
                            return this.validationField.description.value = "Cannot Be Empty";
                        }
                    },
                    amount:{
                        value: null,
                        validate: () => {
                            if(!this.myData?.amount){
                                return this.validationField.amount.value = "Cannot be Empty";
                            }
                            const number = typeof this.myData?.amount == "number" ? this.myData?.amount : Number(this.myData?.amount?.trim() ?? 0)
                            if(isNaN(number)){
                                return this.validationField.amount.value="Must Contain Number Only";
                            }else{
                                this.myData.amount = number;
                                return this.validationField.amount.value=null;
                            }
                        }
                    },
                    long_description:{
                        value:null,
                        validate: () => {
                            if(this.myData.long_description && this.myData?.long_description?.trim() != '')
                            this.myData.long_description = this.myData.long_description.trim();
                            return null;
                        }
                    }
                },

                originalData: null,
            };
        },
        computed:{
            myKey(){
                return {
                    item_code: "item_code",
                    description: "description",
                    amount: "amount",
                    long_description: "long_description"
                };
            }
        },
        methods:{
            copyData(data){
                this.originalData = JSON.parse(JSON.stringify(data));
                this.myData = JSON.parse(JSON.stringify(data));
                delete this.originalData["created_at"];
                delete this.originalData["updated_at"];
            },

            onCreate(){
                if(this.validate()){
                    const newData = {};
                    for(let i in this.myKey){
                        if(this.originalData[i] != this.myData[i]){
                            newData[i] = this.myData[i];
                        }
                    }
                    this.$emit("onCreate", newData);
                }
            },

            validate(){
                const list = [];
                for(let i in this.validationField){
                    this.validationField[i].validate();
                    list.push(this.validationField[i].value);
                }
                const index = list.findIndex((e)=>e!=null);
                return index<0;
            },

            resetValidation(){
                for(let i in this.validationField){
                    this.validationField[i].value=null;
                }
            }
        },
        watch:{
            data:{
                immediate: true,
                handler(newValue){
                    this.copyData(newValue);
                }
            }
        }
    }
</script>