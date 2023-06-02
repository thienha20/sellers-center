import auth from './auth';
import settings from './settings';
import products from "./products";

export type Action = {
    auth: any
    settings: any
    products:any
}
const actions: Action = {
    auth,
    settings,
    products
};
export default actions
