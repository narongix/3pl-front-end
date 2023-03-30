<template>
    <DoughnutChart :chartData="myChartData" :chartOptions="chartOptions"></DoughnutChart>
</template> 

<script>
    import DoughnutChart from '../../../components/charts/DoughnutChart.vue'

    export default{
        components:{
            DoughnutChart
        },
        props:{
            dailyMetric: Object,
        },
        data(){
            return {
                myDataset: [],
                chartOptions:{
                    responsiveness: false,
                    plugins:{
                        legend:{
                            display: true,
                            position: "top",
                            align: "start",
                        }
                    }
                }
            }
        },
        computed:{
            myChartData(){
                return {
                    labels: ["Pending Receipts", "Incoming Receipts", "Completed Receipts"],
                    datasets:   
                    [
                        {
                            label: "Receipts",
                            data: this.myDataset,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                        },
                    ]
                }
            }
        },
        watch:{
            dailyMetric:{
                deep:true,
                handler(newValue){
                    this.myDataset = [
                        Number(newValue?.pending_receipts ?? 0) ?? 0,
                        Number(newValue?.incoming_receipts ?? 0) ?? 0,
                        Number(newValue?.complete_receipts ?? 0) ?? 0
                    ];
                }
            }
        }
    }
</script>