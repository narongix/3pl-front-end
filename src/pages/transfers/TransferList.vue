<template>
  <CountDown v-slot="MyCountDown" @activateAPI="activateAPI()">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Transfers</h5>
          <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToCreateTransfer"/>
          <p></p>
          
            <DataTable :value="myTransfers" :paginator="true" class="p-datatable-sm" dataKey="id"
                    :rowHover="true" filterDisplay="menu" :loading="isLoading" responsiveLayout="scroll"
                    v-model:selection="mySelected" v-model:filters="filters" @page="onPage($event)" v-model:rows="row"
                    :rowsPerPageOptions="[10,20,30]" sortField="created_at" :sortOrder="-1">
              <template #empty>
                <p :onload="findData(MyCountDown.startCountdown)">No Transfer found.</p>
              </template>

              <Column selectionMode="multiple"></Column>

              <Column field="sku" header="Id" style="min-width:12rem" :sortable="true" :showFilterMatchModes="false">
                <template #body="{ data }">
                  <TransferItem :data="data" :onload="MyCountDown.stopCountDown()"></TransferItem>
                </template>

                <template #filter="{ filterModel, filterCallback }">
                  <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                            placeholder="Search by id"></InputText>
                </template>
              </Column>

              <Column field="reference" header="Internal Reference" :sortable="true" style="min-width:12rem">
              
                <template #filter="{ filterModel, filterCallback }">
                  <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                    placeholder="Search By Reference"
                  ></InputText>
                </template>
              </Column>

              <Column field="transfer_type_id" :sortable="true" style="min-width:12rem" header="Transfer Type">
                <template #body="{ data }">
                  <TransferTypeField :data="data"></TransferTypeField>
                </template>
                
              </Column>

              <Column field="scheduled_time" :sortable="true" style="min-width:14rem" header="Schedule Time"
                      :showFilterMatchModes="false">

                <template #body="{ data }">
                  {{ formatDate(data.scheduled_time) }}
                </template>
                <template #filter>
                  <CalendarTime @getValueMode="storeScheduleTimeMode" @getValue="storeScheduleTimeValue"></CalendarTime>
                </template>
              </Column>

              <Column field="transfer_status_id" :sortable="true" style="min-width:8rem" :showFilterMatchModes="false"
                      header="Status">
                <template #body="{ data }">
                  <TransferStatusField :data='data'></TransferStatusField>
                </template>

                <template #filter = "{filterModel, filterCallback}">
                  <MultiSelect :options="convertToList" v-model="filterModel.value" @change="onInputStatusId($event.value, filterCallback)" optionLabel="name" optionValue="id"
                              class="p-column-filter" placeholder="Search by status"></MultiSelect>
                </template>
              </Column>

              <Column field="recipient" header="Recipient" style="min-width:14rem">
                <template #filter="{ filterModel, filterCallback }">
                  <InputText v-model="filterModel.value" @input="filterCallback()"
                            placeholder="Search by Recipient"></InputText>
                </template>
              </Column>

              <Column field="completed_time" :sortable="true" style="min-width:14rem" header="Complete Time"
                      :showFilterMatchModes="false">
                <template #body="{ data }">
                  {{ formatDate(data.completed_time) }}
                </template>

                <template #filter>
                    <CalendarTime @getValueMode="storeCompleteTimeMode"
                                @getValue="storeCompleteTimeValue"></CalendarTime>
                </template>
              </Column>

              <Column field="created_at" header="Created Time" :showFilterMatchModes="false" style="min-width:14rem" :sortable="true">
                <template #body="{ data }">
                  {{ formatDate(data.created_at) }}
                </template>

                <template #filter>
                  <CalendarTime @getValueMode="storeCreatedAtMode" @getValue="storeCreatedAtValue" @onLoad="loadCalendarParam"></CalendarTime>
                </template>
              </Column>

              

              <!-- <Column headerStyle="min-width:10rem;" header="Actions" style="width:5%">
                <template #body="{ data }">
                  <Button icon="pi pi-trash" class="p-button-rounded p-button-warning m-0"
                          @click="onPressDeletedProduct(data)"/>
                </template>
              </Column> -->
            </DataTable>
          
          <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingTransfer"></RetryField>
          <PromptField :loading="promptDeleted" @onAccept="onConfirmDeletedPrompt" @onDecline="onDecline"
                      :message="message"/>
          <HiddenRetryField :toLoad="toLoadHidden" :message="messageLoading"
                            :errorToast="errorToastLoadingTransfer"></HiddenRetryField>
        </div>
      </div>
      <TransferStatusField></TransferStatusField>
    </div>
  </CountDown>
</template>


<style scoped lang="scss">
@import '@/assets/demo/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>

<script>
  import {FilterMatchMode, FilterOperator} from "primevue/api"
  import {mapGetters} from "vuex"
  import TransferItem from "../transfers/components/TransferItem.vue"
  import myTime from "../../components/utils/TimeConvert.js"
  import RetryField from "../../components/prompt_field/RetryField.vue"
  import PromptField from "../../components/prompt_field/PromptField.vue"
  import HiddenRetryField from "../../components/prompt_field/HiddenRetryField.vue"
  import TransferStatusField from "./components/TransferStatusField.vue"

  import {transferStatus} from "../../domains/domain"
  import CalendarTime from "@/pages/transfers/components/CalendarTime.vue";
  import CountDown from "../../components/CountDown.vue"
  import TransferTypeField from "./components/TransferTypeField.vue"

  export default {
    created() {
      this.toLoadHidden = this.initData
    },
    components: {
      CalendarTime,
      TransferItem,
      RetryField,
      PromptField,
      HiddenRetryField,
      TransferStatusField,
      CountDown,
      TransferTypeField
    },
    data() {
      return {
        loading1: false,
        mySelected: [],
        promptDeleted: false,
        selectedForDelete: null,

        outOfFetch: 1,

        row: 10,

        filters: {
          id: {value: null, matchMode: FilterMatchMode.CONTAINS},
          transfer_status_id: {value: null, matchMode: "MultipleMatchMode"},
          reference: {operator: FilterOperator.AND, constraints:[{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
          scheduled_time: {value: null, matchMode: "datesIn"},
          completed_time: {value: null, matchMode: "datesIn"},
          created_at: {value: null, matchMode: "datesIn"},
          recipient: {operator: FilterOperator.AND, constraints:[{value: null, matchMode: FilterMatchMode.CONTAINS}]}
        },

        toLoadRetry: null,
        toLoadHidden: null,

        filterValueToSearch: null,
        filterParamsToSearch: null,
        emptyMessage: null,

        selectedStatus:null,

        message: {
          failed: "Error Deleting Transfer, Try again",
          yesButton: "Yes",
          noButton: "No",
          decline: "No",
          accept: "Yes",
          prompt: null
        },

        messageLoading: {
          failed: "Error loading Transfer, Try again",
          yesButton: "Yes",
          noButton: "No",
        },

        errorToastDeletingTransfer: {
          severity: "error",
          summary: "Error!",
          detail: "Failed Deleting Transfer!"
        },

        errorToastLoadingTransfer: {
          severity: "error",
          summary: "Error!",
          detail: "Failed Loading Transfer!"
        },
      }
    },
    computed: {
      ...mapGetters({
        myTransfers: "transfers/getTransfers",
        hasTransfers: "transfers/hasTransfers",
        LoginStatus: "isLoggedIn",
      }),

      convertToList() {
        //Transform from an object to list
        const myList = []
        for (const i in transferStatus) {
          myList.push({id: i, name: (transferStatus?.[i] ?? "Error")})
        }
        return myList
      },

      multipleSelectMode() {
        return this.mySelected.length > 0
      },

      accessToken() {
        return localStorage.accessToken;
      },

      isLoading() {
        return this.loading1 && !this.$store.state.transfers.transfers
      },
    },
    methods: {
      onInputStatusId(id, filterCallback){
        //TODO: Interfrate id params
        this.filterParamsToSearch = {
          id: id
        }
        filterCallback()
      },

      async loadCalendarParam(){
        //TODO: Intergrate calendar params
        this.filterParamsToSearch = {date: this.filterValueToSearch }
      },

      async loadIdParam(){
        //TODO: Intergrate id params
        this.filterParamsToSearch = {
          id: this.filterValueToSearch
        }
      },

      async activateAPI(){
        if(this.filterValueToSearch){
        // TODO: Intergrate Search API
        // await this.$store.dispatch("transfers/getTransfers", {

        // })
        }
      },

      findData(startCountDown){
        // For some reason if we emits the value from StartCountdown(), it will cause an endless recurrsion
        // that refreshes the datatable endlessly, this is fine for dropdownpagination
        // TODO: Refactor countdownStartTimer
        startCountDown()
      },
      
      formatDate(value) {
        return myTime.formatDateFromScheduleDate(value)
      },

      goToCreateTransfer() {
        this.$router.push({name: "TransferCreate"})
      },

      onPressDeletedProduct(data) {
        //Do this else it will not recognize it's a new value on watch
        this.selectedForDelete = {...data}
        this.message.prompt = `Are you sure you want to delete ${this.selectedForDelete.recipient ?? this.selectedForDelete.id ?? "this"} transfer?`
      },

      DiscardDeletedPrompt() {
        this.mySelected = []
        this.selectedForDelete = null
      },

      async onConfirmDeletedPrompt() {
        this.message.failed = `Failed to delete ${this.selectedForDelete.recipient} transfer, try again?`
        this.promptDeleted = false

        this.toLoadRetry = async () => {
          await this.$store.dispatch("transfers/deleteSingleTransfer", {
            transfer: this.selectedForDelete
          })
          this.$toast.add({severity: 'success', summary: "Success!", detail: "Transfer Deleted Successfully", life: 3000})
          this.DiscardDeletedPrompt()
        }
      },

      onPage(event) {
        if (event.page + 1 == Math.floor(this.myTransfers.length / 10) && this.outOfFetch > 0) {
          this.loadData()
        }
      },

      async initData() {
        this.message.failed = "Loading failed, retry?"

        await this.$store.dispatch("transfers/getTransfers", {
          currentOffset: 0,
          limit: this.row * 2
        })
      },

      async loadData() {
        this.toLoadHidden = async () => {
          // The Ui will first need 2 pages in order for pagination to work,
          // Because it's triggered by pressing the button which does it in the background
          // so we have to get data*2 then the current ui in order for the press next button to work
          const tranfers = await this.$store.dispatch("transfers/getTransfers", {
            currentOffset: this.row * 2,
            limit: this.row * 2
          })
          this.outOfFetch = tranfers.length
        }
      },

      noRetry() {
        this.loading1 = false
      },

      onDecline(newValue) {
        this.promptDeleted = newValue
      },

      storeCreatedAtMode(newValue) {
        this.filters.created_at.matchMode = newValue
      },

      storeCreatedAtValue(newValue) {
        this.filters.created_at.value = newValue
        this.filterValueToSearch = newValue
      },

      storeScheduleTimeMode(newValue) {
        this.filters.scheduled_time.matchMode = newValue
      },

      storeScheduleTimeValue(newValue) {
        this.filters.scheduled_time.value = newValue
        this.filterValueToSearch = newValue
      },

      storeCompleteTimeMode(newValue) {
        this.filters.completed_time.matchMode = newValue
      },

      storeCompleteTimeValue(newValue) {
        this.filters.completed_time.value = newValue
        this.filterValueToSearch = newValue
      }
    },

    watch: {
      selectedForDelete(newValue) {
        // First Exclamation mark means return false if there's data
        // Second means return true if there's data
        this.promptDeleted = !!newValue
      },

      mySelected() {
        if (this.mySelected <= 0) {
          this.promptDeleted = false
        }
      },
    }
  }
</script>