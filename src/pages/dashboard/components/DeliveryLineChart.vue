<template>
    <LineChart :myData="myData" :options="options"></LineChart>
</template>

<script>
    import LineChart from '../../../components/charts/LineChart.vue';
    export default{
        components:{
            LineChart
        },
        props:{
            myDataset: {
                type: Array,
                default: function (){
                    return [];
                }
            },

            labels: {
                type: Array,
                default: function (){
                    return [];
                }
            }
        },
        data(){
            return {
                options: {
                    scales: {
                        y:{
                            ticks:{
                                font:{
                                    size: 20
                                }
                            }
                        }
                    }
                }
            };
        },
        computed:{
            myData(){
                return {
                    labels: this.labels,
                    datasets:
                    [
                        {
                            label: "Deliveries",
                            data: this.myDataset,
                            fill: false,
                            backgroundColor: "#00bb7e",
                            borderColor: "#00bb7e",
                            // borderColor: 'rgb(75, 192, 192)',
                            tension: 0.2
                        },
                    ]
                };
            }
        }
    }

</script>