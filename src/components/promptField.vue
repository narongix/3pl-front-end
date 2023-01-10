<template>
    <Dialog v-model:visible="promptDeleted" :style="{width: '450px'}" header='header' :modal=true>
        <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span>{{ text }}</span>
        </div>
        <template #footer>
            <Button :label="denied" icon="pi pi-times" class="p-button-text" @click="emit('onClickDenied')"/>
            <Button :label="accept" icon="pi pi-check" class="p-button-text" @click="emit("onClickAccept")"></Button>
        </template>
    </Dialog>
</template>

<script>
    export default{
        props:{
            trackingValue: any,
            header:String,
            text: String,
            denied: String,
            accept: String,
        },
        emits:["onClickDenied", "onClickAccept"],
        data(){
            return {
                promptDeleted:false
            }
        },
        watch:{
            trackingValue(newValue){
                this.promptDeleted=!!newValue
            }
        }
    }
</script>