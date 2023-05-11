<template>
    <Line :data="myData" :options="options"></Line>
</template>

<script>
    import { Line } from 'vue-chartjs';
    import { Chart as ChartJS, PointElement, LineElement, LinearScale, CategoryScale, Tooltip } from 'chart.js'
    ChartJS.register(PointElement, LineElement, LinearScale, CategoryScale, Tooltip);

    export default{
        props:{
            myData: Object,
            options: null,
        },
        components:{
            Line,
        }
    }
</script>