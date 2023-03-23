<template>
  <CountDown v-slot="myCountDown" @countDownTime="countDownMessage" @activateAPI="searchName">
    <Dropdown :options="dataList" :optionLabel="optionLabel" v-model="selectedData" :optionValue="optionValue"
              :disabled="disabled"
              :id="id"
              :class="{'p-invalid': validation}"
              :placeholder="placeholder"
              :filter="true"
              :selectOnFocus="selectOnFocus ?? true"
              @filter="onFilter($event)" @blur="stopLoading"
              :virtualScrollerOptions="{lazy:true, onLazyLoad: onload, showLoader:true, loading: loading, itemSize:38}"
              :inputId="inputId" :showClear="showClear"
    >
      <template #value="slotProps">
        <p v-if="showValue">{{ showValue?.(slotProps.value) }}</p>
      </template>

      <template #option="slotProps">
        <p v-if="showOption" :onload="myCountDown.stopCountDown()">{{ showOption?.(slotProps.option) }}</p>
        <p else :onload="myCountDown.stopCountDown()"> {{ slotProps.option }}</p>
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
    created(){
      this.myOffset = this.maxLength ?? 0
    },
    components:{
      CountDown
    },
    props: {
      inputId: String,
      modelValue: null,
      disabled: Boolean,
      validation: null,
      optionLabel: String,
      placeholder: String,
      optionValue: String,
      id: String,
      options: Array,
      onLazyLoad: Function,
      limit: Number,
      whenLoad: Function,
      whenSearch: Function,
      maxLength: Number,
      showOption: Function,
      showValue: Function,
      showClear: Boolean,
      selectOnFocus: Boolean
    },
    data() {
      return {
        filterValue: null,
        loading: false,
        myOffset: 0,
        countdownTracker: null,
        countdown: null,
        lastType: null,
        dataList: [],
        outOfFetch: 1,
      
        emptyMessage: "No results",
      };
    },
    computed:{
      selectedData:{
        get(){
          return this.modelValue
        },
        set(value){
          this.$emit("update:modelValue", value)
        }
      }
    },
    methods: {
      onFilter(event) {
        this.filterValue = event.value;
      },

      async onload(event) {
        try {
          if (event.last == this.maxLength && this.outOfFetch > 0) {
            this.loading = true;
            setTimeout(async ()=>{
              const fetchLength = await this.whenLoad(this.myOffset, this.outOfFetch);
              this.myOffset = this.myOffset + this.limit;
              this.outOfFetch = fetchLength;
              this.loading = false;
            }, 10)
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
      filterValue(newValue) {
        if (!newValue) {
          clearTimeout(this.countdownTracker);
        }
      }
    }
  }
</script>