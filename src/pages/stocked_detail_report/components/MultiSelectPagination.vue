<template>
    <CountDown v-slot="myCountDown" @countDownTime="countDownMessage" @activateAPI="searchName">
        <MultiSelect v-model="myModel" :filter="true" :selectOnFocus="true" :display="display"
        @filter="onFilter($event, myCountDown.stopCountDown)" @blur="stopLoading"
        :virtualScrollerOptions="{lazy:true, onLazyLoad: onload, showLoader:true, loading:loading, itemSize:38}"
        :placeholder="placeholder" :options="options" :optionLabel="optionLabel" :optionValue="optionValue"
        @change="$emit('onChange')"
        >
            <template #option="slotProps">
                <p :onload="myCountDown.stopCountDown()">{{ displayOption(slotProps.option) }}</p>
            </template>

            <template #emptyfilter>
                <p :onload="findData(myCountDown.startCountdown)">{{ emptyMessage }}</p>
            </template>

            <template v-slot:loader="{ options }">
                <div class="flex align-items-center p-2" style="height: 38px">
                    <Skeleton :width="options.even ? '60%' : '50%'"/>
                </div>
            </template>
        </MultiSelect>
    </CountDown>
</template>

<script>
import CountDown from '../../../components/CountDown.vue';

    export default{
    data() {
        return {
            emptyMessage: "No Results",
            loading: false,
            countdownTracker: null,
            countdown: null,   
            filterValue: null,
            lastType: null,
            outOfFetch: 3
        }
    },
    components: { CountDown },
    props: {
        offset: Number,
        modelValue: Array,
        disabled: Boolean,
        validation: Boolean,
        id: String,
        options: Array,
        onLazyLoad: Function,
        limit: Number,
        whenLoad: Function,
        whenSearch: Function,
        maxLength: Number,
        display: String,
        placeholder: String,
        optionLabel: String,
        optionValue: null,
        displayOption: Function
    },
    emits:["update:modelValue", "update:offset", "onChange"],
    computed:{
        myModel:{
            get(){
                return this.modelValue
            },
            set(value){
                this.$emit("update:modelValue", value)
            }
        },
        myOffset:{
            get(){
                return this.offset
            },

            set(value){
                this.$emit("update:offset", value)
            }
        }
    },
    methods:{
        onFilter(event){
            this.filterValue = event.value
        },

        async onload(event){
            try{
                if (event.last == this.maxLength && this.outOfFetch > 0) {
                    this.loading = true;
                    this.myOffset = this.myOffset + this.limit;
                    const fetchLength = await this.whenLoad(this.myOffset, this.outOfFetch);
                    this.outOfFetch = fetchLength;
                    this.loading = false;
                }
            }catch(e){
                this.outOfFetch=1
                this.loading=false
            }
        },
        stopLoading() {
            this.loading = false;
        },
        async findData(startCountDown) {
            if (this.lastType != this.filterValue) {
            this.lastType = this.filterValue;
            const initialTImer = await startCountDown()
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
    watch:{
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