<template>
    <slot :value="myList" :update="updateList">

    </slot>
</template>

<script>
    export default{
        props:{
            initializeList: Array,
            row: Number
        },
        data(){
            return {
                myList: [],
            }
        },
        methods:{
            initList(values){
                for(let i=0; i<values.length; i++){
                    this.myList.push({id: i})
                }

                this.updateList({
                    offset: 0,
                    row: this.row,
                    tempList: values
                })
            },

            updateList({offset, row, tempList}){
                let index=0;
                for(let i=offset; i<row+offset; i++){
                    if(!(tempList?.[index])){
                        break;
                    }
                    
                    this.myList[i]=tempList[index];
                    index++;
                }
            }
        },
        watch:{
            initializeList:{
                handler: function(newValue){
                    this.initList(newValue);
                }
            }
        }
    }
</script>