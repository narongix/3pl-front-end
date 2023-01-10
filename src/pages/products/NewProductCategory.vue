<template>
    <form @submit.prevent="submitForm">
        <div class="grid">
            <div class="col-9">
                <div class="card">
                    <h5>Add New ProductCategory</h5>
                    <Button label="SAVE" type="submit" class="p-button-success mr-2"/>
                    <hr>
                    <p></p>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="category-name">Category Name</label>
                            <InputText id="category-name" type="text" v-model.trim="categoryName.val"
                                :class="{ 'p-invalid': !categoryName.isValid }" @blur="clearValidity('categoryName')" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import router from '../../router.js'
export default {
    data() {
        return {
            categoryName: {
                val: null,
                isValid: true,
            }
        }
    },
    computed: {
        showValidity() {
            return this.productName.isValid
        }
    },
    methods: {
        async submitForm() {
            this.validateForm();

            if (!this.formIsValid){
                return;
            }
            const actionPayload = {
                category_name: this.categoryName.val,
            };
            try {
                await this.$store.dispatch('products/addProductCategory', actionPayload);
                router.replace('/product-categories');
            } 
             catch (e) {
                console.log(e);
             }
        },
        validateForm(){
            this.formIsValid = true;
            if(this.categoryName.val === ' || this.categoryName.val === null'){
                console.log("Category Name not valid")
                this.formIsValid = false;
                this.categoryName.isValid = false;
            }
        },
        clearValidity(input) {
            this[input].isValid = true;
        }, 
    }
}
</script>