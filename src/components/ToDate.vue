<template>
    <label>To Date</label>
    <Calendar :manualInput="false" 
    v-model="myModelValue" @date-select="$emit('onSelectDate', rows)"
    :dateFormat="getCalendarFormat" :hideOnDateTimeSelect="false" placeholder="Select End of Date">
    </Calendar>
</template>

<script>
    import TimeConvert from './utils/TimeConvert';
    export default{
        props:{
            rows: Number,
            modelValue: null,
        },
        emits:["onSelectDate", "update:modelValue"],
        computed:{
            myModelValue:{
                get(){
                    return this.modelValue;
                },
                set(newValue){
                    this.$emit("update:modelValue", newValue);
                }
            },

            getCalendarFormat(){
                return TimeConvert.getCalendarFormat();
            },
       }
    }
</script>