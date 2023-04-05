<template>
    <Dialog :visible="diaglogState" :modal="true" @update:visible="hideHandler">
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6 sm:col-12">
                <label :class="{'p-error': validationField.firstName.value}">First Name</label>
                <InputText :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" placeholder="Enter your First Name"
                :class="{'p-invalid': validationField.firstName.value}"
                ></InputText>

                <small v-if="validationField.firstName.value">{{ validationField.firstName.value }}</small>

                <label>Last Name</label>
                <InputText v-model.trim="form.lastName" placeholder="Enter your Last name"></InputText>

                <label>Phone Number</label>
                <InputText v-model.trim="form.phoneNumber" placeholder="Enter your phonenumber"></InputText>
            </div>

            <div class="field col-12 md:col-6 sm:col-12">
                <label :class="{'p-error': validationField.mySelectedCountry.value}">Country</label>
                <div>
                    <Dropdown v-model="form.mySelectedCountry" :options="stateCountry" placeholder="Please select a Country"
                    :class="{'p-invalid': validationField.mySelectedCountry.value!=null}"
                    >
                        <template #option="{ option }">
                            {{ option.country_name }}
                        </template>

                        <template #value="option">
                            {{ option.value?.country_name ?? option.placeholder }}
                        </template>
                    </Dropdown>
                    <small v-if="validationField.mySelectedCountry.value" class="p-error" >{{ validationField.mySelectedCountry.value }}</small>
                </div>
                
                <label :class="{'p-error': validationField.mySelectedCity.value}">City</label>
                <div>
                    <Dropdown v-model="form.mySelectedCity" :options="stateCity" placeholder="Please select a City"
                    :class="{'p-invalid': validationField.mySelectedCity.value!=null}"
                    >
                        <template #option="{ option }">
                            {{ option.city_name }}
                        </template>

                        <template #value="option">
                            {{ option.value?.city_name ?? option.placeholder }}
                        </template>
                    </Dropdown>
                    <small v-if="validationField.mySelectedCity.value" class="p-error" >{{ validationField.mySelectedCity.value }}</small>
                </div>
                
                <div>
                    <label :class="{'p-error': validationField.mySelectedDistrict.value}">District</label>
                    <Dropdown v-model="form.mySelectedDistrict" :options="stateDistrict" placeholder="Please select a District"
                    :class="{'p-invalid': validationField.mySelectedDistrict.value!=null}"
                    >
                        <template #option="{ option }">
                            {{ option.district_name }}
                        </template>

                        <template #value="option">
                            {{ option.value?.district_name ?? option.placeholder }}
                        </template>
                    </Dropdown>
                    <small v-if="validationField.mySelectedDistrict.value" class="p-error" >{{ validationField.mySelectedDistrict.value }}</small>
                </div>
                <div>
                    <label :class="{'p-error': validationField.mySelectedAddress.value}">Street Address</label>
                    <InputText v-model="form.mySelectedAddress" placeholder="Enter your street address"
                    :class="{'p-invalid': validationField.mySelectedAddress.value}"
                    ></InputText>
                    <small v-if="validationField.mySelectedAddress.value" class="p-error" >{{ validationField.mySelectedAddress.value }}</small>

                </div>
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
    import { mapGetters } from 'vuex'
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
                    mySelectedCountry: null,
                    mySelectedCity: null,
                    mySelectedDistrict: null,
                    mySelectedAddress: null,
                },

                validationField:{
                    firstName: {
                        value: null,
                        validate: ()=>{
                            if(this.form.modelValue || this.form.firstName){
                                return this.validationField.firstName.value=null
                            }
                            this.validationField.firstName.value="Cannot be empty"
                        },
                        reset: ()=>{
                            this.validationField.firstName.value=null;
                        }
                    },
                    lastName:{
                        value: null,
                        validate: ()=>{
                            this.form.lastName = this.form.lastName ?? ""
                        },
                    },
                    phoneNumber:{
                        value:null,
                        validate:()=>{
                            this.form.phoneNumber = this.form.phoneNumber ?? ""
                        }
                    },
                    mySelectedCountry:{
                        value:null,
                        validate: ()=>{
                            if(this.form.mySelectedCountry){
                                return this.validationField.mySelectedCountry.value=null;
                            }
                            this.validationField.mySelectedCountry.value="Cannot be empty";
                        },
                        reset: ()=>{
                            this.validationField.mySelectedCountry.value=null;
                        }
                    },
                    mySelectedCity:{
                        value:null,
                        validate: ()=>{
                            if(this.form.mySelectedCity){
                                return this.validationField.mySelectedCity.value=null;
                            }
                            this.validationField.mySelectedCity.value="Cannot be empty";
                        },
                        reset: ()=>{
                            this.validationField.mySelectedCity.value=null;
                        }
                    },
                    mySelectedDistrict:{
                        value:null,
                        validate: ()=>{
                            if(this.form.mySelectedDistrict){
                                return this.validationField.mySelectedDistrict.value=null;
                            }
                            this.validationField.mySelectedDistrict.value="Cannot be empty";
                        },
                        reset: ()=>{
                            this.validationField.mySelectedDistrict.value=null;
                        }
                    },
                    mySelectedAddress:{
                        value:null,
                        validate: ()=>{
                            if(this.form.mySelectedAddress){
                                return this.validationField.mySelectedAddress.value=null;
                            }
                            this.validationField.mySelectedAddress.value="Cannot be empty";
                        },
                        reset: ()=>{
                            this.validationField.mySelectedAddress.value=null;
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
            ...mapGetters({
                getCountry: "user/getCountry",
                getCity: "user/getCity",
                getDistrict: "user/getDistrict"
            }),

            diaglogState:{
                get(){
                    return this.state
                },
                set(value){
                    this.$emit("update:state", value)
                }
            },

            stateCountry(){
                return this.$store.getters["user/getCountry"];
            },
            
            stateCity(){
                this.clearCity();
                const list = this.getCity.filter((e)=>e.country_id == this.form.mySelectedCountry?.id) ?? [];
                return list;
            },

            stateDistrict(){
                this.clearDistrict();
                const myList = this.getDistrict.filter((e)=>e.city_id == this.form.mySelectedCity?.id) ?? [];
                return myList;
            }        
        },
        methods:{
            clearCity(){
                this.form.mySelectedCity = null;
            },

            clearDistrict(){
                this.form.mySelectedDistrict=null;
            },

            removeAllData(){
                this.form.firstName = null;
                this.form.lastName = null;
                this.form.phoneNumber = null;
                this.form.mySelectedCountry = null;
                this.form.mySelectedCity = null;
                this.form.mySelectedDistrict = null;
                this.form.mySelectedAddress = null;
                this.resetValidation();
            },

            resetValidation(){
                for(const i in this.validationField){
                    this.validationField[i]?.reset?.();
                }
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
                this.form.firstName = this.modelValue
                const index = this.validate();
                if(index<0){
                    this.toLoad = async ()=>{
                        const phoneNumber = this.form.phoneNumber? " - " + this.form.phoneNumber : "";
                        const address = `${this.form.mySelectedAddress}, ${this.form.mySelectedDistrict.district_name}, ${this.form.mySelectedCity.city_name}, ${this.form.mySelectedCountry.country_name}`
                        const newContact = this.form.firstName + " " + (this.form.lastName ?? "") + phoneNumber + " - " + address;
                        
                        await this.$store.dispatch("recipient/createRecipient", {
                            firstName: this.form.firstName,
                            lastName: this.form.lastName,
                            phoneNumber: this.form.phoneNumber,
                            userId: this.userId,
                            address: address
                        })
                        this.$emit("update:modelValue", newContact.trim());
                        this.removeAllData();
                        this.changeDiaglogState();
                    }
                }
            },
            validate(){
                const myList = []
                for(const i in this.validationField){
                    this.validationField[i].validate();
                    const error = this.validationField[i].value!=null;
                    myList.push(error);
                }
                const index = myList.findIndex((e)=>e);
                return index;
            }
        }
    }
</script>