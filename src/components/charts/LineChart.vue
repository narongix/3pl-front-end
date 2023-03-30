<template>
    <Line :data="myData" :options="options"></Line>
</template>

<script>
    import { Line } from 'vue-chartjs';
    import { Chart as ChartJS, PointElement, LineElement } from 'chart.js'
    ChartJS.register(PointElement, LineElement)

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