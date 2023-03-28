<template>
    <DoughnutChart :chartData="myChartData" :chartOptions="chartOptions"></DoughnutChart>
</template> 

<script>
    import DoughnutChart from '../../../components/charts/DoughnutChart.vue';

    export default{
        components:{
            DoughnutChart
        },
        props:{
            dailyMetric: Object,
        },
        data(){
            return{
                myDataset: [],

                chartOptions:{
                    responsiveness: true,
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
        // We do this because there won't be reactivity changes if we were to use data,
        // I don't know why -,-
        computed:{
            myChartData(){
                return {
                    labels: ["Pending Deliveries", "Outgoing Deliveries", "Completed Deliveries"],
                    datasets:   
                    [
                        {
                            label: "Deliveries",
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
        // TODO: We can use computed instead, anytime the value of props changes, 
        // the computed value would react to the prop as well, 
        // why did I never think of this?
        watch:{
            dailyMetric:{
                deep:true,
                handler(newValue){
                    this.myDataset = [
                        Number(newValue?.pending_deliveries ?? 0) ?? 0,
                        Number(newValue?.outgoing_deliveries ?? 0) ?? 0,
                        Number(newValue?.completed_deliveries ?? 0) ?? 0
                    ];
                }
            }
        }
    }
</script>