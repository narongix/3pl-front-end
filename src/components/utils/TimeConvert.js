export default {
    padTo2Digits(num){
        return num.toString().padStart(2, '0')
    },

    formatDateFromScheduleDate(date){
        const myDate = [
            date.getFullYear(),
            this.padTo2Digits(date.getMonth()),
            this.padTo2Digits(date.getDate()),
        ].join("-")
        const myTime = [
            this.padTo2Digits(date.getHours()),
            this.padTo2Digits(date.getMinutes()),
            this.padTo2Digits(date.getSeconds()),
        ].join("-")

        return myDate + " " + myTime
    },

    fromUTCToLocal(date){
        const time = date.toLocaleString()
        console.log(time)
        return time
    }
}

