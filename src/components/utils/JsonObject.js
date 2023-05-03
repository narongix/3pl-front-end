import MyList from "./MyList";

export default{
    renameKey(obj, oldKey, newKey){
        obj[newKey] = obj[oldKey]
        delete obj[oldKey]
    },

    removeNullValue(json){
        for(let i in json){
            if(json[i]==null){
                delete(json[i]);
            }
            const isArray = Array.isArray(json[i]);
            if(typeof json[i] == 'object'){
                this.removeNullValue(json[i]);
            }

            if(isArray){
                MyList.removeNull(json[i]);
            }
        }
    }
}