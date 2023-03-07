<template>
    <p>{{ getDate }}</p>
</template>

<script>
    import TimeConvert from '../../../components/utils/TimeConvert';
    
    export default{
        props:{
            data: Object,
        },
        computed:{
            getDate(){
               return TimeConvert.formatDateFromScheduleDate(new Date(this.data.created_at))
            }
        }
    }
</script>