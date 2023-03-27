<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Billing Summary</h5>
                <p></p>

                <MyDataTable v-slot="mySlot" :initializeList="tempData" :row="myRows" :total="total">
                    <DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" :dataKey="mySlot.tmpId"
                        :rowHover="true" responsiveLayout="scroll" @page="onPage($event, mySlot.update)"
                        :rowsPerPageOptions="[10, 20, 30]" v-model:rows="myRows">

                        <template v-if="isAdmin" #header>
                            <slot name="body">
                            </slot>
                        </template>

                        <template #empty>
                            <p>Empty...</p>
                        </template>
                        <Column field="reference" header="Reference">
                            <template #body="{ data }">
                                <ReferenceItem :data="data"></ReferenceItem>
                            </template>
                        </Column>
                        <Column field="month" header="Month"></Column>
                        <Column field="year" header="Year"></Column>
                        <Column field="bill_total" header="Total"></Column>
                        <Column field="bill_status_id" header="Status"></Column>
                        <Column field="created_at" header="CreatedAt">
                            <template #body="{ data }">
                                {{ formatDate(data?.created_at ?? null) }}
                            </template>
                        </Column>
                    </DataTable>
                </MyDataTable>
            </div>
        </div>
        <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingTransfer"></RetryField>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import MyDataTable from '../../../components/MyDataTable.vue'
    import RetryField from '../../../components/prompt_field/RetryField.vue';
    import TimeConvert from '../../../components/utils/TimeConvert';
    import ReferenceItem from './ReferenceItem.vue';
    import { roleGroupId } from '../../../domains/domain';

    export default {
        props: {
            toInitData: Function,
            userSelecter: String,
            rows: Number,
        },
        components: {
            MyDataTable,
            RetryField,
            ReferenceItem,
        },
        emits: ["update:rows"],
        data() {
            return {
                toLoadRetry: null,
                tempData: [],
                total: 0,
            }
        },
        computed: {
            ...mapGetters({
                getUserRole: "auth/getUserRole"
            }),

            myRows: {
                get() {
                    return this.rows;
                },

                set(newValue) {
                    this.$emits("update:rows", newValue);
                }
            },

            message() {
                return {
                    failed: "Error Loading Billing, Try again",
                    yesButton: "Yes",
                    noButton: "No"
                }
            },

            errorToastDeletingTransfer() {
                return {
                    severity: "error",
                    summary: "Error!",
                    detail: "Failed Loading Billing!"
                }
            },
            isAdmin() {
                return this.getUserRole == roleGroupId.Admin;
            }
        },
        methods: {
            async initData() {
                const myData = await this.toInitData?.();

                this.total = myData?.rows_total ?? 0;
                this.tempData = myData?.rows ?? [];
            },

            onPage(event, updateList) {
                this.toLoadRetry = async () => {
                    const billings = await this.$store.dispatch("billing/onFetchBilling", {
                        currentOffset: event.first,
                        limit: this.myRows,
                        userId: this.userSelector
                    })

                    const offset = event.first;
                    const limit = event.row;
                    updateList({ offset: offset, myRows: limit, tempList: billings.rows })
                }
            },

            formatDate(time) {
                return TimeConvert.formatUTCToDate(time)
            }
        },
        watch: {
            userSelecter: {
                immediate: true,
                handler() {
                    this.toLoadRetry = async () => {
                        await this.initData();
                    };
                }
            }
        }
    }
</script>