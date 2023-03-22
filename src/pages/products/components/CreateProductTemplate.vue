<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-9">
                <div class="card">
                    <h5>Add New Product</h5>
                    <Button label="SAVE" type="submit" class="p-button-success mr-2" />
                    <hr>
                    <p></p>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="productname">Product Name</label>
                            <InputText id="productname" type="text" v-model.trim="productName.val"
                                :class="{ 'p-invalid': submitted && !productName.val }" />
                            <small class="p-error" v-if="submitted && !productName.val">Product is required.</small>
                            <!-- <text>&emsp;Contact data</text> -->
                        </div>
                        
                        <div class="field col-12 md:col-12">
                            <label for="sku" :class="{'p-error': validationField.sku.val}">Internal Reference</label>
                            <InputText id="sku" type="text" v-model.trim="sku.val" :class="{'p-invalid': validationField.sku.value}" />
                            <small id="sku-help" class="p-error" v-if="validationField.sku.value">{{ validationField.sku.value }}</small>
                        </div>

                        <div class="field col-12 md:col-12">
                            <label for="category-name">Product Category</label>
                            <v-select id="category-name" :options="productCategoryOption" label="category_name"
                                v-model="prodCategory">
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                        <div class="custom">
                                            <p class="custom pl-3" @click="newCategory(search)">Create "{{ search }}"
                                            </p>
                                        </div>
                                    </template>
                                </template>
                            </v-select>
                        </div>
                        <slot name="body"></slot>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
        </template>
    </form>
    <PromptField :loading="promptCreated" @onAccept="onComfirmCreated" @onDecline="onDecline" :message="message">
        <p>{{ message?.prompt ?? "Are you sure you want to create this?" }} <strong>{{ selectedCreated }}</strong>?</p>
    </PromptField>
</template>

<script>
import RetryField from '../../../components/prompt_field/RetryField.vue'
import PromptField from "../../../components/prompt_field/PromptField.vue"
import { mapGetters } from 'vuex';

export default {
    created() {
        this.loadProdCategories();
        this.toLoad = async () => {
            await this.initData();
            await this.onInit?.();
        }
    },
    props:{
        additionalValidation: Function,
        onInit: Function,
        productCategoryOption: Array,
    },
    components: {
        RetryField,
        PromptField
    },
    emits:["onSubmit"],
    data() {
        return {
            validationField:{
                sku:{
                    value: null,
                    validate: ()=>{
                        const haveData = this.sku.val
                        if(!haveData){
                            return this.validationField.sku.value="Reference is required"
                        }
                        this.validationField.sku.value=null
                    }
                }
            },
            promptCreated: false,
            productName: {
                val: null,
            },
            sku: {
                val: null,
            },
            formIsValid: true,
            prodCategory: null,
            selectedCreated: null,
            submitted: false,
            toLoad: null,
            message: {
                failed: "Error Loading Data. Try again?",
                yesButton: "Yes",
                noButton: "No",
                decline: "no",
                accept: "yes",
                prompt: null
            },
            errorToast: {
                severity: "error",
                summary: "Failed",
                detail: "Error Creating Product",
                life: 3000
            }
        };
    },
    computed:{
        ...mapGetters({
            userId: "auth/getUserId",
        })
    },
    methods: {
        async newCategory(name) {
            this.selectedCreated = name
            this.promptCreated = true
            this.message.prompt = `Do you want to create`
        },
        //yes create new data
        async onComfirmCreated() {
            this.promptCreated = false
            const data = {
                category_name: this.selectedCreated
            }
            const newData = await this.$store.dispatch("products/addProductCategory", data);
            this.prodCategory = newData
            this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Created', life: 3000 });
        },
        // cancal create
        onDecline() {
            this.promptCreated = false
        },
        async submitForm() {
            this.submitted = true;
            this.validateForm();
            if (!this.formIsValid) {
                return;
            }
            const actionPayload = {
                name: this.productName.val,
                sku: this.sku.val,
                categoryId: this.prodCategory?.id ?? null
            };

            this.toLoad = () => {
                this.$emit("onSubmit", actionPayload);
            }
        },
        validateForm() {
            this.formIsValid = true;
            if (this.productName.val === '' || this.productName.val === null) {
                this.formIsValid = false;
                this.productName.isValid = false;
            }

            const myList = []
            for(const i in this.validationField){
                this.validationField[i].validate()
                const error = this.validationField[i].value!=null
                myList.push(error)
            }

            const index2 = this.additionalValidation?.() ?? -1; 

            const index = myList.findIndex((e)=>e)
            if(index>=0 || index2>=0){
                this.formIsValid=false
            }
        },
        async loadProdCategories() {
            try {
                await this.$store.dispatch('products/getProdCategories', {
                    userId: this.userId
                });
            } catch (e) {
                console.log(e);
            }
        },
        async initData() {
            await this.$store.dispatch("products/onFetchProducts", {
                offset: 0
            })
        }
    }
}
</script>
<style>
.custom {
    color: rgb(94, 165, 94);
    text-align: start;
    cursor: pointer;
}

.custom:hover {
    background-color: rgba(113, 117, 112, 0.2);
}
</style>

