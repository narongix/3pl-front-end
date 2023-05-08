<template>
    <Dialog :visible="loading" :modal="true" :closable='false' @update:visibile="hideHandler">
        <font-awesome-icon v-if="!textLoading" icon="fa-solid fa-spinner" spin-pulse size="2xl" class="mySpinner"/>
        <p v-else>{{ textLoading }}</p>
        <template #footer>
            <div v-if="textLoading">
                <Button :label="message?.noButton ?? 'No'" class="p-button-secondary p-button-text" @click="noRetry"></Button>
                <Button :label="message?.yesButton ?? 'Yes'" class="p-button-text p-button-sucess" @click="retryLoading" @mousedown="unFocus"></Button>
                
            </div>
        </template>
    </Dialog>
</template>

<style lang="scss" src="../../assets/styles/sass/_mySpinner.scss" />

<script>
    export default{
        props:{
            toLoad: Function,
            message: {
              failed: {
                type: String,
                default: ()=>"failed"
              },
              yesButton: {
                type: String,
                default: ()=>"Yes"
              },
              noButton: {
                type: String,
                default: ()=>"No"
              }
            },
            errorToast: {
                severity: {
                    type: String,
                    default: ()=>"error"
                },
                summary: {
                    type: String,
                    default: ()=>"Error!"
                },
                detail: {
                    type: String,
                    default: ()=>"Failed Loading"
                },
                life: {
                    type: Number,
                    default: ()=>2000
                }
            }
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
                    this.textLoading = e?.message ?? this.message?.failed ?? this.errorToast?.detail ?? "Something went wrong.";

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