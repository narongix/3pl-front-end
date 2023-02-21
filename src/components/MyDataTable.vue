<template>
    <slot :value="myList" :update="updateList" :initialize="initializeList">

    </slot>
    <!-- <DataTable
        :value="products" 
        :paginator="true" 
        class="p-datatable-sm" 
        :rows="rows" 
        :dataKey="dataKey"
        :rowHover="true" 
        :filterDisplay="filterDisplay" 
        :loading="loading1" 
        :responsiveLayout="responsiveLayout"
        :rowsPerPageOptions="[10, 20, 30]" 
        v-model:filters="filters" 
        v-model:selection="myselection"
        @page="onPage"
        :sortField="sortField"
        :sortOrder="sortOrder"
        >
        <slot></slot>
    </DataTable> -->
</template>

<script>
    // export default{
    //     data(){
    //         return {
    //             myList: [],
    //             myFilter: [],
    //             rows: 10
    //         }
    //     },
    //     methods:{
    //         initList(length){
    //             for(let i=0; i<length; i++){
    //                 this.dataList.push({id: i, temp_id: i})
    //             }
    //         },

    //         updateList({offset, row, list, page}){
    //             let index=0
    //             this.myFilter[page]=true
    //             for(let i=offset; i<row+offset; i++){
    //                 if(!(list?.[index])){
    //                     break
    //                 }
    //                 this.myList[i]=list[index]
    //                 index++
    //             }
    //         },

    //         onSort(event){
    //             console.log(event)
    //         }
    //     },
    // }
</script>