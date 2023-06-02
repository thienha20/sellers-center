import * as auth from './auth';
import * as settings from './settings';
import * as products from './products';

const types = {
    ...auth,
    ...settings,
    ...products
};
export default types
