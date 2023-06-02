import authReducer from "./authReducer";
import settingsReducer from "./settingsReducer";
import productsReducer from "./productsReducer";

export interface ReducerInterFace {
    auth: any
    settings: any,
    products: any
}

const reducers: ReducerInterFace = {
    auth: authReducer,
    settings: settingsReducer,
    products: productsReducer
}
export default reducers
