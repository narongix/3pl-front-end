<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-9">
                <div class="card">
                    <h5>Add New Product</h5>
                    <Button label="SAVE" type="submit" class="p-button-success mr-2" @click="submitForm" />
                    <hr>
                    <p></p>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="productname">Product Name</label>
                            <InputText id="productname" type="text" v-model.trim="productName.val"
                                :class="{ 'p-invalid': !productName.isValid }" @blur="clearValidity('productName')" />
                            <!-- <text>&emsp;Contact data</text> -->
                        </div>
                 

                        <div class="field col-12 md:col-12">
                            <label for="sku">Vendor Code (SKU)</label>
                            <InputText id="sku" type="text" v-model.trim="sku.val" />
                            <!-- <text>&emsp;Operation Type data</text> -->
                        </div>
                        <!-- <div class="field col-12 md:col-12">
                            <Dropdown id="prod-cat" v-model="prodCategory" :options="prodCategories" optionLabel="category_name" placeholder="Select One"></Dropdown>
                        </div> -->
                        <div class="field col-12 md:col-12">
                            <label for="category-name">Product Category</label>
                            <v-select id="category-name" :options=prodCategories label="category_name"
                                v-model="prodCategory" taggable>
                            </v-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>

</template>

<script>
import router from '../../router.js';

export default {
    data() {
        return {
            productName: {
                val: null,
                isValid: true,
            },
            sku: {
                val: null,
                isValid: true,
            },

            formIsValid: true,
            prodCategory: null,
            Items: {
                selected_items: []
            },
        };
    },
    created() {
        this.loadProdCategories();
    },
    computed: {
        prodCategories() {
            return this.$store.getters['products/prodCategories'];
        },
        showValidity() {
            return this.productName.isValid
        },
    },
    methods: {
        async submitForm() {
            this.validateForm();

            if (!this.formIsValid) {
                return;
            }
            const actionPayload = {
                name: this.productName.val,
                sku: this.sku.val
            };
            try {
                await this.$store.dispatch('products/addProduct', actionPayload);
                router.replace('/products');
            } catch (e) {
                console.log(e);
            }
        },
        validateForm() {
            this.formIsValid = true;
            if (this.productName.val === '' || this.productName.val === null) {
                console.log("Product Name not valid")
                this.formIsValid = false;
                this.productName.isValid = false;
            }
        },
        clearValidity(input) {
            this[input].isValid = true;
        },
        async loadProdCategories() {
            try {
                await this.$store.dispatch('products/getProdCategories', {});

            } catch (e) {
                console.log(e);
            }
        },
    },
    watch:{
        prodCategory(newVal){
            
            this.Items.selected_items.push(newVal["category_name"]);
            this.$store.dispatch("products/addProductCategory", newVal);
            
            // console.log("New Data " + JSON.stringify(newVal["category_name"]));
        }
    }
    
}
</script>

