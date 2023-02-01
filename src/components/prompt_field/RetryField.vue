<template>
    <Dialog :visible="loading" :modal="true" :closable='false' @update:visibile="hideHandler">
        <ProgressSpinner v-if="!textLoading"/>
        <p v-else>{{ textLoading }}</p>
        <template #footer>
            <div v-if="textLoading">
                <Button :label="message.noButton" class="p-button-secondary p-button-text" @click="noRetry"></Button>
                <Button :label="message.yesButton" class="p-button-text p-button-sucess" @click="retryLoading" @mousedown="unFocus"></Button>
                
            </div>
        </template>
    </Dialog>
</template>

<script>
    import ProgressSpinner from 'primevue/progressspinner';

    export default{
        components:{
            ProgressSpinner
        },
        props:{
            toLoad: Function,
            message: {
              failed: String,
              yesButton: String,
              noButton: String
            },
            errorToast: Object
        },
        data(){
            return {
                loading:false,
				textLoading: null,
            }
        },
        methods:{
            hideHandler(value){
                if(!value){
                    this.loading=false
                }
            },

            async loadData(){
                try{
                    this.textLoading=null
                    this.loading=true
                    await this.toLoad()
                    this.loading=false
                }catch(e){
                    console.log(e)
                    this.textLoading = this.message.failed
                    this.$toast.add(this.toast ?? {
                        severity: "error",
                        summary: "Failed",
                        detail: "Error",
                        life: 3000
                    })
                }
            },

			unFocus(event){
				event.preventDefault()
			},

            noRetry(){
                this.loading=false,
                this.textLoading=null
            },

            async retryLoading(){
                await this.loadData()
            }
        },
        watch:{
            toLoad:{
                handler: async function (newValue){
                    // if it is not null or not undefined
                    if(newValue){
                        await this.loadData()
                    }
                },
                immediate:true,
            }
        }
    }
</script>