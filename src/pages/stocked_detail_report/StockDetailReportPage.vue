<template>
    <div class="card">
        <DataTable>

        </DataTable>
    </div>
    <RetryField></RetryField>
</template>

<script>
    import RetryField from '../../components/prompt_field/RetryField.vue';

    export default{
        created(){

        },
        data(){
            return {
                toLoad: null,
                message: {
                    failed: "Loading failed, retry?",
                    yesButton: "Yes",
                    noButton: "No"
                },
                errorToast:{
                    severity: "error",
                    summary: "Loading Failed!",
                    detail: "Error Loading Stocked Detail Report",
                    life: 3000
                }
            }
        },
        computed:{
            
        },
        methods:{

        }
    }
</script>