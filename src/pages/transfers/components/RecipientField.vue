<template>
    <Dialog :visible="diaglogState" :modal="true" @update:visible="hideHandler">
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6 sm:col-12">
                <label :class="{'p-error': validationField.firstName.value}">First Name</label>
                <InputText :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" placeholder="Enter your First Name"
                :class="{'p-invalid': validationField.firstName.value}"
                ></InputText>

                <small v-if="validationField.firstName.value">{{ validationField.firstName.value }}</small>
            </div>
            <div class="field col-12 md:col-6 sm:col-12">
                <label>Last Name</label>
                <InputText v-model.trim="form.lastName" placeholder="Enter your Last name"></InputText>
            </div>
            <div class="field col-12 md:col-6 sm:col-12">
                <label>Phone Number</label>
                <InputText v-model.trim="form.phoneNumber" placeholder="Enter your phonenumber"></InputText>
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
            state: Boolean,
            userId: String,
        },
        emits:["update:modelValue", "update:state"],
        data(){
            return {
                form:{
                    firstName: null,
                    lastName: null,
                    phoneNumber: null,
                },

                validationField:{
                    firstName: {
                        value: null,
                        validate: ()=>{
                            if(this.form.modelValue || this.form.firstName){
                                return this.validationField.value=null
                            }
                            this.validationField.value="Cannot be empty"
                        }
                    },
                    lastName:{
                        value: null,
                        validate: ()=>{
                            this.form.lastName = this.form.lastName ?? ""
                        }
                    },
                    phoneNumber:{
                        value:null,
                        validate:()=>{
                            this.form.phoneNumber = this.form.phoneNumber ?? ""
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
            removeAllData(){
                this.form.firstName=null,
                this.form.lastName=null,
                this.form.phoneNumber=null
            },

            onDiscard(){
                this.removeAllData()
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
                    this.form.firstName = this.modelValue
                    const index = this.validate()
                    if(index<0){
                        await this.$store.dispatch("recipient/createRecipient", {
                            firstName: this.form.firstName,
                            lastName: this.form.lastName,
                            phoneNumber: this.form.phoneNumber,
                            userId: this.userId
                        })
                        const phoneNumber = this.form.phoneNumber? " - " + this.form.phoneNumber : "";
                        const newContact = this.form.firstName + " " + (this.form.lastName ?? "") + phoneNumber;
                        this.$emit("update:modelValue", newContact.trim());
                        this.removeAllData();
                        this.changeDiaglogState();
                    }
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