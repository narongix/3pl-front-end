import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router';
import App from './App.vue';
import store from "@/store";

import { roleGroupId } from './domains/domain';

const adminRoutes = [
    // {
    //     path: "/products_admin",
    //     name: "productListAdmin",
    //     component: ()=>import('./pages/products/admin/AdminProductList.vue'),
    //     meta:{role: roleGroupId.Admin},
    //     beforeEnter:()=>{
    //         if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
    //             return true;
    //         }
    //         return {name: "productList"};
    //     }
    // },
    {
        path: "/admin", 
        name: "admin",
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
        name: "adminBilling",
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
        name: "createProductAdmin",
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
        path: "/stockDetailreport_admin",
        name: "StockDetailReportAdmin",
        component: ()=> import("./pages/stocked_detail_report/admin/AdminStockDetailReportPage.vue"),
        meta: {role:roleGroupId.Admin},
        beforeEnter:()=>{
            if(store.getters["auth/getUserRole"] == roleGroupId.Admin){
                return true;
            }
            return {name:"StockDetailReport"};
        }
    },
    
];

const routes = [
    {
        path: '/auth',
        name: 'auth',
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
                name: "TransferList",   
                component: ()=> import("./pages/transfers/TransferList.vue"),
            },
            {
                path:"/transfers/create",
                name: "TransferCreate",
                component: ()=>import("./pages/transfers/CreateTransfer.vue"),
            },
            {
                path: "/transfers/:id",
                name: "TransferDetail",
                component: ()=>import("./pages/transfers/MyTransferDetail.vue"),
            },
            {
                path: "/transfers/:id/edit",
                name: "TransferEdit",
                component: ()=> import("./pages/transfers/MyTransferDetail.vue"),
            },
            {
                path: "/stockDetailreport",
                name: "StockDetailReport",
                component: ()=> import("./pages/stocked_detail_report/StockDetailReportPage.vue")
            },
            {
                path: '/products',
                name: "productList",
                component: ()=>import('./pages/products/ProductList.vue'),
                meta:{role: roleGroupId.User}
            },
            {
                path: '/products/product_detail/:id',
                name: 'productDetail',
                component: ()=>import('./pages/products/ProductDetail.vue')
            },
            {
                path: '/products/new/',
                name: "createProduct",
                component: ()=>import('./pages/products/CreateProductPage.vue'),
            },
            {
                path: '/product-categories',
                name: "productCategoriesList",
                component: ()=>import('./pages/products/ProductCategory.vue'),
            },
            {
                path: '/product-categories/new/',
                component: ()=>import('./pages/products/NewProductCategory.vue'),
    
            },
            {
                path: '/product-categories/:id',
                component: ()=>import('./pages/products/ProductCategoryDetail.vue')
            },

            {
                path: '/empty',
                name: 'empty',
                component: () => import('./components/EmptyPage.vue')
            },

            {
                path: "/billing",
                name:"billing",
                component: ()=>import("./pages/billing/BillingList.vue"),
            },
            {
                path:"/billing/detail",
                name: "billingDetail",
                component: ()=>import("./pages/billing/BillingDetail.vue"),            
            },
            {
                path:"/billing/detail/volume",
                name: "volumeList",
                component: ()=>import("./pages/billing/VolumeList.vue"),
            },
            {
                path:"/billing/detail/volume/productDetail",
                name: "volumeProductDetail",
                component: ()=>import("./pages/billing/VolumeProductDate.vue"),
            },

            ...adminRoutes
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/auth/UserAuth.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('./pages/Error.vue')
    },
    {
        path: '/notfound',
        name: 'notfound',
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


})

router.afterEach((to, from)=>{
    const isloggedIn = (store.getters["auth/isLoggedIn"])
    if(from== START_LOCATION && isloggedIn && to.name=='login'){
        return {name: "TransferList"}
    }
})

export default router;
