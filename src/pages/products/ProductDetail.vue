<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Product Details</h5>
                <Button :label="buttonLabel" class="p-button-success mr-2" @click="changeEditMode" />
                <Button v-if="!editDisabled" label="Discard" class="p-button-secondary" @click="discard"></Button>
                <hr>
                <p></p>
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-3">
                        <label for="product-name">Product Name</label>
                        <InputText id="product-name" type="text" :disabled="editDisabled"
                            v-model="product.name.newVal" />
                        <!-- <text>&emsp;Contact data</text> -->
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="sku">Barcode</label>
                        <InputText id="sku" type="text" :disabled=true v-model="product.barcode.newVal" />
                        <!-- <text>&emsp;Operation Type data</text> -->
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="sku">Internal Reference</label>
                        <InputText id="sku" type="text" :disabled="editDisabled" v-model="product.sku.newVal" />
                        <!-- <text>&emsp;Operation Type data</text> -->
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="sku">Universal Product Code (UPC)</label>
                        <InputText id="sku" type="text" :disabled="editDisabled" v-model="product.upc.newVal" />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="product-category">Product Category</label>
                        <v-select id="category-name" :options="prodCategories" label="category_name"
                            v-model="product.prodCategory.newVal" :disabled="editDisabled">
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
                    <div class="field col-12 md:col-12"></div><!-- empty space -->
                    <div class="field col-12 md:col-3">
                        <label for="qty-available">On Hands</label>
                        <InputText id="qty-available" type="text" v-model="product.onhands.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="incoming-qty">Incoming</label>
                        <InputText id="incoming-qty" type="text" v-model="product.incoming.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="outgoing-qty">Outgoing</label>
                        <InputText id="outgoing-qty" type="text" v-model="product.outgoing.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="forecasted-qty">Forecasted</label>
                        <InputText id="forecasted-qty" type="text" v-model="product.forecasted.newVal" :disabled=true />
                    </div>
                    <!-- TODO1: disabled product details field -->
                    <div class="field col-12 md:col-3">
                        <label for="width">Width</label>
                        <InputText id="width" type="text" v-model="product.width.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="length">Length</label>
                        <InputText id="length" type="text" v-model="product.length.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="height">Height</label>
                        <InputText id="height" type="text" v-model="product.height.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="dimension">Dimensions</label>
                        <InputText id="dimension" type="text" v-model="product.dimensions.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-6">
                    </div>
                </div>
            </div>
            <div class="card">
                <DataTable :value="productHistory" :paginator="true" class="p-datatable-gridlines" :rows="10"
                    dataKey="id" :rowHover="true" filterDisplay="menu" responsiveLayout="scroll">
                    <template #empty>
                        No product history found.
                    </template>
                    <Column field="product_id" header="Product Id" style="min-width:12rem"></Column>
                    <Column field="created_at" header="Created at">
                        <template #body="{ data }">
                            {{ convert(data.created_at) }}
                        </template>
                    </Column>
                    <Column field="movement_name" header="Movement Name" style="min-width:12rem"></Column>
                    <Column field="qty" header="Quatity" style="min-width:12rem"></Column>
                    <Column field="serial" header="Serial/Lot Number" style="min-width:12rem"></Column>
                    <Column field="odoo_reference" header="Odoo Reference" style="min-width:12rem"></Column>
                </DataTable>
            </div>
        </div>
    </div>
    <PromptField :loading="promptCreated" @onAccept="onComfirmCreated" @onDecline="onDecline" :message="message">
        <p>{{ message?.prompt ?? "Are you sure you want to create this?" }} <strong>{{ selectedCreated }}</strong>?</p>
    </PromptField>
</template>
<script>
import PromptField from "../../components/prompt_field/PromptField.vue"
import TimeConvert from "../../components/utils/TimeConvert";

export default {
    created() {
        // TODO: REFACTOR LOAD DATA
        this.loadData();
        this.loadProdCategories();
    },
    components: {
        PromptField
    },
    data() {
        return {
            message: {
                failed: "Error Loading Data. Try again?",
                yesButton: "Yes",
                noButton: "No",
                decline: "no",
                accept: "yes",
                prompt: null
            },
            promptCreated: false,
            selectedCreated: null,
            prodCategory: null,
            editDisabled: true,
            productHistory: null,
            products: null,
            product: {
                id: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                name: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                sku: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                prodCategory: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                barcode: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                upc: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                onhands: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                incoming: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                outgoing: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                forecasted: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                // TODO1: waiting api field
                width: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                length: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                height: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                dimensions: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                updatedFields: [],
            }
        }
    },
    methods: {
        onDecline() {
            this.promptCreated = false
        },
        async onComfirmCreated() {
            this.promptCreated = false
            const data = {
                category_name: this.selectedCreated
            }
            const newData = await this.$store.dispatch("products/addProductCategory", data);
            this.prodCategory = newData
            this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Category Created', life: 3000 });
        },
        changeEditMode() {
            this.editDisabled = !this.editDisabled;
            if (this.editDisabled) {
                this.saveData();
            }
        },
        discard() {
            if (typeof this.product.name && (this.product.name.val !== this.product.name.newVal)) {
                this.product.name.newVal = this.product.name.val;
            }
            if (typeof this.product.sku !== "undefined" && (this.product.sku.val !== this.product.sku.newVal)) {
                this.product.sku.newVal = this.product.sku.val;
            }
            if (typeof this.product.upc !== "undefined" && (this.product.upc.val !== this.product.upc.newVal)) {
                this.product.upc.newVal = this.product.upc.val;
            }
            this.editDisabled = !this.editDisabled;
        },
        async loadData() {
            this.products = await this.$store.getters['products/getProductState'].filter(product => {
                return product.product_id == this.$route.params.id;
            })[0];
            // refresh when got data 
            if (!(this.products == null)) {
                localStorage.setItem("localStorageKeys", JSON.stringify(this.products))
            }
            const product = localStorage.getItem("localStorageKeys")
            this.products = JSON.parse(product) // parse json object
            // details product 
            this.product = Object.assign({
                id: {
                    val: this.products.product_id,
                    newVal: this.products.product_id,
                    isValid: true,
                },
                name: {
                    val: this.products.product_name,
                    newVal: this.products.product_name,
                    isValid: true
                },
                sku: {
                    val: this.products.sku,
                    newVal: this.products.sku,
                    isValid: true,
                },
                upc: {
                    val: this.products.upc,
                    // ?? null safety
                    // newVal: this.products.upc ?? "null",
                    newVal: this.products.upc,
                    isValid: true,
                },
                prodCategory: {
                    val: this.products.category_name,
                    newVal: this.products.category_name, 
                    isValid: true,
                },
                barcode: {
                    val: this.products.barcode,
                    newVal: this.products.barcode,
                    isValid: true,
                },
                onhands: {
                    val: this.products.on_hands,
                    newVal: this.products.on_hands,
                    isValid: true,
                },
                incoming: {
                    val: this.products.incoming,
                    newVal: this.products.incoming,
                    isValid: true,
                },
                outgoing: {
                    val: this.products.outgoing,
                    newVal: this.products.outgoing,
                    isValid: true,
                },
                forecasted: {
                    val: this.products.forecasted,
                    newVal: this.products.forecasted,
                    isValid: true,
                },
                // TODO1: waiting api field
                width: {
                    val: this.products.width,
                    newVal: this.products.width,
                    isValid: true,
                },
                length: {
                    val: this.products.length,
                    newVal: this.products.length,
                    isValid: true,
                },
                height: {
                    val: this.products.height,
                    newVal: this.products.height,
                    isValid: true,
                },
                dimensions: {
                    val: this.products.dimensions,
                    newVal: this.products.dimensions,
                    isValid: true,
                }
            })

            await this.$store.dispatch("products/getDetailProduct", this.$route.params.id);
            this.productHistory = this.listDetail.product_moves
        },
        async newCategory(name) {
            this.selectedCreated = name
            this.promptCreated = true
            this.message.prompt = `Do you want to create`
        },
        async saveData() {
            let actionPayload = {
                id: this.product.id.newVal,
                prodCategory: this.product.prodCategory.newVal.id ?? "null"
            }
            for (const field of Object.keys(this.product)) {
                if (this.product[field].val !== this.product[field].newVal) {
                    actionPayload[field] = this.product[field].newVal;
                }
            }
            // refresh after save data 
            const refresh = await this.$store.dispatch('products/updateProduct', actionPayload);
            localStorage.setItem("localStorageKeys", JSON.stringify(refresh))
        },
        async loadProdCategories() {
            try {
                await this.$store.dispatch('products/getProdCategories', {});
            } catch (e) {
                console.log(e);
            }
        },
        convert(time){
            return TimeConvert.formatDateFromScheduleDate(time)
        }
    },
    computed: {
        barcode() {
            if (!this.product) {
                return this.product.barcode;
            } else {
                return null;
            }
        },
        buttonLabel() {
            let label = "";
            if (this.editDisabled) {
                label = "Edit";
            } else {
                label = "Save"
            }
            return label;
        },
        updatedName() {
            return this.product.name.val === this.product.name.newVal ? false : true;
        },
        prodCategories() {
            return this.$store.getters['products/prodCategories'];
        },
        listDetail() {
            const products = this.$store.getters['products/getProductState'].filter(product => {
                return product.product_id == this.$route.params.id;
            })[0];
            return products
        }
    },
}
</script>

