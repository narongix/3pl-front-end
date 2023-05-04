<template>
    <div class="flex formgrid grid grid-nogutter align-items-center justify-content-center" style="width:100%">
        <div class="col-10">
            <p>{{ header }}</p>
        </div>
        <div class="col-2">
            <slot>  

            </slot>
        </div>
    </div>
</template>

<script>
    export default{
        props:{
            header: {
                type: null,
                default: ()=>("")
            }
        }
    }
</script>
