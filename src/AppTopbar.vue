<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img alt="Logo" :src="topbarImage()" />
      <span>HLH 3PL</span>
    </router-link>
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" v-styleclass="{
      selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
      leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true
    }">
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <button class="p-link layout-topbar-button">
          <i class="pi pi-calendar"></i>
          <span>Events</span>
        </button>
      </li>
      <li>
        <button class="p-link layout-topbar-button">
          <i class="pi pi-cog"></i>
          <span>Settings</span>
        </button>
      </li>
      <li>
        <button @click="toggleoProfilepanel" class="p-link layout-topbar-button">
          <i class="pi pi-user"></i>
          <span>Profile</span>
        </button>
        <OverlayPanel ref="myPanel" :showCloseIcon="false" :dissmissable="true">
          <div v-if="getName" class="mb-3">
            Name: {{ getName }}
          </div>
          <div v-if="getEmail" class="mb-3">
            Email: {{ getEmail }}
          </div>

          <Button v-if="getToken" label="Log Out" iconPos="left" class="p-raise-button p-button-danger fullWidth"
            @click="onLogOut"></Button>
          <Button v-else class="p-raise-button p-button-success fullWidth" @click="onUserStuck">Login</Button>
        </OverlayPanel>
      </li>
    </ul>
    <RetryField :toLoad="toload" :message="message" :errorToast="errorToast"></RetryField>
  </div>
</template>

<style>
.fullWidth {
  width: 100%;
}
</style>

<script>
import { mapGetters } from 'vuex';
import RetryField from "@/components/prompt_field/RetryField.vue";

export default {
  components: { RetryField },
  data() {
    return {
      profilePanelTurnOn: false,

      toload: null,
      message: {
        failed: "Can't Logout, retry?",
        yesButton: "Yes",
        noButton: "No"
      },
      errorToast: {
        severity: "error",
        summary: "Can't logout",
        detail: "Something went wrong",
        life: 3000
      }
    }
  },

  computed: {
    ...mapGetters({
      getName: "auth/getFullName",
      getEmail: "auth/getEmail",
      getToken: "auth/getToken"
    }),

    darkTheme() {
      return this.$appState.darkTheme;
    }
  },
  methods: {
    onMenuToggle(event) {
      this.$emit('menu-toggle', event);
    },

    onTopbarMenuToggle(event) {
      this.$emit('topbar-menu-toggle', event);
    },

    topbarImage() {
      // TODO: create new logo 
      return this.$appState.darkTheme ? 'images/HLH-Express-Logo.png' : 'images/HLH-Express-Logo.png';
    },

    toggleoProfilepanel(event) {
      this.$refs.myPanel.toggle(event)
    },

    onLogOut() {
      this.toload = async () => {
        await this.$store.dispatch("auth/logout")
        await this.$store.dispatch("clearAllStates")

        await this.$router.replace({ name: "login" })
      }
    },

    async onUserStuck() {
      await this.$store.dispatch("clearAllStates")
      await this.$router.replace({ name: "login" })
    }
  }
}
</script> 