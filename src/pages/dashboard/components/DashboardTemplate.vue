<template>
	<div class="grid">
		<div class="col-12">
			<div class="grid">
				<div class="col-12 md:col-6">
					<div class="grid">
						<div class="col-12 md:col-4">
							<SpecialCard title="Pending Receipts" underBodyGrey="Today" title2="" myClass="text-red"
							:body="dailyMetric?.pending_receipts  ?? 0">
								<MyDashBoardIcon class="bg-red-400">
									<font-awesome-icon :icon="['fass', 'spinner']" style="color: #00e7f3;"/>
								</MyDashBoardIcon>
							</SpecialCard>
						</div>
						<div class="col-12 md:col-4">
							<SpecialCard title="Incoming Receipts" title2="" underBodyGrey="Today" :body="dailyMetric?.incoming_receipts ?? 0">
								<MyDashBoardIcon>
									<font-awesome-icon :icon="['fas', 'truck']" />
								</MyDashBoardIcon>
							</SpecialCard>
						</div>
						<div class="col-12 md:col-4">
							<SpecialCard title="Completed Receipts" title2="" underBodyGrey="Today" :body="dailyMetric?.complete_receipts  ?? 0">
								<MyDashBoardIcon class="bg-green-300">
									<font-awesome-icon icon="fa-check" />								
								</MyDashBoardIcon>
							</SpecialCard>
						</div>
					</div>

					<div class="card">
						<div class="flex align-items-center justify-content-center myChart">
							<ReceiptDoughnutChart :dailyMetric="dailyMetric"></ReceiptDoughnutChart>
						</div>
					</div>
				</div>
				<div class="col-12 md:col-6">
					<div class="grid">
						<div class="col-12 md:col-4">
							<SpecialCard title="Pending Deliveries" 
							:body="dailyMetric?.pending_deliveries ?? 0" underBodyGrey="Today" myClass="text-red">
								<MyDashBoardIcon class="bg-red-400">
									<font-awesome-icon :icon="['fass', 'spinner']" style="color: #00e7f3;"/>
								</MyDashBoardIcon>
							</SpecialCard>
						</div>
						<div class="col-12 md:col-4">
							<SpecialCard title="Outgoing Deliveries" underBodyGrey="Today" :body="dailyMetric?.outgoing_deliveries ?? 0">
								<MyDashBoardIcon>
									<font-awesome-icon :icon="['fas', 'truck']" />
								</MyDashBoardIcon>
							</SpecialCard>
						</div>
						<div class="col-12 md:col-4">
							<SpecialCard title="Completed Deliveries" underBodyGrey="Today" :body="dailyMetric?.completed_deliveries ?? 0">
								<MyDashBoardIcon class="bg-green-300">
									<font-awesome-icon icon="fa-check" />								
								</MyDashBoardIcon>
							</SpecialCard>
						</div>
					</div>

					<div class="card">
						<div class="flex justify-content-center myChart">
							<DeliveryDoughnutChart :dailyMetric="dailyMetric"></DeliveryDoughnutChart>
						</div>
					</div>
				</div>
			</div>

			<div class="grid">
				<div class="col-12 md:col-6">
					<div class="grid">
						<div class="col-12 md:col-4">
							<SpecialCard title="Avg Receipt Time " 
							:body="getAvgTime(monthlyMetric?.avg_receipt_time)"
							title2="(Hour)" underBodyGrey="For This Month"
							:underBody="(monthlyMetric?.avg_receipt_time?.count ?? 0) + ' Receipts'">

							</SpecialCard>
						</div>
						<div class="col-12 md:col-4">
							<SpecialCard title="Avg Delivery Time" :body="getAvgTime(monthlyMetric?.deliveries_on_time_rate)"
							title2="(Hour)" underBodyGrey="For This Month"
							:underBody="(monthlyMetric?.deliveries_on_time_rate?.count ?? 0) + ' Deliveries'">
							</SpecialCard>
						</div>
						<div class="col-12 md:col-4">
							<SpecialCard title="Deliveries" 
							title2="On Time Rate" underBodyGrey="For This Month"
							:body="myNumConvert(monthlyMetric?.deliveries_on_time_rate?.on_time ?? 0) + ' %' "></SpecialCard>
						</div>
					</div>
				</div>
			</div>
			<div class="grid">
				<div class="col-12 md:col-6">
					<div class="card">
						<h5>AVG Receipt Time Over Period (hr)</h5>
						<ReceiptLineChart :myDataset="myReceiptLineChart.data" :labels="myReceiptLineChart.labels"></ReceiptLineChart>
					</div>
				</div>
				<div class="col-12 md:col-6">
					<div class="card">
						<h5>AVG Delivery Time Over Period (hr)</h5>
						<DeliveryLineChart :myDataset="myDeliveryLineChart.data" :labels="myDeliveryLineChart.labels"></DeliveryLineChart>
					</div>
				</div>
			</div>


		<div class="grid">
			<div class="col-12 md:col-6">
				<div class="card">
					<h5>RECENTLY COMPLETED RECEIPTS</h5>
					<MyDataTable v-slot="mySlot" :initializeList="tempData1" :row="myRows1" :total="total1">
						<DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" :dataKey="mySlot.tmpId"
							:rowHover="true" responsiveLayout="scroll" @page="onPage1($event, mySlot.update)"
							:rowsPerPageOptions="[10, 20, 30]" v-model:rows="myRows1">		
							
							<template #empty>
								Empty...
							</template>
							<Column header="Transfer ID" field="id"></Column>
							<Column header="Customer" field="customer_name"></Column>
							<Column header="Time Taken" field="order_cycle_time">
								<template #body="{ data }">
									<p>{{ (Number(data.order_cycle_time) || 0).toFixed(2) }}hr</p>
								</template>
							</Column>
							<Column header="On Time" field="on_time"></Column>
						</DataTable>
					</MyDataTable>
				</div>
			</div>

			<div class="col-12 md:col-6">
				<div class="card">
					<h5>UNMEASURED PRODUCTS ({{ total3 }})</h5>
					<MyDataTable v-slot="mySlot" :initializeList="tempData3" :row="myRows3" :total="total3">
						<DataTable :value="mySlot.value" :paginator="true" class="p-datatable-sm" :dataKey="mySlot.tmpId"
							:rowHover="true" responsiveLayout="scroll" @page="onPage3($event, mySlot.update)"
							:rowsPerPageOptions="[10, 20, 30]" v-model:rows="myRows3">
							
							<template #empty>
								Empty...
							</template>
							<Column header="Customer" field="customer_name"></Column>
							<Column header="Count" field="count"></Column>
						</DataTable>
					</MyDataTable>
				</div>
			</div>
		</div>
		</div>

		<RetryField :toLoad="toLoadRetry" :message="message" :errorToast="errorToast"></RetryField>
	</div>
</template>
<style>
	.forChart{
		z-index: 2;
	}

	.myChart{
		height: 250px;
	}
</style>
<script>
	import EventBus from '@/AppEventBus';
	import ReceiptDoughnutChart from './ReceiptDoughnutChart.vue';
	import DeliveryDoughnutChart from './DeliveryDoughnutChart.vue';
	import SpecialCard from './SpecialCard.vue';
	import MyDataTable from '../../../components/MyDataTable.vue';
	import RetryField from '../../../components/prompt_field/RetryField.vue';
	import TimeConvert from '../../../components/utils/TimeConvert';
	import DeliveryLineChart from './DeliveryLineChart.vue';
	import ReceiptLineChart from './ReceiptLineChart.vue';
	import MyDashBoardIcon from './MyDashBoardIcon.vue';
	import MyNumber from '../../../components/utils/MyNumber';

	export default {
		// mounted() {
		// 	// this.themeChangeListener = (event) => {
		// 	// 	if (event.dark)
		// 	// 		this.applyDarkTheme();
		// 	// 	else
		// 	// 		this.applyLightTheme();
		// 	// };
		// 	// EventBus.on("change-theme", this.themeChangeListener);
		// 	// if (this.isDarkTheme()) {
		// 	// 	this.applyDarkTheme();
		// 	// }
		// 	// else {
		// 	// 	this.applyLightTheme();
		// 	// }
		// }, 
		created() {
			this.initData();
		},
		beforeUnmount() {
			EventBus.off("change-theme", this.themeChangeListener);
		},
		
		components: { DeliveryDoughnutChart, SpecialCard, MyDataTable, RetryField, ReceiptDoughnutChart, DeliveryLineChart, ReceiptLineChart, MyDashBoardIcon },
		props:{
			completedTransferDelivery: Array,
			completedTransferReceipt: Array,
			monthlyMetric: Object,
			monthlyMetricPeriodDelivery: Array,
			monthlyMetricPeriodReceipt: Array,
			dailyMetric: Object,
			unmeasureProduct: Array,
			userSelector: String,
			toLoadAdditional: Function,

			rows1: Number,
			rows2: Number,
			rows3: Number,
		},
		
		emits:["update:rows1", "update:rows2", "update:rows3"],

		data() {
			return {
				lineDataReceipt: {
					labels: [],
					datasets:[
						{
							label: "Receipt",
							data: [],
							fill:false,
							backgroundColor: "#00bb7e",
							borderColor: "#00bb7e",
							tension: 0.4
						}
					]
				},
				lineOptionsReceipts: null,

				lineDataDelivery: {
					labels: [],
					datasets:[	
						{
							label: "Delivery",
							data: [],
							fill:false,
							backgroundColor: "#00bb7e",
							borderColor: "#00bb7e",
							tension: 0.4
						}
					]
				},
				lineOptionsDelivery: null,

				myDeliveryLineChart:{
					labels:[],
					data:[]
				},

				myReceiptLineChart:{
					labels:[],
					data:[]
				},

				message: {
					failed: "Error Loading, Try again",
					yesButton: "Yes",
					noButton: "No"
				},

				toLoadRetry: null,

				errorToast: {
					severity: "error",
					summary: "Error!",
					detail: "Failed Loading!"
				},

				tempData1: [],
				total1: 0,
				
				tempData2: [],
				total2: 0,

				tempData3: [],
				total3: 0,
			};
		},

		productService: null,
		themeChangeListener: null,

		computed:{
			myRows1:{
				get(){
					return this.rows1;
				},
				set(newValue){
					this.$emit("update:rows1", newValue);
				}
			},

			myRows2:{
				get(){
					return this.rows2;
				},
				set(newValue){
					this.$emit("update:rows1", newValue);
				}
			},

			myRows3:{
				get(){
					return this.rows3;
				},
				set(newValue){
					this.$emit("update:rows2", newValue);
				}
			},
		},
		
		methods: {
			myNumConvert(data){
				return MyNumber.convertToTwoDecimal(data);
			},

			async initData(){
				this.toLoadRetry = async ()=>{
					const { completeReceipt, completeDelivery, unmeasuredProduct } = await this.toLoadAdditional(this.total1, this.tempData1, this.total2, this.tempData2, this.total3, this.tempData3);

					this.total1 = Number(completeReceipt?.rows_total ) ?? 0;
					this.tempData1 = completeReceipt?.rows ?? [];

					this.total2 = Number(completeDelivery?.rows_total) ?? 0;
					this.tempData2 = completeDelivery?.rows ?? [];

					this.total3 = Number(unmeasuredProduct?.rows_total) ?? 0;
					this.tempData3 = unmeasuredProduct?.rows ?? [];

					const { labels: labelDelivery, data: dataDelivery }= this.convertToStatistic(this.monthlyMetricPeriodDelivery ?? []);
					
					this.myDeliveryLineChart.labels = labelDelivery;
					this.myDeliveryLineChart.data = dataDelivery;

					const { labels : labelReceipt, data: dataReceipts } = this.convertToStatistic(this.monthlyMetricPeriodReceipt ?? []);
					this.myReceiptLineChart.labels = labelReceipt;
					this.myReceiptLineChart.data = dataReceipts;
				}
			},

			getAvgTime(data){
				return (data?.order_cycle_time ?? 0).toFixed(2) + " hr";
			},

			onPage1(event, updateList) {
                this.toLoadRetry = async () => {
                    const receiptData = await this.$store.dispatch("dashboard/onFetchCompleteTransferReceipt", {
                        limit: this.myRows1,
                        userId: this.userSelector,
						offset: event.first,
                    })

                    const offset = event.first;
                    const limit = event.rows;
					updateList({ offset: offset, row: limit, tempList: receiptData.rows })
                }
            },

			onPage2(event, updateList) {
                this.toLoadRetry = async () => {
                    const deliveryData = await this.$store.dispatch("dashboard/onFetchCompleteTransferDelivery", {
                        limit: this.myRows2,
                        userId: this.userSelector,
						offset: event.first,
                    })

                    const offset = event.first;
                    const limit = event.rows;

                    updateList({ offset: offset, row: limit, tempList: deliveryData.rows })
                }
            },

			onPage3(event, updateList) {
                this.toLoadRetry = async () => {
                    const unmeasureProduct = await this.$store.dispatch("dashboard/onFetchUnmeasuredProduct", {
                        offset: event.first,
                        limit: this.myRows3,
                        userId: this.userSelector,
                    })

                    const offset = event.first;
                    const limit = event.rows;
                    updateList({ offset: offset, row: limit, tempList: unmeasureProduct.rows})
                }
            },

			convertToStatistic(list){
				const labels = [];
				const data = [];
				// I = 0. I=1, I=2, etc...
				for(let i in list){
					labels.push(TimeConvert.convertDigitToMonth(list[i].month));
					data.push(list[i].order_cycle_time);
				}
				return {labels, data};
			},







//---------------------------------------------------------------------------//
			formatCurrency(value) {
				return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
			},
			isDarkTheme() {
				return this.$appState.darkTheme === true;
			},
			// applyLightTheme() {
			// 	this.lineOptions = {
			// 		plugins: {
			// 			legend: {
			// 				labels: {
			// 					color: "#495057"
			// 				}
			// 			}
			// 		},
			// 		scales: {
			// 			x: {
			// 				ticks: {
			// 					color: "#495057"
			// 				},
			// 				grid: {
			// 					color: "#ebedef",
			// 				}
			// 			},
			// 			y: {
			// 				ticks: {
			// 					color: "#495057"
			// 				},
			// 				grid: {
			// 					color: "#ebedef",
			// 				}
			// 			},
			// 		}
			// 	};
			// },
			// applyDarkTheme() {
			// 	this.lineOptions = {
			// 		plugins: {
			// 			legend: {
			// 				labels: {
			// 					color: "#ebedef"
			// 				}
			// 			}
			// 		},
			// 		scales: {
			// 			x: {
			// 				ticks: {
			// 					color: "#ebedef"
			// 				},
			// 				grid: {
			// 					color: "rgba(160, 167, 181, .3)",
			// 				}
			// 			},
			// 			y: {
			// 				ticks: {
			// 					color: "#ebedef"
			// 				},
			// 				grid: {
			// 					color: "rgba(160, 167, 181, .3)",
			// 				}
			// 			},
			// 		}
			// 	};
			// }
		},
		watch: {
			userSelector(newValue){
				if(newValue){
					this.toLoad = async ()=>{
						await this.initData()
					};
				}
			}
		}
	}
</script>