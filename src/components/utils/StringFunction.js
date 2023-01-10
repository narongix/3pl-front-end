export default{
    capitalize(text){
        const capitalizeText = text?.charAt(0).toUpperCase() + text?.slice(1)       
        return capitalizeText
    }
}