<template>
    <Dialog :visible="loading" :loading="loading" :modal="true" :closable='false'>
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
            message: Object
        },
        data(){
            return {
                loading:false,
				textLoading: null,
            }
        },
        methods:{
            async loadData(){
                try{
                    this.textLoading=null
                    this.loading=true
                    await this.toLoad()
                    this.loading=false
                }catch(e){
                    this.textLoading = this.message.error
                    console.log(e)
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
                async handler(newValue){
                    // if it is not null or not undefined
                    if(newValue){
                        await this.loadData()
                    }
                },
                immediate:true,
            },

        }
    }
</script>