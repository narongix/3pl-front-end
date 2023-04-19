export default{
    capitalize(text){
        const capitalizeText = text?.charAt(0)?.toUpperCase() + text?.slice(1)       
        return capitalizeText
    },

    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }
}