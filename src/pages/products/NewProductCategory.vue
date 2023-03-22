<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-9">
                <div class="card">
                    <h5>Add New ProductCategory</h5>
                    <Button label="SAVE" type="submit" class="p-button-success mr-2" />
                    <hr>
                    <p></p>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="category-name">Category Name</label>
                            <InputText id="category-name" type="text" v-model.trim="categoryName.val"
                                :class="{ 'p-invalid': submitted && !categoryName.val }" />
                            <small class="p-error" v-if="submitted && !categoryName.val">Category is required.</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template>
            <RetryField :toLoad="toLoad" :message="message" :errorToast="errorToast"></RetryField>
        </template>
    </form>
</template>
<script>
import RetryField from '../../components/prompt_field/RetryField.vue'

export default {
    components: {
        RetryField
    },
    data() {
        return {
            categoryName: {
                val: null,
            },
            formIsValid: true,
            submitted: false,
            toLoad: null,
            // click to create show stt
            message: {
                failed: "Error Loading Data. Try again?",
                yesButton: "Yes",
                noButton: "No"
            },
            errorToast: {
                severity: "error",
                summary: "Failed",
                detail: "Error Creating Product Category",
                life: 3000
            }
        }
    },
    computed:{
        getUserId(){
            return this.$store.getters["auth/getUserId"];
        }
    },
    methods: {
        async submitForm() {
            // when created failed internet 
            // this.message.failed="Error Creating Data, Retry?"
            this.submitted = true;
            this.validateForm();
            if (!this.formIsValid) {
                return;
            }
            this.toLoad = async () => {
                const actionPayload = {
                    category_name: this.categoryName.val,
                };
                const newProductCat = await this.$store.dispatch('products/addProductCategory', actionPayload);
                await this.$router.push({ name: 'productCategoriesList', query: { id: newProductCat.id, name: actionPayload.category_name } });
                this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Created', life: 3000 });
            }
        },
        validateForm() {
            if (this.categoryName.val === '' || this.categoryName.val === null) {
                this.formIsValid = false;
            } else {
                this.formIsValid = true;
            }
        },
        // Loading 
        async initData() {
            await this.$store.dispatch("products/onFetchProducts", {
                offset: 0
            })
            await this.$store.dispatch("products/getProdCategories", {
                userId: this.getUserId
            });
        }
    },
    created() {
        this.toLoad = this.initData;
    }
}
</script>
