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
                            <slot name="importButton">

                            </slot>
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
                                <p class="mb-0 title">{{ data.field }}</p>
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

        <slot :getPrepData="getPrepData" :onDiscard="onDiscard" name="additionalFunction"></slot>

        <Dialog v-model:visible="dataDialog" header="Products To Create" modal maximizable :closable="true" style="width: 75vh;">
            <Button label="Import" @click="onPressImportPhaseOne"></Button>
            <DataTable :value="prepData" class="p-datatable-sm" dataKey="id"
            responsiveLayout="scroll"
            >
                <template #empty>Empty...</template>
                <slot name="dialogColumn">
                    <Column field="row" header="Index"></Column>
                    <Column field="product_name" header="Product Name"></Column>
                    <Column field="category_name" header="Category"></Column>
                    <Column field="sku" header="Product Reference"></Column>
                </slot>

                
                <Column field="status" header="Status">
                    <template #body="slot">
                        <font-awesome-icon v-if="!prepData[slot.index].reason.length" :icon="['fas', 'check']" />
                        <font-awesome-icon v-else :icon="['fas', 'xmark']" />
                    </template>
                </Column>

                <Column field="reason" header="Reasons" style="min-width: 15rem;">
                    <template #body="slot">
                        {{ slot.data.reason?.map((e)=>convertErrorCodeToName(e)).join(", ") }}
                    </template>
                </Column>
            </DataTable>
        </Dialog>
    </div>
</template>

<style src="../assets/styles/style.css"></style>
<style scoped>
    .p-datatable-header{
        background-color: transparent;
    }
    .p-dropdown{
        min-width: 12rem;
    }

    .myFileImport{
        display: inline-block;
        cursor: pointer;
        width: 11.5rem;
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
    import { read } from 'xlsx';
    import { errorCode } from '../domains/domain';
    
    export default{
        props: {
            getAllFields: Object,
            onValidate: {
                type: Function,
                required: true
            }
        },
        emits: ["onPressImport"],
        data() {
            return {
                prepData: [],
                stageData: [],
                dataDialog: false,

                dataList: [],

                fileNotSelected: true,
            };
        },
        methods: {
            convertErrorCodeToName(code){
                return errorCode[code];
            },

            onPressImportPhaseOne(){
                this.$emit('onPressImport', this.prepData);
                this.changeStateDialog();
            },

            getPrepData(){
                return this.prepData;
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
                    
                    const representationHeader = {};
                    const originalHeader = {};
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
                            representationHeader[characterColumn] = sheetData[columnCharacter]?.h ?? sheetData[columnCharacter]?.v;
                            originalHeader[sheetData[columnCharacter]?.h ?? sheetData[columnCharacter]?.v] = null;
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
                            result.push({row: rowNumber[0], ...originalHeader});
                        }
                        const indexProduct = result.length-1;
                        const columnHeader = representationHeader[characterColumn];
                        const value = String(sheetData?.[columnCharacter]?.h ?? sheetData?.[columnCharacter]?.v ?? "").trim();
                        result[indexProduct][columnHeader] = value;
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
                    this.onValidate(this.prepData[i]);
                }
            },
            validate() {
                const copyHardData = [...this.stageData];
                for (let i in copyHardData) {
                    if (!copyHardData[i].wms || copyHardData[i].wms == "unknown") {
                        delete copyHardData[i];
                    }
                }
                return copyHardData;
            },
            changeStateDialog() {
                this.dataDialog = !this.dataDialog;
            },
        }
    }
</script>