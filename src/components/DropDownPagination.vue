<template>
    <Dropdown :options="dataList" :optionLabel="optionLabel" v-model="selectedData" :optionValue="optionValue"
              :disabled="disabled"
              :id="id"
              :class="{'p-invalid': validation}"
              :placeholder="placeholder"
              :filter="true"
              :filterFields="filterFields"
              :selectOnFocus="selectOnFocus ?? true"
              @filter="onFilter($event)" @blur="stopLoading"
              :virtualScrollerOptions="{lazy:true, onLazyLoad: onload, showLoader:true, loading: loading, itemSize:38}"
              :inputId="inputId" :showClear="showClear" @change="$emit('change', $event)"
    >
      <template #value="slotProps">
        <slot name="value" :mySlot="slotProps">
          <p v-if="showValue">{{ showValue?.(slotProps.value) }}</p>
        </slot>
      </template>

      <template #option="slotProps">
        <slot name="option" :mySlot="slotProps" :stopCountDown="stopCountDown">
          <p v-if="showOption" :onload="stopCountDown()">{{ showOption?.(slotProps.option) }}</p>
          <p else :onload="stopCountDown()"> {{ slotProps.option }}</p>
        </slot>
      </template>

      <template #emptyfilter>
          <p :onload="findData()">{{ emptyMessage }}</p>
      </template>

      <template #empty>
        <p v-if="loading"></p>
      </template>

      <template v-slot:loader="{ options }">
        <div class="flex align-items-center p-2" style="height: 38px">
          <Skeleton :width="options.even ? '60%' : '50%'"/>
        </div>
      </template>
    </Dropdown>  
</template>

<script>
  import mixin from "../domains/mixin";

  export default {
    mixins:[mixin.myTimeCountDown],
    created(){
      this.myOffset = this.maxLength ?? 0
      this.activateApi = this.searchName;
    },
    emits:["update:modelValue", "change"],
    props: {
      filterFields: Array,
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
              const fetchLength = await this.whenLoad(this.myOffset, this.outOfFetch, this.filterValue);
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

      findData() {
        if (this.lastType != this.filterValue) {
          this.lastType = this.filterValue;
          this.startCountdown()
        }
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