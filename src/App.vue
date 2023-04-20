<template>
    <Toast />
	<div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" >
            
        </AppTopBar>
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
                <Toast />
            </div>
            <!-- <AppFooter /> -->
        </div>

		<AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" />
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
	</div>
</template>

<script>
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
import { mapGetters } from 'vuex';
import { roleGroupId } from './domains/domain';
import EventBus from './AppEventBus';

// import AppFooter from './AppFooter.vue';

export default {
    created(){
        EventBus.emit('theme-change', { theme: "saga-green", dark: false });
    },
    emits: ['change-theme'],
    data() {
        return {
            layoutMode: 'overlay',
            staticMenuInactive: true,
            overlayMenuActive: false,
            mobileMenuActive: false,
            menu : [
                {
                    label: 'Home',
                    items: [{
                        label: 'Dashboard', icon: 'pi pi-fw pi-home', to: this.myHome()
                    }]
                },
                {
                    label: 'Operation',
                    items: [
                        {label: 'Transfers', faIcon: 'fa-truck', to: '/transfers'},
                        // { label: 'Inventory Adjustments', icon: 'pi pi-fw pi-inven-adjust', to: '/inventory-adjustment'}
                    ]
                },   
                {
                    label: 'Products',
                    items: [
                        {label: 'Products', faIcon: 'fa-box', to: this.productListPage()},
                        {label: 'Product Categories', faIcon:'fa-table-cells-large', to: '/product-categories'},
                    ]
                },
                {
                    label: 'Reports',
                    items:[
                        {label: "Stock", faIcon: 'fa-boxes-stacked',  to: this.stockDetailPage()},
                        {label: 'Billing statement', faIcon: 'fa-file-invoice', to: this.billingPage()}
                    ]
                },

                ...this.adminPanel()
            ]
        }
    },

    computed: {
        ...mapGetters({
            getUserRole: "auth/getUserRole",    
        }),

        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        logo() {
            return (this.$appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
        }
    },
    methods: {
        isAdmin(){
            const userRole = this.$store.getters["auth/getUserRole"];
            return userRole == roleGroupId.Admin;
        },
        adminPanel(){
            if(this.isAdmin()){
                return [
                    {
                        label: "Setting",
                        items:[
                            {label: "Extra charge", faIcon: "fa-gear", to: "/admin_extra_charge"}
                        ]
                    } 
                ]
            }
            return [];
        },
        productListPage(){
            const userRole = this.$store.getters["auth/getUserRole"];
            if(userRole == roleGroupId.Admin){
                return "/products_admin"
            }
            return '/products';
        },

        myHome(){
            const userRole = this.$store.getters["auth/getUserRole"];
            if(userRole == roleGroupId.Admin){
                return "/admin";
            }else{
                return "/";
            }  
        },
        billingPage(){
            const userRole = this.$store.getters["auth/getUserRole"];
            if(userRole == roleGroupId.Admin){
                return "/billing_admin";
            }else{
                return "/billing";
            }  
        },
        stockDetailPage(){
            const userRole = this.$store.getters["auth/getUserRole"];
            if(userRole == roleGroupId.Admin){
                return '/stockDetailreport_admin';
            }else{
                return '/stockDetailreport';
            }
        },
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        }
    },
    watch: {
        $route() {
            this.menuActive = false;
            this.$toast.removeAllGroups();
        }
    },

    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        'AppConfig': AppConfig,
        // 'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
