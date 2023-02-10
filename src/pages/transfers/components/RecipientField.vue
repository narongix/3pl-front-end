<template>
    <Dialog :visible="diaglogState" :modal="true" @update:visible="hideHandler">
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6 sm:col-12">
                <label :class="{'p-error': validationField.first_name.value}">First Name</label>
                <InputText :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" placeholder="Enter your First Name"
                :class="{'p-invalid': validationField.first_name.value}"
                ></InputText>

                <small v-if="validationField.first_name.value">{{ validationField.first_name.value }}</small>
            </div>
            <div class="field col-12 md:col-6 sm:col-12">
                <label>Last Name</label>
                <InputText v-model.trim="form.last_name" placeholder="Enter your Last name"></InputText>
            </div>
            <div class="field col-12 md:col-6 sm:col-12">
                <label>Phone Number</label>
                <InputText v-model.trim="form.phone_number" placeholder="Enter your phonenumber"></InputText>
            </div>
        </div>

        <template #footer>
            <Button label="Discard" @click="onDiscard" class="p-button-raise p-button-danger"></Button>
            <Button label="Create" @click="validateAndSubmit" class="p-button-raised p-button-success"></Button>
        </template>
    </Dialog>

    <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
</template>

<script>
    import RetryField from '../../../components/prompt_field/RetryField.vue'

    export default{
        components:{
            RetryField
        },

        props:{
            modelValue: String,
            state: Boolean
        },
        emits:["update:modelValue", "update:state"],
        data(){
            return {
                form:{
                    first_name: null,
                    last_name: null,
                    phone_number: null,
                },

                validationField:{
                    first_name: {
                        value: null,
                        validate: ()=>{
                            if(this.form.modelValue || this.form.first_name){
                                return this.validationField.value=null
                            }
                            this.validationField.value="Cannot be empty"
                        }
                    },
                    last_name:{
                        value: null,
                        validate: ()=>{
                            this.form.last_name = this.form.last_name ?? ""
                        }
                    },
                    phone_number:{
                        value:null,
                        validate:()=>{
                            this.form.phone_number = this.form.phone_number ?? ""
                        }
                    }
                },

                toLoad: null,
                message:{
                    failed: "Failed to create, Retry?",
                    yesButton: "Yes",
                    noButton: "No"
                },

                errorToast:{
                    severity:"error",
                    summary: "Error!",
                    detail: "Failed Creating Recipient!"
                },
            }
        },
        computed:{
            diaglogState:{
                get(){
                    return this.state
                },
                set(value){
                    this.$emit("update:state", value)
                }
            }
        },
        methods:{
            onDiscard(){
                this.form.first_name=null,
                this.form.last_name=null,
                this.form.phone_number=null,
                this.changeDiaglogState()
            },
            
            changeDiaglogState(){
                this.diaglogState = !this.diaglogState
            },

            hideHandler(value){
                if(!value){
                    this.diaglogState=false
                }
            },

            validateAndSubmit(){
                this.toLoad = async ()=>{
                    this.form.first_name = this.modelValue
                    const index = this.validate()
                    if(index<0){
                        await this.$store.dispatch("recipient/createRecipient", {
                            recipient: this.form
                        })
                    }
                    this.diaglogState=false
                }
            },
            validate(){
                const myList = []

                for(const i in this.validationField){
                    this.validationField[i].validate()
                    const error = this.validationField[i].value!=null
                    myList.push(error)
                }

                const index = myList.findIndex((e)=>e)
                return index
            }
        }
    }
</script>