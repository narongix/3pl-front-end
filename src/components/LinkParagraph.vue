<template>
    <a @click="$emit('pushing')" style="cursor: pointer;" :class="myClass">{{ data }}</a>
</template>
<script>
    export default {
        props: ["data", "myClass"],
        emits:[
            "pushing"
        ]
    }
</script>