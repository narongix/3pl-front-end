<template>
    <Dialog :visible="popUp" :modal="true" :closable="false"> 
        <div class="flex align-items-center justify-content-center">
            <slot>
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
                <span>{{ message?.prompt ?? "Are you sure you want to do this operation?" }}</span>
            </slot>
        </div>

        <template #footer>
            <Button :label="message.decline" icon="pi pi-times" class="p-button-text" @click="Decline"></Button>
            <Button :label="message.accept" icon="pi pi-check" class="p-button-text" @click="$emit('onAccept')"></Button>
        </template>
    </Dialog>
</template>

<script>
    export default{
        props:{
            loading: Boolean,
            message: {
              decline: String,
              accept: String,
              prompt: null
            }
        },
        emits:["onDecline", "onAccept"],
        data(){
            return {
                popUp: false,
                error: false,
                toLoad: null,
            }
        },

        methods:{
            Decline(){
                this.popUp = false
                this.$emit("onDecline", this.popUp)
            }
        },
        watch:{
            loading:{
                immediate: true,
                handler: async function(newValue){
                    this.popUp=newValue
                }
            },
        }

    }
</script>