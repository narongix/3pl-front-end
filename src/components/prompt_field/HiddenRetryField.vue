
<template>
    
    <Dialog :visible="popUpPrompt" :modal="true" :closable='true'>
        <p>{{ textLoading }}</p>
        <template #footer>
            <Button :label="message.noButton" class="p-button-secondary p-button-text" @click="noRetry"></Button>
            <Button :label="message.yesButton" class="p-button-text p-button-sucess" @click="loadData" @mousedown="unFocus"></Button>
            
        </template>
    </Dialog>
</template>

<script>
    export default{
        emits:["onClickedRetry"],
        props:{
            toLoad: Function,
            message: Object,
            errorToast: Object
        },
        data(){
            return {
                popUpPrompt: false,
                textLoading: null,
            }
        },
        methods:{
            async loadData(){
                try{
                    setTimeout(()=>{
                        this.textLoading = null
                        this.popUpPrompt = false
                    }, 100)

                    await this.toLoad()

                }catch(e){
                    setTimeout(()=>{
                        this.$toast.add(this.toast ?? {
                            severity: "error",
                            summary: "Failed",
                            detail: "Error",
                            life: 3000
                        })
                        this.textLoading=this.message.failed
                        this.popUpPrompt = true
                    }, 300)
                }
            },
            unFocus(event){
                try{
                   event.preventDefault()   
                }
                catch(e){
                    console.log(e)
                }
            },
            noRetry(){
                this.popUpPrompt=false
                this.textLoading=null
            },

            async retryLoading(){
                await this.loadData()
            }
        },
        watch:{
            toLoad:{
                immediate: true,
                handler: async function(newValue){
                    if(newValue){
                        await this.loadData()
                    }
                }
            }
        }

    }
</script>