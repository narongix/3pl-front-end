const myDataTable = {
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

        deleteElement({key, id}){
            const index = this.dataList.findIndex((e)=>e[key] == id);
            if(index>=0){
                this.dataList.splice(index, 1);
            }
        }
    }
}

const myTimeCountDown = {
    data(){
        return {
            countdown: null,
            countdownTracker: null,
            emptyMessage: null,
            activateApi: null
        }
    },
    methods:{
        async startCountdown(){
            this.countdown=3
            this.countdown=2
            this.changeMessage(this.countdown);
        },

        stopCountDown(){
          clearTimeout(this.countdownTracker)
        },

        changeMessage(time){
            this.emptyMessage = `Loading in ${time}`;
        }
    },  
    watch:{
        countdown: {
            immediate: true,
            deep: true,
            handler: async function (newValue) {
                // To prevent in case it fires oncreate and value is null
                if (newValue == null || newValue == undefined){
                    return
                }

                this.changeMessage(this.countdown)
                if (newValue > 0) {
                    return this.countdownTracker = setTimeout(() => {
                        this.countdown -= 1;
                        this.emptyMessage = `Loading in ${this.countdown}`
                        this.changeMessage(this.countdown);
                    }, 1000);
                }
                this.activateApi();
            }
        },

        countdownTracker(newValue, oldValue) {
            clearTimeout(oldValue);
        },
    }
}

const checkProductMassCreate={
    computed:{
        templateLink(){
            return "/files/product_template.xlsx";
        },
        getAllFields() {
            return [
                {
                    label: "Product Name",
                    field: "product_name"
                },
                {
                    label: "Internal Reference",
                    field: "sku"
                },
                {
                    label: "Category",
                    field: "category_name"
                },
                {
                    label: "Unknown",
                    field: "unknown"
                }
            ];
        },
    },
    methods:{
        onValidate(product){
            this.validateProduct(product);
            this.skuNotExist(product);
        },

        validateProduct(data) {
            const productNameValid = data.product_name && data.name?.trim?.() != "";
            if (!productNameValid) {
                data.reason?.push("Product Name Cannot Be Empty");
            }
            return productNameValid;
        },

        skuNotExist(product) {
            const haveSku = !product.sku && product.sku != "";
            if (haveSku) {
                return product.reason?.push("SKU Cannot Be empty");
            }
        },
    }
}

export default { myDataTable, myTimeCountDown, checkProductMassCreate };