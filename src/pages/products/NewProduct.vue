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
                            <label for="sku">Vendor Code (SKU)</label>
                            <InputText id="sku" type="text" v-model.trim="sku.val" />
                            <!-- <text>&emsp;Operation Type data</text> -->
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="category-name">Product Category</label>
                            <v-select id="category-name" :options="prodCategories" label="category_name"
                                v-model="prodCategory">
                                <template v-slot:no-options="{ search, searching }">
                                    <template v-if="searching">
                                        <div class="custom">
                                            <p class="custom pl-3" @click="newCategory(search)">Create "{{ search }}"
                                            </p>
                                        </div>
                                    </template>
                                    <!-- <template v-else style="opacity: 0.5">Start typing to search for product categories.</template> -->
                                </template>
                            </v-select>
                        </div>
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
import RetryField from '../../components/prompt_field/RetryField.vue'
import PromptField from "../../components/prompt_field/PromptField.vue"

export default {
    components: {
        RetryField,
        PromptField
    },
    data() {
        return {
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
    created() {
        this.loadProdCategories();
        this.toLoad = this.initData
    },
    computed: {
        prodCategories() {
            return this.$store.getters['products/prodCategories'];
        },
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
            this.toLoad = async () => {
                const newProduct = await this.$store.dispatch('products/addProduct', actionPayload);
                await this.$router.push({ path: '/products', query: { id: newProduct.product_id, name: newProduct.product_name } });
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
        },
        validateForm() {
            this.formIsValid = true;
            if (this.productName.val === '' || this.productName.val === null) {
                this.formIsValid = false;
                this.productName.isValid = false;
            }
        },
        async loadProdCategories() {
            try {
                await this.$store.dispatch('products/getProdCategories', {});

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

