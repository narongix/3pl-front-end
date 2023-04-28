import moment from "moment"

const timeFormatForCalendar = "dd/mm/yy" 

export default {
    padTo2Digits(num){
        return num.toString().padStart(2, '0')
    },

    formatUTCToDate(date){
        if(date){
            const time = moment(date).format("DD/MM/YYYY hh:mm a")
            return time
        }
        return ""
    },

    formatUTCToDateNoTime(date){
        if(date){
            const time = moment(date).format("DD/MM/YYYY");
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
    },

    getCalendarFormat(){
        return timeFormatForCalendar
    },

    getLastDayOfMonth(month, year){
        const currentDay = new Date();
        if(month){
            const lastDay = new Date(year ?? currentDay.getFullYear(), month+1, 0);  
            return lastDay.getDate();
        }
        
        const lastDay = new Date(currentDay.getFullYear(), currentDay.getMonth()+1, 0);
        
        return lastDay.getDate();
    },

    convertDigitToMonth(digit){
        const month = moment().month(digit-1).format("MMM");
        return month;
    }
}