import Types from '../types';
import {User} from "../../pages/api/me";

const logIn = (userLogin: User) => {
    return {
        type: Types.AUTH_LOGIN,
        payload: userLogin
    }
}

const logOut = () => {
    return {
        type: Types.AUTH_LOGOUT
    }
}

const AuthName = (userLogin: null | User) => {
    return {
        type: Types.AUTH_NAME,
        payload: userLogin
    }
}
const AuthEmail = (userLogin: User) => {
    return {
        type: Types.AUTH_NAME,
        payload: userLogin
    }
}
const AuthPhone = (userLogin: User) => {
    return {
        type: Types.AUTH_NAME,
        payload: userLogin
    }
}

let actions = {
    logIn,
    logOut,
    AuthName,
    AuthEmail,
    AuthPhone
}

export default actions