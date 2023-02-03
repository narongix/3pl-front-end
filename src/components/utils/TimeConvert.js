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
        const milliSecond = moment(date).valueOf()
        return milliSecond
    },

    formatDateToStockFormat(date){
        if(date){
            const time = moment(date).format("YYYY-MM-DD")
            return time
        }
        return ''
    }
}

