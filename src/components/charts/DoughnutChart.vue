<template>
    <Doughnut id="Pie" :options="chartOptions" :data="chartData"></Doughnut>
</template>

<script>
    import { Doughnut } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)
    
    export default{
        components: {
            Doughnut
        },
        props:{
            chartData:Object,
            chartOptions:Object
        },
    }
</script>