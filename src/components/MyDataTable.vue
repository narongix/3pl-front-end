<template>
    <slot :value="myList" :update="updateList" :tmpId="tmp" :updateReplaceAll="updateAndReplaceAll">
    </slot>
</template>

<script>
    export default{
        props:{
            initializeList: Array,
            row: Number,
            total: Number,
            id: String,
        },
        data(){
            return {
                myList: [],
            }
        },
        computed:{
            tmp(){
                return "tempId"
            }
        },
        methods:{
            initList(){
                this.myList.length=0;
                for(let i=0; i<this.total; i++){
                    const tmp = {}
                    tmp[this.id ?? this.tmp] = i.toString()
                    this.myList.push(tmp)
                }
                this.updateList({
                    offset: 0,
                    row: this.row ?? 10,
                    tempList: this.initializeList
                })
            },

            updateList({offset, row, tempList}){
                let index=0;
                for(let i=offset; i<row+offset; i++){
                    
                    if(!(tempList?.[index])){
                        break;
                    }

                    const myId = this.myList[i]?.[this.id ?? this.tmp];
                    
                    this.myList[i] = tempList[index];
                    this.myList[i][this.id ?? this.tmp] = myId;
                    index++;
                }
            },

            updateAndReplaceAll(tempList){
                this.myList.length=0;
                for(let i=0; i<tempList.length; i++){
                    this.myList[i] = tempList[i];
                    this.myList[i][this.id ?? this.tmp] = i;
                }
            }
        },
        watch:{
            initializeList:{
                handler(){
                    this.initList();
                }
            }
        }
    }
</script>