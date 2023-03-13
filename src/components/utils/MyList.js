class MyList {
    convertListToObject({myList, name}){
        const myObject = {}
        for(let i=0; i<myList?.length ?? 0; i++){
            const newName = `${name}[${i}]`
            myObject[newName] = myList[i]
        }
        return myObject
    }
}

module.exports = new MyList();