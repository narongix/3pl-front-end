<template>
  <div>
    <slot :startCountdown="startCountdown" :stopCountDown="stopCountDown">
    </slot>
  </div>
</template>

<script>
    export default{
        props:{
            onload: Function
        },
        emits:["countDownTime", "activateAPI"],
        data(){
            return {
                countdown: null,
                countdownTracker: null
            }
        },
        methods:{
            async startCountdown(){
                this.countdown=3
                return this.countdown=2
            },

            stopCountDown(){
              clearTimeout(this.countdownTracker)
            }
        },  
        watch:{
            countdown: {
                immediate: true,
                deep: true,
                handler: async function (newValue) {
                    // To prevent in case it fires oncreate and value is null
                    if (newValue == null || newValue == undefined){
                        return
                    }

                    this.$emit("countDownTime", this.countdown)

                    if (newValue > 0) {
                        return this.countdownTracker = setTimeout(() => {
                            this.countdown -= 1;
                          this.$emit("countDownTime", this.countdown)
                        }, 1000);
                    }
                    
                    this.$emit("activateAPI");
                }
            },

            countdownTracker(newValue, oldValue) {
                clearTimeout(oldValue);
            },
        }
    }
</script>