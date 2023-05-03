class MyList {
    convertListToObject({myList, name}){
        const myObject = {}
        for(let i=0; i<myList?.length ?? 0; i++){
            const newName = `${name}[${i}]`
            myObject[newName] = myList[i]
        }
        return myObject
    }

    removeNull(myArr){
        let i =0;
        while(i<myArr?.length){
            const notHaveKeys = Object.keys(myArr[i] ?? {}).length == 0;
            if(myArr[i]==null || notHaveKeys){
                myArr.splice(i, 1);
            }else{
                i++;
            }
        }
    }
}

module.exports = new MyList();