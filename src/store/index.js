import {createStore} from 'vuex';
import transfersModule from './modules/transfers/transfers_store.js';
import productsModule from './modules/products/products_store.js';
import authModule from './modules/auth/auth_store.js';
import recipientModule from './modules/recipient/recipient_store.js';
import transferTypeModule from './modules/transfer_type/transfer_type_store.js';
import stockedDetailReportModule from './modules/stocked_detail_report/stocked_detail_report_store.js';
import billing_store from './modules/billing/billing_store.js';
import user_store from './modules/user/user_store.js';
import dashboard_store from './modules/dashboard/dashboard_store.js';
import extra_charge from './modules/extra_charge/extra_charge_store.js';
import transfer_mass_create_store from './modules/transfers/transfer_mass_create_store.js';

const store = createStore({
    modules:{
        transfers: transfersModule,
        products: productsModule,
        auth: authModule,
        recipient: recipientModule,
        transferType: transferTypeModule,
        stockedDetailReport: stockedDetailReportModule,
        billing: billing_store,
        user: user_store,
        dashboard: dashboard_store,
        extraCharge: extra_charge,
        transferCreateState: transfer_mass_create_store
    },
    actions:{
        clearAllStates({ commit }){
            commit("transfers/onClearState");
            commit("products/onClearState");
            commit("recipient/onClearState");
            commit("stockedDetailReport/onClearState");
            commit("billing/onClearState");
            commit("transferCreateState/onClearAll")
        }
    }
});
export default store;