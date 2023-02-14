import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router';
import App from './App.vue';
import ProductList from './pages/products/ProductList.vue';
import ProductDetail from './pages/products/ProductDetail.vue';
import NewProduct from './pages/products/NewProduct.vue';
import ProductCategory from './pages/products/ProductCategory.vue' ;
import NewProductCategory from './pages/products/NewProductCategory.vue';
import ProductCategoryDetail from './pages/products/ProductCategoryDetail.vue';
import store from "@/store";


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
                component: ()=> import("./pages/transfers/TransferList.vue"),
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
                component: ProductList,
    
            },
            {
                path: '/products/:id',
                component: ProductDetail
            },
            {
                path: '/products/new/',
                component: NewProduct
            },
            {
                path: '/product-categories',
                name: "productCategoriesList",
                component: ProductCategory,
    
            },
            {
                path: '/product-categories/new/',
                component: NewProductCategory,
    
            },
            {
                path: '/product-categories/:id',
                component: ProductCategoryDetail
            },

            {
                path: '/empty',
                name: 'empty',
                component: () => import('./components/EmptyPage.vue')
            },
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
    const token = store.getters["auth/getToken"]
    const user = store.getters["auth/user"]
    const isloggedIn = (store.getters["auth/isLoggedIn"]) ?? false

    // if user doesn't have token and the page the user redirect to isn't login
    const noDataToken = !token && to.name !== "login"

    // if user doesn't have data and the page the user redirect to isn't login
    const noDataUser = !user && to.name !== "login"

    if(isloggedIn && to.name=='login'){
        return {name: from.name ?? 'dashboard'}
    }   

    if(noDataToken || noDataUser || !isloggedIn && to.name!='login'){
        return {name:"login"}
    }

    // If page is refresh and theres no token or no data, and it's not at login page
    // Or if the page is refresh and get unauthenticated
    if(from == START_LOCATION && (noDataToken || noDataUser) && to.name!='login'){
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
