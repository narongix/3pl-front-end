<template>  
  <CountDown v-slot="MyCountDown" @activateAPI="activateAPI()">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h5>Transfers</h5>
          <Button v-if="!isLoading" label="Create" class="p-button-success mr-2" @click="goToCreateTransfer"/>
          <p></p>

          <!-- NOTE: Possible to implement sort and load api through @sort -->
          <DataTable :value="dataList" :paginator="true" class="p-datatable-sm" dataKey="tmpId"
            :rowHover="true" filterDisplay="menu" :loading="isLoading" responsiveLayout="scroll"
            v-model:selection="mySelected" v-model:filters="filters" @page="onPage($event)" v-model:rows="rows"
            :rowsPerPageOptions="[10,20,30]" :totalRecords="getTotalRecords" removableSort
            >

              <template v-if="isAdmin" #header>
                <div class="formgrid grid">
                  <div class="col-12">
                    <label>User</label>
                    <UserDropDownPagination v-model:userSelector="userSelector" :rows="rows">
                    </UserDropDownPagination>  
                  </div>
                </div>
              </template>

              <template #empty>
                <p :onload="findData(MyCountDown.startCountdown)">No Transfer found.</p>
              </template>

              <Column selectionMode="multiple"></Column>
              <Column field="id" header="Id" style="min-width:8rem" :sortable="false" :showFilterMatchModes="false">
                <template #body="{ data }">
                  <TransferItem :data="data" :onload="MyCountDown.stopCountDown()"></TransferItem>
                </template>

                <template #filter="{ filterModel, filterCallback }">
                  <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                            placeholder="Search by id"></InputText>
                </template>
              </Column>

              <Column field="reference" header="Internal Reference" :sortable="false" style="min-width:12rem" :showFilterMatchModes="false">
                <template #filter="{ filterModel, filterCallback }">
                  <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="p-column-filter"
                    placeholder="Search By Reference"
                  ></InputText>
                </template>
              </Column>

              <Column field="transfer_type_id" :sortable="false" style="min-width:12rem" header="Transfer Type">
                <template #body="{ data }">
                  <TransferTypeField :data="data"></TransferTypeField>
                </template>
              </Column>

              <Column field="scheduled_time" :sortable="false" style="min-width:14rem" header="Schedule Time"
                      :showFilterMatchModes="false">

                <template #body="{ data }">
                  <p>{{ formatDate(data?.scheduled_time) }}</p>
                </template>

                <template #filter>
                  <CalendarTime @getValueMode="storeScheduleTimeMode" @getValue="storeScheduleTimeValue"></CalendarTime>
                </template>
              </Column>

              <Column field="transfer_status_id" :sortable="false" style="min-width:8rem" :showFilterMatchModes="false"
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

              <Column field="completed_time" :sortable="false" style="min-width:14rem" header="Complete Time"
                      :showFilterMatchModes="false">
                <template #body="{ data }">
                  {{ formatDate(data?.completed_time) }}
                </template>

                <template #filter>
                    <CalendarTime @getValueMode="storeCompleteTimeMode"
                                @getValue="storeCompleteTimeValue">
                    </CalendarTime>
                </template>
              </Column>

              <Column field="created_at" header="Created Time" :showFilterMatchModes="false" style="min-width:14rem" :sortable="false">
                <template #body="{ data }">
                  {{ formatDate(data?.created_at) }}
                </template>

                <template #filter>
                  <CalendarTime @getValueMode="storeCreatedAtMode" @getValue="storeCreatedAtValue" @onLoad="loadCalendarParam"></CalendarTime>
                </template>
              </Column>
            </DataTable>
          
          <RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToastDeletingTransfer"></RetryField>
          <PromptField :loading="promptDeleted" @onAccept="onConfirmDeletedPrompt" @onDecline="onDecline"
                      :message="message"/>
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
  import TransferStatusField from "./components/TransferStatusField.vue"

  import {transferStatus} from "../../domains/domain"
  import CalendarTime from "@/pages/transfers/components/CalendarTime.vue";
  import CountDown from "../../components/CountDown.vue"
  import TransferTypeField from "./components/TransferTypeField.vue"
  import UserDropDownPagination from "../../components/UserDropDownPagination.vue"
  import { roleGroupId } from "../../domains/domain"
  
  export default {
    created() {
      this.toLoadRetry = this.initData
    },
    components: {
      CalendarTime,
      TransferItem,
      RetryField,
      PromptField,
      TransferStatusField,
      CountDown,
      TransferTypeField,
      UserDropDownPagination
    },
    data() {
      return {
        loading1: false,
        mySelected: [],
        promptDeleted: false,
        selectedForDelete: null,

        dataList: [],

        rows: 10,

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

        filterValueToSearch: null,
        filterParamsToSearch: null,
        emptyMessage: null,

        selectedStatus:null,

        message: {
          failed: "Error Deleting Transfer, Try again",
          yesButton: "Yes",
          noButton: "No"
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

        userSelector: null,
        myPageTracker:0,
      }
    },
    computed: {
      ...mapGetters({
        myTransfers: "transfers/getTransfers",
        hasTransfers: "transfers/hasTransfers",
        LoginStatus: "isLoggedIn",
        getTotalRecords: "transfers/getTotalRecords",

        getUserRole: "auth/getUserRole"
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
      isAdmin(){
        return this.getUserRole == roleGroupId.Admin;
      }
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
        return myTime.formatUTCToDate(value)
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
        this.myPageTracker = event.page;
        this.toLoadRetry = async () => {
            const transfers = await this.$store.dispatch("transfers/getTransfers", {
              currentOffset: event.first,
              limit: this.rows,
              userId: this.userSelector
            })
            const offset= event.first
            const limit = event.rows
            this.updateList({offset: offset, row:limit, tempList: transfers})
          }
      },

      async initData() {
        if(this.getUserRole == roleGroupId.Admin){
          await this.$store.dispatch("user/fetchUser", {
              offset: 0,
              limit: 10,
          });
        }
        await this.searchTransfer();
      },

      async searchTransfer(pageNumber){
        this.message.failed = "Loading failed, retry?"

        await this.$store.dispatch("transfers/getTotalRecords",{
            userId: this.userSelector
        });

        this.initList();
        const products = await this.$store.dispatch("transfers/getTransfers", {
            currentOffset: (pageNumber || 0) * this.rows,
            limit: this.rows ?? 0,
            userId: this.userSelector
        });
        this.updateList({offset: pageNumber? pageNumber*this.rows : 0, row: this.rows, tempList: products});
      },

      initList(){
        this.dataList.length=0;
        for(let i=0; i<this.getTotalRecords; i++){
          this.dataList.push({tmpId: i});
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
      },

      updateList({offset, row, tempList}){
        let index=0;
        for(let i=offset; i<row+offset; i++){
          if(!(tempList?.[index])){
            break
          }
          const myId = this.dataList[i].tmpId;
          this.dataList[i]={tmpId: myId, ...tempList[index]};
          index++;
        }
      },
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

      userSelector:{
            immediate:true,
            handler(newValue){
                if(newValue){
                    this.toLoadRetry = async () => {
                      await this.searchTransfer(this.myPageTracker);
                    }
                }
                this.toLoadRetry = async() => {
                  await this.searchTransfer(this.myPageTracker);
                };
            }
        }
    }
  }
</script>