<template>
  <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <img :src="'images/HLH-Express-Logo.png'" class="mb-5"
                    style="width:81px; height:60px;">
      </div>
      <div class="col-12 xl:col-6"
           style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
        <div class="h-full w-full m-0 py-7 px-4"
             style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
          
          <form @submit.prevent="submitForm">
            <div class="w-full md:w-10 mx-auto">
              <div class="mb-3">
                <label for="email1" class="block text-xl font-medium mb-2"
                       :class="{'p-error': validation.email.value, 'text-900':!(validation.email.value)}">Email</label>
                <InputText id="email1" :class="{'p-invalid':validation.email.value}" v-model.trim="form.email" type="text"
                           class="w-full" placeholder="Email"
                           style="padding:1rem;"/>
                <small class="p-error" v-if="validation.email.value && !stopShowed">{{ validation.email.value }}</small>
              </div>

              <div class="mb-3">
                <label for="password1" class="block font-medium text-xl mb-2"
                       :class="{'myError': validation.password.value, 'text-900':!(validation.email.value)}">Password</label>
                <Password id="password1" :class="{'p-invalid': validation.password.value}" :feedback="false"
                          v-model.trim="form.password" placeholder="Password" :toggleMask="true"
                          class="w-full" inputClass="w-full" inputStyle="padding:1rem"></Password>
                <small class="p-error" v-if="validation.password.value">{{ validation.password.value }}</small>
              </div>

              <div class="flex align-items-center justify-content-between mb-5">
                <div class="flex align-items-center">
                  <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                  <label for="rememberme1">Remember me</label>
                </div>
              </div>
              <Button type="submit" label="Sign In" class="w-full p-3 text-xl"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import localStorageKeys from "../../domains/LocalStorageKeys.js";


  export default {
    data() {
      return {
        form: {
          email: "",
          password: ""
        },
        validation: {
          email: {
            value: null,
            validate: () => {
              this.stopShowed=false
              // If email is empty
              if (!(this.form.email)) {
                return this.validation.email.value = "Please fill in the blank"
              }
              this.validation.email.value = null
            }
          },
          password: {
            value: null,
            validate: () => {
              // If password is empty
              if (!(this.form.password)) {
                return this.validation.password.value = "Please fill in the blank"
              }
              this.validation.password.value = null
            }
          }
        },

        stopShowed: false,
        checked: true,
      }
    },

    computed: {
      ...mapState({
        accessToken: "auth/oneTimeAccessToken"
      }),
      logoColor() {
        if (this.$appState.darkTheme) return 'white';
        return 'dark';
      }
    },

    methods: {
      async submitForm() {
        const validated = this.validate()

        if (validated) {
          try{
            const loginData = await this.$store.dispatch('auth/login', this.form)
            // If uncheck
            if (this.checked) {
              localStorage.setItem(localStorageKeys.loggedInIndicatorKey, JSON.stringify(true))
              localStorage.setItem(localStorageKeys.userKey, JSON.stringify(loginData.user))
            }
            else{
              localStorage.removeItem(localStorageKeys.loggedInIndicatorKey, JSON.stringify(false))
              localStorage.removeItem(localStorageKeys.userKey)
            }

            this.$router.replace({name:"dashboard"})
          }catch(e){
            this.validation.password.value = e.errorMessage
            this.stopShowed=true
            this.validation.email.value="rise"
          }
        }
      },

      validate() {
        const myList = []
        for (const i in this.validation) {
          myList.push(this.validation[i].validate())
        }
        const index = myList.findIndex((e) => e)
        return index < 0
      }
    }
  }
</script>

<style scoped>
  .pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
  }

  .pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
  }
  .myError{
    color: red;
  }
</style>

