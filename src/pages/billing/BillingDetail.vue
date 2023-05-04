<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Billing Summary</h5>
                <p></p>
                <div class="grid">
                    <div class="col-12 sm:col-5 md:col-4 lg:col-4 xl:col-3">
                        <table class="tableClass">
                            <tr>
                                <th>Year</th>
                                <td>{{ data?.billsummary?.year ?? "" }}</td>
                            </tr>
                            <tr>
                                <th>Month</th>
                                <td>{{ data?.billsummary?.month ?? "" }}</td>
                            </tr>
                            <tr>
                                <th>Client</th>
                                <td>{{ data?.billsummary?.full_name ?? getFullName ?? "" }}</td>
                            </tr>
                            <tr>
                                <th>Total Amount</th>
                                <td>{{ roundMyNumber(data?.billsummary?.calculated_bill_total ?? "") }}$</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-0 sm:col-0 md:col-2 lg:col-3 xl:col-5"></div>
                    
                    <div class="col-12 sm:col-7 md:col-6 lg:col-4 xl:col-4">
                        <table class="tableClass extra">
                            <tr>
                                <th>Reference</th>
                                <td>{{ data?.billsummary?.reference ?? ""  }}</td>
                            </tr>
                            <tr>
                                <th>Created At</th>
                                <td>{{ formatDateTime(data?.billsummary?.created_at) }}</td>
                            </tr>
                            <tr>
                                <th>Payment Date</th>
                                <td></td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>{{ convertIdToStatus(data?.billsummary?.bill_status_id) }}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class="wastedSpace"></div>
                <h5>Billing Details</h5>
                <p></p>
                <DataTable scrollable :value="dataList" responsiveLayout="scroll" class="p-datatable-sm"
                selectionMode="single" :metaKeySelection="false"
                v-model:selection="mySelected"
                >
                    <template #header>
                        <h6>Number of Transfers Performed During The Period</h6>
                    </template>

                    <template #empty>
                        <p>Empty...</p>
                    </template>

                    <Column field="transfer_type_name" header="Transfer Type" style="width:15rem;">
                        <template #body="{ data }">
                            <u style="color:blue">{{ capitalizeWord(data.transfer_type_name) }}</u>
                        </template>
                    </Column>
                    <Column field="qty" header="QTY" style="width: 15rem"></Column>
                    <Column field="volume" header="Volume(m³)" style="width: 15rem">
                        <template #body="{ data }">
                            {{ round4Number(data.volume) }}
                        </template>
                        
                    </Column>
                    <Column field="charged_volume" header="Charged Volume" style="width: 15rem;">
                        <template #body="{ data }">
                            {{ round4Number(data.charged_volume ?? "") }}
                        </template>
                    </Column>
                    <Column field="rate" header="Rate">
                        <template #body="{ data }">
                            {{ roundMyNumber(data.rate) }}
                        </template>
                    </Column>
                    <Column field="base_fee" header="Subtotal($)">
                        <template #body="{ data }">
                            {{ roundMyNumber(data.base_fee) }}
                        </template>
                    </Column>
                    
                    <ColumnGroup type="footer">
                        <Row>
                            <Column footer=""></Column>
                            <Column footer=""></Column>
                            <Column footer=""></Column>
                            <Column footer=""></Column>
                            <Column footer="Total"></Column>
                            <Column :footer="roundMyNumber(data?.transfer_trx_summary?.transfer_fee_total ?? 0)"></Column>
                        </Row>
                    </ColumnGroup>
                </DataTable>

                <div class="wastedSpace"></div>
                <h6>Volume Occupied By All Products During the Period</h6>
                <p></p>

                <div class="grid">
                    <div class="col-12 md:col-8">
                        <DataTable scrollable :value="volumeSummary" responsiveLayout="scroll" class="p-datatable-sm">
                            <template #empty>
                                Empty...
                            </template>
                            <Column field="created_at" header="Created At" style="width: 15rem;">
                                <template #body="{ data }">
                                    <LinkParagraph :data="formatDateTime(data.created_at)" @pushing="onClickToVolume(data.created_at)"></LinkParagraph>
                                </template>
                            </Column>
                            
                            <Column field="total_volume" header="Total Volume(m³)" style="width: 15rem;">
                                <template #body="{ data }">
                                    {{ round4Number(data.total_volume) }}
                                </template>
                            </Column>
                            <Column field="rate" header="Rate" style="width: 15rem;"></Column>
                            <Column field="total_volume_fee" header="Subtotal($)">
                                <template #body="{ data }">
                                    {{ roundMyNumber(data.total_volume_fee) }}
                                </template>
                            </Column>
                            <ColumnGroup type="footer">
                                <Row>
                                    <Column footer=""></Column>
                                    <Column footer=""></Column>
                                    <Column footer="Total"></Column>
                                    <Column :footer="roundMyNumber(data?.volume_trx_summary?.total_volume_fee ?? 0)"></Column>
                                </Row>
                            </ColumnGroup>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>

        <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingTransfer"></RetryField>
        <VolumeProductDate v-model:state="myVolumeDetailState" :date="myDate"></VolumeProductDate>
        <DialogTransferType :type="myType" v-model:status="myStatusType" @onExitDialog="onExitDialog"></DialogTransferType>
    </div>
</template>

<style scoped>
    .myBold{
        font-weight: bold;
    }
    .wastedSpace{
        height: 2em;
    }
    div p {
        margin-bottom: 0.5rem;
    }
    .tableClass{
        width: 100%;
    }
    .tableClass td {
        text-align: left;
    }
    .tableClass th{
        text-align: left;
    }
    .extra tr td{
        text-align: left;
    }
</style>

<script>
    import RetryField from '../../components/prompt_field/RetryField.vue';
    import { billStatus } from '../../domains/domain';
    import TimeConvert from '../../components/utils/TimeConvert';
    import StringFunction from '../../components/utils/StringFunction';
    import DialogTransferType from './components/DialogTransferType.vue';
    import { mapGetters } from 'vuex';
    import VolumeProductDate from './VolumeProductDate.vue';
    import LinkParagraph from '../../components/LinkParagraph.vue';
    import { convertToTwoDecimal, convertToFourDecimal } from '../../components/utils/MyNumber';

    export default{
        components: { 
            RetryField,
            DialogTransferType, 
            VolumeProductDate,
            LinkParagraph 
        },

        created() {
            this.toLoadRetry= this.initData
        },
        data() {
            return {
                dataList: [],
                toLoadRetry: null,
                volumeSummary: [],
                data: null,
                mySelected: null,
                myStatusType: null,
                myType: null,

                myVolumeDetailState: false,
                myDate: null,
            };
        },
        computed:{
            message(){
                return {
                    failed: "Error Loading Billing Detail, Try again?",
                    yesButton: "Yes",
                    noButton: "No"
                } 
            },
            errorToastDeletingTransfer(){
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Loading Billing Detail!"
                }
            },
            ...mapGetters({
                getFullName: "auth/getFullName"
            })
        },
        methods:{
            round4Number(data){
                const num = convertToFourDecimal(data);
                return num;
            },

            roundMyNumber(data){
                const num = convertToTwoDecimal(data);
                return num;
            },

            async initData(){
                this.data = await this.$store.dispatch("billing/onFetchDetailBilling", {
                    month: this.$route.query.month, 
                    year: this.$route.query.year,
                });
                this.dataList = this.data.transfer_trx_summary?.lines;

                this.volumeSummary = this.data.volume_trx_summary.volume_transactions;
            },

            convertIdToStatus(id){
                return billStatus?.[id] ?? ""
            },

            formatDateTime(time){
                return TimeConvert.formatUTCToDateNoTime(time);
            },

            capitalizeWord(word){
                return StringFunction.capitalize(word)
            },
            
            onExitDialog(){
                this.mySelected=null;
            },

            onRowTap(event){
                if(event.data){
                    this.myType=event.data?.transfer_type_name;
                    this.myStatusType=true
                }
            },
            onClickToVolume(date){
                this.myDate = TimeConvert.formatDateToStockFormat(date);
                this.myVolumeDetailState = true;
            }
        },

        watch:{
            mySelected(newValue){
                this.myType=newValue?.transfer_type_name;
                // True if there's value, false if there's null
                this.myStatusType=!!newValue
            }
        }
    }
</script>