// action - state management
import actionTypes from '../types'

import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'

export interface ActionRedux {
    type: string,
    payload?: { userData: UserData }
}

export interface UserData {
    user_id?: number
    company_id?: number
    email?: string
    firstname?: string
    lastname?: string
    phone?: string
    api_key?: string
    vendor_root?: string
    permission?: string[] | null
}

const INITIAL_STATE: { currentUser: UserData | undefined | null, isLoggingIn: boolean } = {
    currentUser: null,
    isLoggingIn: false
};

const AuthReducer = (state = INITIAL_STATE, action: ActionRedux) => {
    switch (action.type) {
        case actionTypes.AUTH_LOGIN:
            return {
                ...state,
                isLoggingIn: true,
                currentUser: action.payload?.userData
            };
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                isLoggingIn: false,
                currentUser: null
            };
        case actionTypes.AUTH_NAME:
            return {
                ...state,
                currentUser: {...state.currentUser, ...action.payload?.userData}
            };
        case actionTypes.AUTH_PHONE:
            return {
                ...state,
                currentUser: {...state.currentUser, ...action.payload?.userData},
            };
        case actionTypes.AUTH_EMAIL:
            return {
                ...state,
                currentUser: {...state.currentUser, ...action.payload?.userData},
            };
        default:
            return state;
    }
};

const persistConfig = {
    key: 'auth',
    storage: storage,
    blacklist: ['isLoggingIn']
};

export default persistReducer(persistConfig, AuthReducer);