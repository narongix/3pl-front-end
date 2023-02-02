<template>
  <CountDown v-slot="myCountDown" @countDownTime="countDownMessage" @activateAPI="searchName">
    <Dropdown :options="dataList" :optionLabel="optionLabel" v-model="selectedData" :optionValue="optionValue"
              :disabled="disabled"
              :id="id"
              :class="{'p-invalid': validation}"
              :placeholderSearch="placeholderSearch"
              :filter="true"
              :selectOnFocus="true"
              @filter="onFilter($event, myCountDown.stopCountDown)" @blur="stopLoading"
              :virtualScrollerOptions="{lazy:true, onLazyLoad: onload, showLoader:true, loading: loading, itemSize:38}"
    >
      <template #option="slotProps">
        <p :onload="myCountDown.stopCountDown()">{{ showValue(slotProps.option) }}</p>
      </template>

      <template #emptyfilter>
          <p :onload="findData(myCountDown.startCountdown)">{{ emptyMessage }}</p>
      </template>

      <template v-slot:loader="{ options }">
        <div class="flex align-items-center p-2" style="height: 38px">
          <Skeleton :width="options.even ? '60%' : '50%'"/>
        </div>
      </template>
    </Dropdown>
  </CountDown>
</template>

<script>
  import CountDown from "@/components/CountDown.vue";
  export default {
    components:{
      CountDown
    },
    props: {
      myModel: Object,
      disabled: Boolean,
      validation: Boolean,
      optionLabel: String,
      placeholderSearch: String,
      optionValue: String,
      id: String,
      options: Array,
      onLazyLoad: Function,
      limit: Number,
      placeholderField: String,
      whenLoad: Function,
      whenSearch: Function,
      maxLength: Number,
      SelectedValue: undefined,
      showValue: Function,
    },
    data() {
      return {
        selectedData: null,
        filterValue: null,
        loading: false,
        offset: 0,
        countdownTracker: null,
        countdown: null,
        lastType: null,
        dataList: [],
        outOfFetch: 1,

        emptyMessage: "No results",
      };
    },
    methods: {
      onFilter(event) {
        this.filterValue = event.value;
      },
      async onload(event) {
        try {
          if (event.last == this.maxLength && this.outOfFetch > 0) {
            this.loading = true;
            this.offset = this.offset + this.limit;
            const fetchLength = await this.whenLoad(this.offset, this.outOfFetch);
            this.outOfFetch = fetchLength;
            this.loading = false;
          }
        } catch (e) {
          this.outOfFetch = 1
          this.loading = false
        }
      },
      stopLoading() {
        this.loading = false;
      },

      findData(startCountDown) {
        if (this.lastType != this.filterValue) {
          this.lastType = this.filterValue;
          const initialTImer = startCountDown()
          this.countDownMessage(initialTImer)
        }
      },

      countDownMessage(timer){
        this.emptyMessage = `Loading in ${timer}`
      },

      async searchName() {
        try {
          this.loading = true;
          this.emptyMessage=null;
          await this.whenSearch(this.filterValue);
          this.loading = false
        } catch (e) {
          this.loading = false
        }
      },

    },
    watch: {
      options: {
        immediate: true,
        deep: true,
        handler: function (newVal) {
          this.dataList = [...newVal];
          this.emptyMessage="No Results!"
        }
      },
      SelectedValue: {
        immediate: true,
        handler: function (newVal) {
          if (newVal) {
            this.selectedData = newVal
          }
        }
      },
      selectedData: {
        immediate: true,
        handler: function (newVal) {
          this.$emit("onChanged", newVal);
        }
      },
      filterValue(newValue) {
        if (!newValue) {
          clearTimeout(this.countdownTracker);
        }
      }
    }
  }
</script>