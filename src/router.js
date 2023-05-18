import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router';
import App from './App.vue';
import store from "@/store";

import { roleGroupId } from './domains/domain';
import RouteName from './domains/Routename';

const adminRoutes = [
    {
        path: "/products_admin",
        name: RouteName.adminProductListPage,
        component: ()=>import('./pages/products/admin/AdminProductList.vue'),
        meta:{role: roleGroupId.Admin},
        beforeEnter:()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name: "productList"};
        }
    },
    {
        path: "/admin", 
        name: RouteName.adminDashBoardPage,
        component: () => import("./pages/dashboard/admin/DashboardAdmin.vue"),
        meta:{role:roleGroupId.Admin},
        beforeEnter:()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name: "productList"};
        }
    },
    {
        path: "/billing_admin",
        name: RouteName.adminBillingPage,
        component: () => import("./pages/billing/admin/AdminBillingList.vue"),
        meta: {requireAuth: true, role: roleGroupId.Admin},
        beforeEnter: ()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name: "billing"};
        }
    },
    {
        path: "/products/new_admin",
        name: RouteName.adminCreateProductPage,
        component: () => import("./pages/products/admin/AdminCreateProduct.vue"),
        meta: {requireAuth: true, role: roleGroupId.Admin},
        beforeEnter: ()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name: "productList"};
        }
    },
    {
        path: "/products/admin_import",
        name: RouteName.adminMassCreateProductPage,
        component: ()=> import("./pages/products/admin/AdminProductMassCreate.vue"),
        meta: {role: roleGroupId.Admin},
        beforeEnter: ()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name: RouteName.massCreatePage};
        }
    },
    {
        path: '/product-categories-Admin',
        name: RouteName.adminProductCategoryListPage,
        component: ()=>import('./pages/products/admin/AdminProductCategoryList.vue'),
    },
    {
        path: '/product-categories-Admin/new/',
        name: RouteName.adminCreateProductCategoryPage,
        component: ()=>import('./pages/products/admin/AdminCreateProductCategoryPage.vue'),

    },
    {
        path: '/product-categories-Admin/:id',
        name: RouteName.adminDetailProductCategoryPage,
        component: ()=>import('./pages/products/admin/AdminDetailProductCategoryPage.vue')
    },
    {
        path: "/stockDetailreport_admin",
        name: RouteName.adminStockDetailReportPage,
        component: ()=> import("./pages/stocked_detail_report/admin/AdminStockDetailReportPage.vue"),
        meta: {role:roleGroupId.Admin},
        beforeEnter:()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name:"StockDetailReport"};
        }
    },
    {
        path: "/admin_extra_charge",
        name: RouteName.adminExtraChargePage,
        component: ()=>import("./pages/extra_charge/ExtraChargeList.vue"),
        meta:{role:roleGroupId.Admin},
        beforeEnter:()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return false;
        }
    },
    {
        path: "/admin_extra_charge/:id",
        name: RouteName.adminExtraChargeDetailPage,
        component: ()=> import("./pages/extra_charge/ExtraChargeDetail.vue")
    },
    {
        path: "/admin_extra_charge/create",
        name: RouteName.adminExtraChargeCreatePage,
        component: ()=>import("./pages/extra_charge/ExtraChargeCreate.vue")
    },
    {
        path: "/transfers_admin/:id",
        name: RouteName.adminTransferDetailPage,
        component:()=>import("./pages/transfers/admin/AdminTransferDetail.vue")
    }
];

const routes = [
    {
        path: '/auth',
        name: RouteName.authPage,
        component: () => import('./pages/auth/UserAuth.vue')
    },
    {

        path: '/',
        name: 'app',
        component: App,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: ()=> {
                    if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                        return import("./pages/dashboard/admin/DashboardAdmin.vue");
                    }
                    return import("./pages/dashboard/DashboardPage.vue");
                },
            },
            {
                path: '/transfers',
                name: RouteName.transferListPage,   
                component: ()=> import("./pages/transfers/TransferList.vue"),
            },
            {
                path:"/transfers/create",
                name: RouteName.transferCreatePage,
                component: ()=>import("./pages/transfers/CreateTransfer.vue"),
            },
            {
                path: "/transfers/create/select",
                name: RouteName.massImportTransferProductpage,
                component: ()=>import("./pages/transfers/TransferMassSelectProduct.vue")
            },
            {
                path: "/transfers/:id",
                name: RouteName.transferDetailPage,
                component: ()=>import("./pages/transfers/MyTransferDetail.vue"),
            },
            {
                path: "/transfers/:id/edit",
                name: RouteName.transferEditPage,
                component: ()=> import("./pages/transfers/MyTransferDetail.vue"),
            },
            {
                path: "/stockDetailreport",
                name: RouteName.stockDetailReportPage,
                component: ()=> import("./pages/stocked_detail_report/StockDetailReportPage.vue")
            },
            {
                path: '/products',
                name: RouteName.productListPage,
                component: ()=>import('./pages/products/ProductList.vue'),
                meta:{role: roleGroupId.User}
            },
            {
                path: '/products/product_detail/:id',
                name: RouteName.productDetailPage,
                component: ()=>import('./pages/products/ProductDetail.vue')
            },
            {
                path: '/products/new/',
                name: RouteName.createProductPage,
                component: ()=>import('./pages/products/CreateProductPage.vue'),
            },
            {
                path: "/products/import",
                name: RouteName.massCreatePage,
                component: ()=>import('./pages/products/ProductMassCreate.vue')
            },
            {
                path: '/product-categories',
                name: RouteName.productCategoriesListPage,
                component: ()=>import('./pages/products/ProductCategory.vue'),
            },
            {
                path: '/product-categories/new/',
                name: RouteName.productCategoriesCreatePage,
                component: ()=>import('./pages/products/NewProductCategory.vue'),
    
            },
            {
                path: '/product-categories/:id',
                name: RouteName.productCategoriesDetailPage,
                component: ()=>import('./pages/products/ProductCategoryDetail.vue')
            },

            {
                path: '/empty',
                name: RouteName.emptyPage,
                component: () => import('./components/EmptyPage.vue')
            },

            {
                path: "/billing",
                name: RouteName.billingPage,
                component: ()=>import("./pages/billing/BillingList.vue"),
            },
            {
                path:"/billing/detail",
                name: RouteName.billingDetailPage,
                component: ()=>import("./pages/billing/BillingDetail.vue"),            
            },
            {
                path:"/billing/detail/volume",
                name: RouteName.volumeListpage,
                component: ()=>import("./pages/billing/VolumeList.vue"),
            },
            {
                path:"/billing/detail/volume/productDetail",
                name: RouteName.volumeProductDetailPage,
                component: ()=>import("./pages/billing/VolumeProductDate.vue"),
            },

            ...adminRoutes
        ]
    },
    {
        path: '/login',
        name: RouteName.loginPage,
        component: () => import('./pages/auth/UserAuth.vue')
    },
    {
        path: '/error',
        name: RouteName.errorPage,
        component: () => import('./pages/Error.vue')
    },
    {
        path: '/notfound',
        name: RouteName.notFoundPage,
        component: () => import('./pages/NotFound.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/Access.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to,from)=>{
    const token = store.getters["auth/getToken"];
    const user = store.getters["auth/user"];
    const isLoggedIn = user?.id != null && token != null; 

    // For now this login isn't complete, sometime might give out error,
    // Closing this for now and will use it in the future
    // // if user doesn't have token and the page the user redirect to isn't login
    // const noDataToken = !token && to.name !== "login"

    // // if user doesn't have data and the page the user redirect to isn't login
    // const noDataUser = !user && to.name !== "login"

    if(isLoggedIn && to.name=='login'){
        return {name: from.name ?? 'dashboard'}
    }   

    if(!isLoggedIn && to.name!='login'){
        return {name:"login"}
    }

    // If page is refresh and theres no token or no data, and it's not at login page
    // Or if the page is refresh and get unauthenticated
    if(from == START_LOCATION && !isLoggedIn && to.name!='login'){
        return {name: "login"}
    }

    if(from.name == RouteName.massImportTransferProductpage && to.name != RouteName.transferCreatePage){
        store.dispatch("transferCreateState/onClearAll");
    }


})

router.afterEach((to, from)=>{
    const isloggedIn = (store.getters["auth/isLoggedIn"])
    if(from== START_LOCATION && isloggedIn && to.name=='login'){
        return {name: "TransferList"}
    }
})

export default router;
