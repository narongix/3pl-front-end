<template>
    <a @click="$emit('pushing')" style="cursor: pointer;">{{ data }}</a>
</template>
<script>
    export default {
        props: ["data"],
        emits:[
            "pushing"
        ]
    }
</script>