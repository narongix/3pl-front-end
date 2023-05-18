<template>
  <Dialog v-model:visible="errorDialog" header="Unsuccessful Products" modal :closable="true" style="min-width: 75vh;">
        <MySpecialImportDialog v-if="errorList.length>0" myClass="fail" :header="successList.length==0? 'All Records Failed To Import' : 'Some Records Failed to Import'">
            <template #icon>
                <font-awesome-icon class="myIcon" icon="fa-regular fa-circle-xmark" size="lg"/>
            </template>

            <template #bottom>
                <p><b>{{ errorList?.length ?? 0 }} failed out of {{ (errorList?.length ?? 0) + (successList?.length ?? 0) }} product</b> to import to the system, please check them to re-import them later.</p>
            </template>
        </MySpecialImportDialog>

        <MySpecialImportDialog v-if="errorList?.length==0" myClass="success"
        header='All Records Have Imported Successully'
        >
        <template #icon>
            <font-awesome-icon icon="fa-regular fa-circle-check" size="lg"/>
        </template>

        <template #bottom>
            <p><b>{{ successList.length }} out of {{ this.$route.query.total ?? 0 }}</b> have been successully imported.</p>
        </template>
        </MySpecialImportDialog>
        
        <h5>Failed Records({{ errorList?.length ?? 0 }})</h5>
        <slot name="dialogButton"></slot>
        <DataTable :value="errorList ?? []" class="p-datatable-sm mb-5" dataKey="id"
        responsiveLayout="scroll" 
        >
            <template #empty>
                <p>No Error Products!!</p>
            </template>
            <Column field="row" header="No."></Column>
            <slot name="columns" :errorList="errorList">

            </slot>
            <Column field="reason" header="Reason" style="min-width:12rem">
                <template #body="{ data }">
                    {{ data?.reason?.map(e=>convertToName(e)).join(", ") }}
                </template>
            </Column>
        </DataTable>
    </Dialog>
</template>

<script>
  import { errorCode } from '../domains/domain';
  import MySpecialImportDialog from '../pages/products/components/MySpecialImportDialog.vue';

  export default{
    components:{
      MySpecialImportDialog
    },
    props:{
      header:{
        type: String,
        required: false
      },
      successList:{
        type: Array,
        required: true,
        default: ()=>([])
      },
      errorList:{
        type: Array,
        required: true,
        default: ()=>([])
      },
      modelValue:{
        type: Boolean,
        required: true,
      }
    },
    emits:["update:modelValue", "onClickCreate"],
    data(){
      return {

      };
    },
    computed:{
      errorDialog:{
        get(){
          return this.modelValue;
        },
        set(newValue){
          this.$emit("update:modelValue", newValue);
        }
      }
    },
    methods:{
      convertToName(code){
        return errorCode[code]
      }
    }
  }
</script>