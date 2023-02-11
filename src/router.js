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
                path: '/formlayout',
                name: 'formlayout',
                component: () => import('./components/FormLayoutDemo.vue')
            },
            {
                path: '/input',
                name: 'input',
                component: () => import('./components/InputDemo.vue')
            },
            {
                path: '/floatlabel',
                name: 'floatlabel',
                component: () => import('./components/FloatLabelDemo.vue')
            },
            {
                path: '/invalidstate',
                name: 'invalidstate',
                component: () => import('./components/InvalidStateDemo.vue')
            },
            {
                path: '/button',
                name: 'button',
                component: () => import('./components/ButtonDemo.vue')
            },

            {
                path: '/table',
                name: 'table',
                component: () => import('./components/TableDemo.vue')
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
                path: '/list',
                name: 'list',
                component: () => import('./components/ListDemo.vue')
            },
            {
                path: '/tree',
                name: 'tree',
                component: () => import('./components/TreeDemo.vue')
            },
            {
                path: '/panel',
                name: 'panel',
                component: () => import('./components/PanelsDemo.vue')
            },
            {
                path: '/overlay',
                name: 'overlay',
                component: () => import('./components/OverlayDemo.vue')
            },
            {
                path: '/media',
                name: 'media',
                component: () => import('./components/MediaDemo.vue')
            },
            {
                path: '/menu',
                component: () => import('./components/MenuDemo.vue'),
                children: [
                    {
                        path: '',
                        component: () => import('./components/menu/PersonalDemo.vue')
                    },
                    {
                        path: '/menu/seat',
                        component: () => import('./components/menu/SeatDemo.vue')
                    },
                    {
                        path: '/menu/payment',
                        component: () => import('./components/menu/PaymentDemo.vue')
                    },
                    {
                        path: '/menu/confirmation',
                        component: () => import('./components/menu/ConfirmationDemo.vue')
                    },
                ],
            },
            {
                path: '/messages',
                name: 'messages',
                component: () => import('./components/MessagesDemo.vue')
            },
            {
                path: '/file',
                name: 'file',
                component: () => import('./components/FileDemo.vue')
            },
            {
                path: '/chart',
                name: 'chart',
                component: () => import('./components/ChartDemo.vue')
            },
            {
                path: '/misc',
                name: 'misc',
                component: () => import('./components/MiscDemo.vue')
            },
            {
                path: '/crud',
                name: 'crud',
                component: () => import('./pages/CrudDemo.vue')
            },
            {
                path: '/timeline',
                name: 'timeline',
                component: () => import('./pages/TimelineDemo.vue')
            },
            {
                path: '/empty',
                name: 'empty',
                component: () => import('./components/EmptyPage.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('./components/Documentation.vue')
            },
            {
                path: '/blocks',
                name: 'blocks',
                component: () => import('./components/BlocksDemo.vue')
            },
            {
                path: '/icons',
                name: 'icons',
                component: () => import('./components/IconsDemo.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/auth/UserAuth.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('./pages/LandingDemo.vue')
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
    const isloggedIn = (store.getters["auth/isLoggedIn"])

    // if user doesn't have token and the page the user redirect to isn't login
    const noDataToken = !token && to.name !== "login"

    // if user doesn't have data and the page the user redirect to isn't login
    const noDataUser = !user && to.name !== "login"

    if(isloggedIn && to.name=='login'){
        return {name: from.name}
    }   

    if(noDataToken || noDataUser){
        return {name:"login"}
    }

    // If page is refresh and theres no token or no data, and it's not at login page
    // Or if the page is refresh is get unauthenticated
    if(from == START_LOCATION && (noDataToken || noDataUser)){
        return {name: "login"}
    }

    }
)

export default router;
