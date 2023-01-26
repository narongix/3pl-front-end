<template>
	<Dropdown :options="dataList" :optionLabel="optionLabel" v-model="selectedData" :optionValue="optionValue" :disabled="FieldNotActive" 
	:id="id"
	:class="{'p-invalid': validation}" 
	:placeholderSearch="placeholderSearch"
	:filter="true"
	:selectOnFocus="true" 
	@filter="onFilter" @blur="stopLoading"
	:virtualScrollerOptions="{lazy:true, onLazyLoad: onload, showLoader:true, loading: loading, itemSize:38}"
	>

	<template #optiongroup="slotProps">
		<p>{{ slotProps.value.optionValue }}</p>
	</template>

	<template v-slot:loader="{ options }">
		<div class="flex align-items-center p-2" style="height: 38px" >
			<Skeleton :width="options.even ? '60%' : '50%'" />
		</div>
	</template>

	</Dropdown>
</template>

<script>
	export default{
    props: {
        myModel: Object,
        FieldNotActive: Boolean,
        disabledField: Boolean,
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
		SelectedValue: undefined
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
            }
            catch (e) {
				this.outOfFetch=1
				this.loading=false
			}
        },
        stopLoading() {
            this.loading = false;
        },
        findData() {
            if (this.lastType != this.filterValue) {
                this.lastType = this.filterValue;
                // Do not remove this
                // When remove all the value from the search field
                // And type again the past value and new value will be 3 
                // So it won't activate the countdown for searching detail api
                this.countdown = 4;
                this.countdown = 3;
            }
        },
        async searchName() {
			try{
				this.loading = true;
				await this.whenSearch(this.filterValue);
				this.loading=false;
			
			}catch(e){
				this.loading=false
			}
		},
    },
    watch: {
        options: {
            immediate: true,
            deep: true,
            handler: function (newVal) {
                this.dataList = [...newVal];
            }
        },

		SelectedValue:{
			immediate:true,
			handler: function(newVal){
				if(newVal){
					this.selectedData=newVal
				}
			}
		},
        selectedData:{
			immediate:true,
			handler: function(newVal) {
            this.$emit("onChanged", newVal);
        }
		},

        countdown: {
            immediate: true,
            deep: true,
            handler: async function (newValue) {
                if (newValue > 0) {
                    return this.countdownTracker = setTimeout(() => {
                        this.countdown -= 1;
                    }, 1000);
                }
                await this.searchName();
            }
        },
        countdownTracker(newValue, oldValue) {
            clearTimeout(oldValue);
        },
        filterValue(newValue) {
            if (!newValue) {
                clearTimeout(this.countdownTracker);
            }
        }
    },
}
</script>