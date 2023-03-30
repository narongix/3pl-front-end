<template>
    <div class="card mb-0 pr-3 pl-4 min-h-full">
        <div class="flex justify-content-between mb-3">
            <div>
                <span class="block text-500 font-medium mb-0">{{ title }}</span>
                <span class="block text-500 font-medium mb-3">{{ title2}}</span>
                <div class="font-medium text-3xl" :class="myClass!=null ? myClass : 'text-900'">{{ body }}</div>
            </div>
            <slot>
            </slot>
        </div>
        <span class="text-green-500 font-medium">{{ (underBody ?? "") + " "}}</span>
        <span class="text-500">{{ underBodyGrey }}</span>
    </div>
</template>
<style>
    .text-red{
		color: rgba(255, 89, 47, 0.936);
	}
</style>
<script>
    export default{
        props:{
            title: null,
            title2: null,
            body: null,
            underBody: null,
            myClass: null,
            underBodyGrey: null,
        }
    }
</script>