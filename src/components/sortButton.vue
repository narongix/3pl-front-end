<template>
    <div>
        <Button v-if="myValue == null" class="sortButton" @click="onClickChangeToAsc" rounded text>
            <font-awesome-icon icon="fa-solid fa-sort" />
        </Button>
        <Button v-if="myValue == 1" class="sortButton" @click="onClickChangeToDesc" rounded text>
            <font-awesome-icon icon="fa-solid fa-sort-up"/>
        </Button>
        <Button v-if="myValue == 2" class="sortButton" @click="onClickChangeToNeutral" rounded text>
            <font-awesome-icon icon="fa-solid fa-sort-down"/>
        </Button>
    </div>
</template>

<style lang="scss" src="../assets/styles/sass/_sortButton.scss" scoped>
</style>

<script>
    export default{
        props:{
            modelValue: null,
            name: String
        },
        emits:["update:modelValue", "onClick"],
        computed:{
            myValue:{
                get(){
                    return this.modelValue;
                },

                set(newValue){
                    this.$emit("update:modelValue", newValue);
                }
            }
        },
        methods:{
            onClickChangeToAsc(){
                this.myValue=1;
                this.$emit("onClick", {sortId: 1, name: this.name});
            },
            onClickChangeToDesc(){
                this.myValue=2;
                this.$emit("onClick", {sortId: 2, name: this.name});
            },
            onClickChangeToNeutral(){
                this.myValue=null;
                this.$emit("onClick", {sortId: null, name: null});
            }
        }
    }
</script>