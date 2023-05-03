<template>
    <div>
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>Import a File</h5>
                    <div class="flex flex-column md:flex-row gap-1">
                        <div v-show="fileNotSelected">
                            <label for="myImport" class="mr-2 myFileImport">
                                <span>Import File</span>
                            </label>
                            <input ref="myImport" id="myImport" type="File" accept=".xlsl, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" title=" " @change="onPickFile">
                            <a href="/files/product_template.xlsx" download="product_template.xlsx">
                                <Button class="mr-2" label="Download Template" severity="help">Download Template</Button>
                            </a> 
                        </div>
                        <div v-show="!fileNotSelected">
                            <Button class="mr-2" label="Proceed" severity="success" @click="onProceed"></Button>
                            <Button label="Discard" severity="secondary" @click="onDiscard"></Button>
                        </div>
                    </div>
                    <p></p>
                    <div class="col-12">
                        <DataTable :value="stageData" 
                        class="p-datatable-sm" 
                        :rowHover="true" 
                        responsiveLayout="scroll" 
                        >
                        <template #empty>
                            <p v-if="fileNotSelected">Please import a file</p>
                            <p v-else>Couldn't find any data...</p>
                        </template>
                        <Column header="File Column">
                            <template #body="{ data }">
                                <p class="mb-0">{{ data.field }}</p>
                                <p class="mb-0 subtitle">{{ data.data }}</p>
                            </template>
                        </Column>

                        <Column header="Odoo Field">
                            <template #body="{ data }">
                                <Dropdown v-model="data.wms" :options="getAllFields" 
                                optionLabel="label" optionValue="field"
                                placeholder="Select a column"
                                ></Dropdown>
                            </template>
                        </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>

        <slot :proceedWithImportOperation="onImport"></slot>


        <Dialog v-model:visible="dataDialog" header="Products To Create" modal :closable="true" style="width: 75vh;">
            <Button label="Import" @click="onPressImportPhaseOne"></Button>
            <DataTable :value="prepData" class="p-datatable-sm" dataKey="id"
            responsiveLayout="scroll"
            >
                <template #empty>Empty...</template>
                <Column field="row" header="Index"></Column>
                <Column field="product_name" header="Product Name"></Column>
                <Column field="category_name" header="Category"></Column>
                <Column field="sku" header="Product Reference"></Column>
                
                <Column field="status" header="Status">
                    <template #body="slot">
                        <font-awesome-icon v-if="!prepData[slot.index].reason.length" :icon="['fas', 'check']" />
                        <font-awesome-icon v-else :icon="['fas', 'xmark']" />
                    </template>
                </Column>

                <Column field="reason" header="Reasons">
                    <template #body="slot">
                        {{ slot.data.reason?.join(", ") }}
                    </template>
                </Column>
            </DataTable>
        </Dialog>
        <RetryField :toLoad="toLoad" errorToast="errorToast"></RetryField>
    </div>
</template>

<style scoped>
    .p-datatable-header{
        background-color: transparent;
    }
    .p-dropdown{
        min-width: 12rem;
    }

    .subtitle{
        font-weight: 400;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-size: 0.8rem;
        color: rgba(162, 162, 162, 0.881);
    }

    .myFileImport{
        display: inline-block;
        cursor: pointer;
        width: 8rem;
        border: 1px solid grey;
        text-align: center;
        align-items: center;
        border-radius: 3px;
        padding: 7px 14px;
        background-color: grey;
    }

    input[type="file"]{
        display: none;
    }

    .myFileImport span{
        display: inline-block;
        vertical-align: top;
        color: white;
        font-weight: normal;
        font-size: -apple--system , BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
</style>

<script>
    import { mapGetters } from 'vuex';
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import { read } from 'xlsx';

    export default{
        props: {
            getUserId: String || null,
        },
        emits: ["onPressImport", "onFinishImport"],
        data() {
            return {
                prepData: [],
                stageData: [],
                dataDialog: false,

                dataList: [],

                fileNotSelected: true,

                toLoad: null
            };
        },
        computed: {
            ...mapGetters({
                getProductCategories: "products/prodCategories"
            }),
            
            getProductCategories(){
                const prodCategories = this.$store.getters["products/prodCategories"].filter((e)=>e.user_id == (this.getUserId ?? e.user_id));
                return prodCategories;
            },

            getAllFields() {
                return [
                    {
                        label: "Product Name",
                        field: "product_name"
                    },
                    {
                        label: "Internal Reference",
                        field: "sku"
                    },
                    {
                        label: "Category",
                        field: "category_name"
                    },
                    {
                        label: "Unknown",
                        field: "unknown"
                    }
                ];
            },
            errorToast() {
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Creating Products!"
                };
            }
        },
        methods: {
            onPressImportPhaseOne(){
                this.$emit('onPressImport', this.onImport);
                this.changeStateDialog();
            },

            onDiscard(){
                // Clear value of importing, otherwise it won't react to the same previous file
                document.getElementById('myImport').value = null;
                this.stageData.length=0;
                this.fileNotSelected = true;
                this.dataList.length = 0;
                this.stageData.length = 0;
            },

            async onPickFile(event){
                if(event.target.files[0]){
                    const file = event.target.files[0];
                    const data = await file.arrayBuffer();
                    const rows = read(data);
                    // SheetNames: ["rise"]
                    // Sheets: {
                        // rise: {
                            // margin:
                            // A1: 
                            // A2:
                        // }    
                    // }
                    const sheetData = rows?.Sheets[rows.SheetNames?.[0] ?? 0];
                    delete sheetData["!margins"];
                    delete sheetData["!ref"];

                    const rowNumberIdentifier = new RegExp(/\d{1,}/);

                    let startingColumn = null;
                    let startLoop = true;

                    let isHeader=true;

                    // Start from 2 because the header is in column 1;
                    let oldIndicator = sheetData[0]?.substring(1, sheetData[0].length);
                    
                    const header = {};
                    const result = [];

                    // let header = true;
                    for(let columnCharacter in sheetData){
                        let indicator = columnCharacter?.substring(1, columnCharacter.length);
                        let characterColumn = columnCharacter[0];
                    
                        if(startingColumn == characterColumn){
                            isHeader=false;
                        }

                        if(startLoop){
                            startingColumn = characterColumn;
                            startLoop=false;
                        }

                        if(isHeader){
                            header[characterColumn] = sheetData[columnCharacter]?.h ?? sheetData[columnCharacter]?.v;
                            oldIndicator = indicator;
                            continue;
                        }

                        // If the old indicator isn't equal to the new one
                        // It means that we're moving into a new row
                        // which mean a different product
                        const newLine = oldIndicator!=indicator;
                        if(newLine){
                            const rowNumber = columnCharacter.match(rowNumberIdentifier);
                            oldIndicator=indicator;
                            result.push({row: rowNumber[0]});
                        }
                        const indexProduct = result.length-1;
                        const columnHeader = header[characterColumn];
                        result[indexProduct][columnHeader] = sheetData?.[columnCharacter]?.h?.trim?.() ?? sheetData?.[columnCharacter]?.v?.trim?.();
                    }
                    this.dataList.push(...result)
                    this.onGetColumnHeader(result[0]);  
                }
                this.fileNotSelected = document.getElementById('myImport').value == null;
            },

            onGetColumnHeader(row){
                for (let key in row) {
                    if(key!='row'){
                        this.stageData.push({
                            field: key,
                            data: row[key],
                            wms: null
                        });
                    }
                }
            },

            async onImport() {
                this.toLoad= async () => {
                    const newProuctListToCreate = this.prepData.filter((e)=>e.reason.length==0);
                    const data = await this.$store.dispatch("products/addMassProduct",{
                        userId: this.getUserId,
                        products: newProuctListToCreate
                    });
                    this.$emit("onFinishImport", data.products, this.prepData.length);
                };
            },

            skuNotExist(product) {
                const haveSku = !product.sku && product.sku != "";
                if (haveSku) {
                    return product.reason?.push("SKU Cannot Be empty");
                }
            },

            onProceed() {
                const copyHardData = this.validate();
                const convertedListTosystem = {};
                this.convertSheetColumnToSystemColumn(convertedListTosystem, copyHardData);
                this.transitionSheetDataAndVerify(convertedListTosystem);

                this.changeStateDialog();
            },
            convertSheetColumnToSystemColumn(convertedListTosystem, copyHardData) {
                for (let i in copyHardData) {
                    const myKey = copyHardData[i].wms;
                    const originalColumn = copyHardData[i].field;
                    
                    convertedListTosystem[originalColumn] = myKey;
                }
            },
            transitionSheetDataAndVerify(convertedListTosystem) {
                for (let i in this.dataList) {
                    this.prepData[i] = {};
                    for (let originalColumnKey in this.dataList[i]) {
                        const systemName = convertedListTosystem[originalColumnKey];
                        this.prepData[i][systemName] = this.dataList[i][originalColumnKey];
                    }
                    this.prepData[i]['row'] = this.dataList[i]['row'];
                    this.prepData[i]["tmpId"] = i;
                    this.prepData[i].reason = [];
                    this.validateProduct(this.prepData[i]);
                    this.skuNotExist(this.prepData[i]);
                }
            },
            validate() {
                const copyHardData = [...this.stageData];
                for (let i in copyHardData) {
                    if (!copyHardData[i].wms || copyHardData[i].wns == "unknown") {
                        delete copyHardData[i];
                    }
                }
                return copyHardData;
            },
            changeStateDialog() {
                this.dataDialog = !this.dataDialog;
            },
            validateProduct(data) {
                const productNameValid = data.product_name && data.name?.trim?.() != "";
                if (!productNameValid) {
                    data.reason?.push("Product Name Cannot Be Empty");
                }
                return productNameValid;
            },
            async categoryExist(categoryName) {
                if(!categoryName){
                    return null;
                }

                const haveCategory = this.getProductCategories.findIndex((e) => {
                    return (e?.category_name ?? "").toLowerCase().trim() == (categoryName ?? "").toLowerCase().trim();
                });

                if (haveCategory < 0) {
                    const addProdCat = {
                        category_name: categoryName,
                        user_id: this.createMassProductUserId
                    };
                    const newCat = await this.$store.dispatch("products/addProductCategory", addProdCat);
                    return newCat.id;
                }
                return this.getProductCategories[haveCategory].id;
            },
        },
        components: { RetryField }
    }
</script>