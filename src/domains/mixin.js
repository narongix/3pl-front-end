var myDataTable = {
    data(){
        return {
            dataList: [],
        };
    },
    computed:{
        tmpId(){
            return "tempId";
        }
    },
    methods:{
        updateList({offset, row, tempList}){
            let index=0;
            for(let i=offset; i<row+offset; i++){
              if(!(tempList?.[index])){
                break
              }
              const myId = this.dataList[i]?.tmpId;
              this.dataList[i]={tmpId: myId, ...tempList[index]};
              index++;
            }
        },

        initList(totalRecord){
            this.dataList.length=0;
            for(let i=0; i<totalRecord; i++){
              this.dataList.push({tmpId: i});
            }
        },
    }
}

export default { myDataTable };