<template>
    <div :class="myClass">
            <div class="grid grid-nogutter">
                <div class="col-12">
                    <div class="grid grid-nogutter">
                        <div class="col-1 flex align-items-center justify-content-center">
                            <slot name="icon">

                            </slot>
                        </div>
                        <div class="col-11">
                            <p class="font-bold text-xl">
                                {{ header }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-1"></div>
                <div class="col-11">
                    <slot name="bottom">

                    </slot>
                </div>
            </div>
        </div>
</template>

<style>
    .success{

        background-color: rgb(226, 255, 223);
        padding: 1rem 6px;
        border-radius: 5px;
        margin-bottom: 1rem;
    }
    .fail{
        background-color: rgb(255, 236, 236);
        padding: 1rem 6px;
        border-radius: 5px;
    }
</style>
<script>
    export default{
        props:{
            myClass: {
                type: [String, null],
                default: ()=>("success"),
            },
            header:{
                type: [String, Array, null],
                default: ()=>("")
            }
        }
    }
</script>