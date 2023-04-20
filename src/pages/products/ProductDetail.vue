<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Product Details/{{ $route.params.id }}</h5>
                <Button :label="buttonLabel" class="p-button-success mr-2" @click="changeEditMode" />
                <Button v-if="!editDisabled" label="Discard" class="p-button-secondary" @click="discard"></Button>
                <Button :disabled="false" severity="danger" label="Delete" @click="confirmDeleteProduct"></Button>
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
                </div>
            </div>
            <div class="card">
                <h5>Specification</h5>
                <hr>
                <p></p>
                <div class="p-fluid formgrid grid">
                    <!-- TODO1: disabled product details field -->
                    <div class="field col-12 md:col-3">
                        <label for="width">Width(cm)</label>
                        <InputText id="width" type="text" v-model="product.width.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="length">Length(cm)</label>
                        <InputText id="length" type="text" v-model="product.length.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="height">Height(cm)</label>
                        <InputText id="height" type="text" v-model="product.height.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="weight">Weight(cbm)</label>
                        <InputText id="weight" type="text" v-model="product.weight.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="dimension">Dimensions</label>
                        <InputText id="dimension" type="text" v-model="product.dimensions.newVal" :disabled=true />
                    </div>
                    <div class="field col-12 md:col-3">
                        <label for="volume">Volumes(m³)</label>
                        <InputText id="volume" type="text" v-model="product.volume.newVal" :disabled=true />
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="p-fluid formgrid grid">
                    <div class="field col-12 md:col-4">
                        <FromDate v-model="fromDate" :rows="rows" @onSelectDate="onSelectDate"></FromDate>
                    </div>
                    <div class="field col-12 md:col-4">
                        <ToDate v-model="toDate" :rows="rows" @onSelectDate="onSelectDate"></ToDate>
                    </div>

                    <div class="field col-12 md:col-4">
                        <label>Preset</label>
                        <Dropdown v-model="myPresetValue" :options="getPresetFilter" @change="onSelectPreset"
                            optionLabel="name" optionValue="id" showClear>
                        </Dropdown>
                    </div>
                </div>
                <DataTable :value="dataList" :paginator="true" class="p-datatable-gridlines" :rows="10"
                    dataKey="id" :rowHover="true" filterDisplay="menu" responsiveLayout="scroll" @page="onPage($event)">
                    <template #empty>
                        No product history found.
                    </template>

                    <Column field="created_at" header="Created at">
                        <template #body="{ data }">
                            {{ convert(data.created_at) }}
                        </template>
                    </Column>
                    <Column field="movement_name" header="Movement" style="min-width:12rem"></Column>
                    <Column field="qty" header="Quantity" style="min-width:12rem"></Column>
                    <Column field="serial" header="Serial/Lot Number" style="min-width:12rem"></Column>
                    <Column field="odoo_reference" header="Odoo Reference" style="min-width:12rem"></Column>
                </DataTable>
            </div>
        </div>
    </div>
    <PromptField :loading="promptCreated" @onAccept="onComfirmCreated" @onDecline="onDecline" :message="message">
        <p>{{ message?.prompt ?? "Are you sure you want to create this?" }} <strong>{{ selectedCreated }}</strong>?</p>
    </PromptField>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm"
        :modal="true">
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product">Are you sure you want to delete <b>{{ product.product_name }}</b>?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text"
                @click="deleteProductDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
        </template>
    </Dialog>
    <RetryField :toLoad="toLoad" :message="messageV2"></RetryField>
</template>

<script>
    import PromptField from "../../components/prompt_field/PromptField.vue"
    import TimeConvert from "../../components/utils/TimeConvert";
    import RetryField from "../../components/prompt_field/RetryField.vue";
    import FromDate from "../../components/FromDate.vue";
    import ToDate from "../../components/ToDate.vue";
    import { mapGetters } from "vuex";
    import MyNumber from "../../components/utils/MyNumber";

    export default {
        components: {
            RetryField,
            PromptField,
            FromDate,
            ToDate,
        },
        created() {
            // TODO: REFACTOR LOAD DATA
            this.loadData();
        },
        data() {
            return {
                toLoad: null,
                messageV2: {
                    failed: "Error Loading Data. Try again?",
                    yesButton: "Yes",
                    noButton: "No",
                },
                errorToastDeletingProduct: {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Deleting Product!"
                },
                deleteProductDialog: false,

                message: {
                    failed: "Error Loading Data. Try again?",
                    yesButton: "Yes",
                    noButton: "No",
                    decline: "no",
                    accept: "yes",
                    prompt: null
                },
                productV2: null,
                promptCreated: false,
                selectedCreated: null,
                prodCategory: null,
                editDisabled: true,
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
                    weight: {
                        val: null,
                        newVal: null,
                        isValid: true,
                    },
                    dimensions: {
                        val: null,
                        newVal: null,
                        isValid: true,
                    },
                    volume: {
                        val: null,
                        newVal: null,
                        isValid: true,
                    },
                    updatedFields: [],
                },

                toDate: null,
                fromDate: null,
                rows: 10,
                productMovesLenght: null,
                dataList: [],
                myPresetValue: null,
                myPageNumber: 0
            }
        },

        computed: { 
            ...mapGetters({
                myUserId: "auth/getUserId"
            }),
            getPresetFilter(){
                return [
                    {
                        name: "Today",
                        id: 1
                    },
                    {
                        name: "This Month",
                        id:0
                    },
                    {
                        name: "Previous Month",
                        id:2
                    }
                ];
            },

            presetOption(){
                return {
                    0: this.goToThisMonth,
                    1: this.goToToday,
                    2: this.goBackByOneMonth,
                    null: ()=>this.clearDate(this.myPageNumber)
                }
            },

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
        methods: {
            convertMyNum(data){
                return MyNumber.convertToFourDecimal(data);
            },

            onSelectPreset(){
                this.presetOption[this.myPresetValue]?.();
            },

            initingOrigList(){
                this.dataList.length=0;
                for(let i=0; i<this.productMovesLenght; i++){
                    this.dataList.push({tmpId: i.toString()})
                }
            },

            onPage(event){
                this.myPageNumber = event.page;
                
                this.toLoad = async()=>{
                    const data = await this.$store.dispatch("products/getProductMoves", {
                        productId: this.$route.params.id,
                        fromDate: this.fromDate,
                        toDate: this.toDate,
                        userId: this.myUserId
                    });
                 
                    const offset= event.first
                    const limit = event.rows    
                    this.updateList({start: offset, end:limit, tempList: data.rows})   
                }
            },

            updateList({start, end, tempList}){
                let index=0;
                // say that its suppose to be 20-29
                // start = 20, end 20+row(10) = 30, 20 - 29 (<30)
                for(let i=start; i<end+start; i++){
                    if(!(tempList?.[index])){
                        break;
                    }
                    const myId = this.dataList[i].tmpId;
                    this.dataList[i]={tmpId: myId,...tempList[index]}
                    index++
                }
            },

            goBackByOneMonth(){
                const currentDate = this.fromDate || new Date();
                currentDate.setMonth(currentDate.getMonth()-1)
                const lastDay = TimeConvert.getLastDayOfMonth(currentDate.getMonth(), this.fromDate?.getYear());

                this.setDate({
                    month: currentDate.getMonth(),
                    firstDay: 1,
                    lastDay: lastDay,
                    year: currentDate.getFullYear()
                });
            },


            goToThisMonth(){
                const currentDay = new Date();
                const lastDay = TimeConvert.getLastDayOfMonth(currentDay.getMonth(), currentDay.getFullYear());

                this.setDate({
                    month: currentDay.getMonth(),
                    firstDay: 1,
                    lastDay: lastDay,
                    year: currentDay.getFullYear()
                });
            },

            goToToday(){
                const midnight = new Date();
                const finalTime = new Date();

                midnight.setHours(0,0,0,0);
                finalTime.setHours(23, 59, 59, 999);

                this.fromDate = midnight;
                this.toDate = finalTime;
                this.onSelectDate({limit: this.rows});
            },

            clearDate(){
                this.fromDate = null;
                this.toDate = null;

                this.searchProductMoves({limit: this.rows});
            },

            setDate({month, firstDay, lastDay, year}){
                this.fromDate = new Date(year, month, firstDay);
                this.toDate = new Date(year, month, lastDay);
                this.onSelectDate({limit: this.rows});
            },

            onSelectDate(query){
                if(this.validate()){
                    const pageNumber = query?.pageNumber ?? 0; 
                    this.searchProductMoves(pageNumber);
                }
            },

            searchProductMoves(query){
                this.toLoad = async()=>{
                    const data = await this.$store.dispatch("products/getProductMoves", {
                        productId: this.$route.params.id,
                        fromDate: this.fromDate,
                        toDate: this.toDate,
                        userId: this.myUserId
                    });
                    this.productMovesLenght = data?.rows_total ?? 0;
                    this.initingOrigList();
                    this.updateList({
                        start: (this.myPageNumber || 0) * this.rows,
                        end: query?.limit ?? this.rows,
                        tempList: data?.rows
                    });
                }
            },

            validate(){
                const correctDate = TimeConvert.convertToMs(this.toDate) >= TimeConvert.convertToMs(this.fromDate);
                return correctDate;
            },

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
            async loadData(pageNumber) {
                this.toLoad = async () => {
                    this.productV2 = await this.$store.dispatch("products/getDetailProduct", {productId: this.$route.params.id});
                    this.products = await this.$store.getters['products/getProductState'].find(product => {
                        return product.product_id == this.$route.params.id;
                    });

                    const productMoves = await this.$store.dispatch("products/getProductMoves", {
                        productId: this.$route.params.id,
                        fromDate: this.fromDate,
                        toDate: this.toDate,
                        userId: this.myUserId
                    });

                    this.productMovesLenght = productMoves?.rows_total ?? 0;

                    await this.$store.dispatch('products/getProdCategories', {
                        userId: this.myUserId
                    })

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
                        weight: {
                            val: this.products.weight,
                            newVal: this.products.weight,
                            isValid: true,
                        },
                        dimensions: {
                            val: this.products.dimensions,
                            newVal: this.products.dimensions,
                            isValid: true,
                        },
                        volume: {
                            val: this.convertMyNum(this.products.volume),
                            newVal: this.convertMyNum(this.products.volume),
                            isValid: true,
                        }
                    });


                    this.initingOrigList();
                    this.updateList({start: pageNumber? pageNumber*this.rows : 0, end: this.rows, tempList: productMoves.rows})
                }
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
            convert(time){
                return TimeConvert.formatUTCToDate(time)
            },

            confirmDeleteProduct() {
                this.deleteProductDialog = true;
            },

            async deleteProduct() {
                this.toLoad = async () => {
                    this.deleteProductDialog = false; 
                    const actionPayload = {
                        id: this.productV2.product_id,
                    };
                    await this.$store.dispatch('products/deleteProduct', actionPayload);
                    // this.onDeleteList(this.productV2.product_id)

                    this.productV2 = {};
                    this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
                    this.$router.push({name:'productList'});
                }
            }
        }
    }
</script>

