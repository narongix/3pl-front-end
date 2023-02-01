import moment from "moment"
    
export default {
    
    padTo2Digits(num){
        return num.toString().padStart(2, '0')
    },

    formatDateFromScheduleDate(date){
        if(date){
            const time = moment(date).format("Do MMM YYYY hh:mm a")
            return time
        }
        return ""
    },

    convertToMs(date){
        const time = this.formatDateFromScheduleDate(date)

        const milliSecond = moment(time).valueOf()
        return milliSecond
    },
}

