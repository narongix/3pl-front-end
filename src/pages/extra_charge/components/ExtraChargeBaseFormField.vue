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
        emits:["onCreate"],
        data(){
            return {
                myData:{
                    item_code: null,
                    description: null,
                    amount: null,
                    long_description: null,
                },
                validationField:{
                    item_code:{
                        value: null,
                        validate: ()=>{
                            if(this.myData.item_code){
                                return this.validationField.item_code.value=null;
                            }
                            return this.validationField.item_code.value = "Cannot Be Empty";
                        }
                    },
                    description:{
                        value: null,
                        validate: () => {
                            if(this.myData.description){
                                return this.validationField.description.value=null;
                            }
                            return this.validationField.description.value = "Cannot Be Empty";
                        }
                    },
                    amount:{
                        value: null,
                        validate: () => {
                            if(!this.myData.amount){
                                return this.validationField.amount.value = "Cannot be Empty";
                            }
                            if(isNaN(Number(this.myData.amount.trim()))){
                                return this.validationField.amount.value="Must Contain Number Only";
                            }else{
                                this.myData.amount=Number(this.myData.amount.trim());
                                return this.validationField.amount.value=null;
                            }
                        }
                    }
                }
            };
        },
        computed:{
        },
        methods:{
            onCreate(){
                if(this.validate()){
                    this.$emit("onCreate", this.myData);
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
    }
</script>