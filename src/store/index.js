import {createStore} from 'vuex';
import createPersistedState from 'vuex-plugin-persistedstate';
import transfersModule from './modules/transfers/transfers_store.js';
import productsModule from './modules/products/products_store.js';
import authModule from './modules/auth/index.js';
import recipientModule from './modules/recipient/recipient_store.js';
import transferTypeModule from './modules/transfer_type/transfer_type_store.js';
const store = createStore({
    plugins:[createPersistedState()],
    modules:{
        transfers: transfersModule,
        products: productsModule,
        auth: authModule,
        recipient: recipientModule,
        transferType: transferTypeModule
    }
});
export default store;