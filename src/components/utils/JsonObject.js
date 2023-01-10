export default{
    renameKey(obj, oldKey, newKey){
        obj[newKey] = obj[oldKey]
        delete obj[oldKey]
    }
}