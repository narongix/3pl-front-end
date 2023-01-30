<template>
  <Dropdown v-model="calenderFilterMode" :options="customDate" optionLabel="label" optionValue="value"></Dropdown>
  <Calendar class="mt-3" v-model="calendarValue" :selectionMode="selectionMode" :inline="true" :showTime="showTime" :onload="$emit('onLoad')"/>
</template>

<script>
  import myTime from "@/components/utils/TimeConvert";

  export default {
  emits: ["getValue", "getValueMode", "onLoad"],

  created() {
    this.calenderFilterMode = "datesIn"
  },

  props:{
    onload: Function
  },

  data() {
    return {
      calendarValue: null,
      calenderFilterMode: null,
      selectionMode: null,
      showTime: true,

      countdown: null,
      countdownTracker: null,
    }
  },

  computed: {
    customDate() {
      return [
        {label: "Date is in between", value: "dateRanges"},
        {label: "Date in", value: "datesIn"},
        {label: "Date greater than", value: "dateGreaterThan"},
        {label: "Date less than", value: "dateLessThan"}
      ]
    },
    convertForCalendar() {
      return {
        dateRanges: "range",
      }
    },

    showTimeOrNot() {
      return {
        datesIn: false,
        dateRanges: true,
        dateGreaterThan: true,
        dateLessThan: true
      }
    },

    formatDate(value) {
      return myTime.formatDateFromScheduleDate(value)
    },
  },
  watch: {
    calenderFilterMode: {
      immediate: true,
      handler: function (newValue) {
        this.$emit("getValueMode", newValue)
        this.selectionMode = this.convertForCalendar?.[newValue]
        this.showTime = this.showTimeOrNot?.[newValue] ?? true

        this.calendarValue = null
      }
    },

    calendarValue: {
      immediate: true,
      handler: function (newValue) {
        this.$emit("getValue", newValue)
      }
    }
  }
}
</script>