import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import  thunk  from  'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// ===========================|| REDUX - MAIN STORE ||=========================== //

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['auth', 'settings']
};
const pReducer = persistReducer(persistConfig, reducer);

const store = createStore(pReducer,  composeWithDevTools(applyMiddleware(thunk)));
const persistor = persistStore(store);

const redux = {store, persistor}
export default redux

