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
                console.log("this.data.created_at: "+this.data.created_at)
                console.log("this.data: " + new Date(this.data.created_at))
                const date = new Date(this.data.created_at)

                console.log("Month: "+date.getMonth())
                console.log("TimeConvert.formatDateFromScheduleDate(new Date(this.data.created_at): " + TimeConvert.formatDateFromScheduleDate(date))
                // const rise = Date.now()
                console.log("Day: "+ TimeConvert.formatDateFromScheduleDate(new Date(this.data.created_at)))
               return TimeConvert.formatDateFromScheduleDate(new Date(this.data.created_at))
            }
        }
    }
</script>