<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Product Details</h5>
                <Button :label="buttonLabel" class="p-button-success mr-2" @click="changeEditMode" />
                <Button v-if="!editDisabled" label="Discard" class="p-button-secondary"
                    @click="discard"></Button>
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
                        <label for="sku">Vendor Code (SKU)</label>
                        <InputText id="sku" type="text" :disabled="editDisabled" v-model="product.sku.newVal" />
                        <!-- <text>&emsp;Operation Type data</text> -->
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="sku">Universal Product Code (UPC)</label>
                        <InputText id="sku" type="text" :disabled="editDisabled" v-model="product.upc.newVal" />
                        <!-- <text>&emsp;Operation Type data</text> -->
                    </div>

                    <div class="field col-12 md:col-3">
                        <label for="product-category">Product Category</label>
                        <InputText id="product-category" type="text" :disabled="editDisabled" />
                        <!-- <text>&emsp;Operation Type data</text> -->
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

                    <Column field="Date" header="Date" style="min-width:12rem">
                        <!-- <template #body="{ data }">
                            
                        </template> -->
                    </Column>


                    <Column field="from" header="From" style="min-width:12rem">
                        <!-- <template #body="{ data }">
 
                        </template> -->
                    </Column>

                    <Column field="to" header="To" style="min-width:12rem">
                        <!-- <template #body="{ data }">
 
                        </template> -->
                    </Column>

                    <Column field="serial-lot" header="Serial/Lot Number" style="min-width:12rem">
                        <!-- <template #body="{ data }">
 
                        </template> -->
                    </Column>

                    <Column field="demand" header="Demand" style="min-width:12rem">
                        <!-- <template #body="{ data }">
 
                        </template> -->
                    </Column>

                    <Column field="done" header="Done" style="min-width:12rem">
                        <!-- <template #body="{ data }">
 
                        </template> -->
                    </Column>





                </DataTable>
            </div>


        </div>

    </div>


</template>
<script>
// import { exportDefaultSpecifier } from '@babel/types';

export default {

    data() {
        return {
            editDisabled: true,
            productHistory: null,
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

                },upc: {
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
                updatedFields: [],
            }
        }
    },

    methods: {
        changeEditMode() {
            this.editDisabled = !this.editDisabled;
            // console.log(this.editDisabled);
            if (this.editDisabled) {
                this.saveData();
            }
        },
        discard() {

            if(typeof this.product.name&&(this.product.name.val!==this.product.name.newVal)){
                this.product.name.newVal = this.product.name.val;
            }
            if(typeof this.product.sku !== "undefined" && (this.product.sku.val!==this.product.sku.newVal)){
                this.product.sku.newVal = this.product.sku.val;
            }
            // console.log(typeof this.product.upc ==="undefined" );
            // if(typeof this.product.upc.newVal === "undefined"){
            //     console.log("UNDEFINED")
            // }
            if(typeof this.product.upc !== "undefined" && (this.product.upc.val!==this.product.upc.newVal)){
                this.product.upc.newVal = this.product.upc.val;
            }

            this.editDisabled = !this.editDisabled;
        },
        async loadData() {

            this.products = await this.$store.getters['products/products'].filter(product => {
                return product.id == this.$route.params.id;
            })[0];

            this.product = Object.assign({

                id: {
                    val: this.products.id,
                    newVal: this.products.id,
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
                    newVal: this.products.upc,
                    isValid: true,
                },
                prodCategory: {
                    val: null,
                    newVal: null,
                    isValid: true,
                },
                barcode: {
                    val: this.products.barcode,
                    newVal: this.products.barcode,
                    isValid: true,

                },
                onhands: {
                    val: this.products.onHands,
                    newVal: this.products.onHands,
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
            })

            // console.log(`Load Data ${JSON.stringify(this.products)}`)

        },
        saveData() {

            console.log(this.product.id.newVal);
            let actionPayload = {
                id: this.product.id.newVal,
            }
            // let temp = {};

            for (const field of Object.keys(this.product)) {
                if (this.product[field].val !== this.product[field].newVal) {
                    actionPayload[field] = this.product[field].newVal;
                }
            }

            // console.log(`actionPayload  after ${JSON.stringify(actionPayload)}`)
            this.$store.dispatch('products/updateProduct', actionPayload);

        }
    },
    created() {
        this.loadData();

        // this.updatedProduct.name.val = product.name;
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
        }

        ///track which fields have been updated
        /// and construct update payload according
        /// to those updates

    }
}

</script>

