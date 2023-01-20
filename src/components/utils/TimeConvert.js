import moment from "moment"
    
export default {
    
    padTo2Digits(num){
        return num.toString().padStart(2, '0')
    },

    formatDateFromScheduleDate(date){
        const time = moment(date).format("MMM Do YYYY hh:mm:ss a")
        return time
    },

    convertToMs(date){
        const time = this.formatDateFromScheduleDate(date)

        const milliSecond = moment(time).valueOf()
        return milliSecond
    },
}

