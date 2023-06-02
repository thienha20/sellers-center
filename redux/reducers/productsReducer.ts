import actionTypes from "../types";
import {DELETED_IMAGE, SOURCE_PRODUCT_ID} from "../types/products";

const initialState = {
    product_id: '',
    product_temporary_id: '',
    name: {
        en: '',
        vi: '',
    },
    description: {
        en: '',
        vi: ''
    },
    category_id: 0,
    images: [],
    image_path: {},
    deleted_images: [],
    sku: '',
    price: '',
    list_price: '',
    amount: '',
    status: '',
    features: {},
    variations: [],
    variation_groups: {},
    product_temporary_status:'',
    shippings: {
        width: '',
        height: '',
        length: '',
        weight: '',
    }
};


const productsReducer = (state = initialState, action: any) => {
    const _state = {...initialState}

    switch (action.type) {
        case actionTypes.ALL_DATA:
            return action.payload
        case actionTypes.PRODUCT_ID:
            return {
                ...state,
                product_id: action.payload
            };
        case actionTypes.SOURCE_PRODUCT_ID:
            return {
                ...state,
                source_product_id: action.payload
            };
        case actionTypes.NAME_VI:
            return {
                ...state,
                name: {
                    ...state.name,
                    vi: action.payload
                }
            };
        case actionTypes.NAME_EN:
            return {
                ...state,
                name: {
                    ...state.name,
                    en: action.payload
                }
            };
        case actionTypes.AMOUNT:
            return {
                ...state,
                amount: action.payload
            };
        case actionTypes.IMAGES:
            return {
                ...state,
                images: action.payload
            };
        case actionTypes.IMAGE_PATH:
            return {
                ...state,
                image_path: action.payload
            };
        case actionTypes.PRICE:
            return {
                ...state,
                price: action.payload
            };
        case actionTypes.LIST_PRICE:
            return {
                ...state,
                list_price: action.payload
            };
        case actionTypes.STATUS:
            return {
                ...state,
                status: action.payload
            };
        case actionTypes.SKU:
            return {
                ...state,
                sku: action.payload
            };
        case actionTypes.CATEGORY_ID:
            return {
                ...state,
                category_id: action.payload
            };
        case actionTypes.VARIATIONS:
            return {
                ...state,
                variations: action.payload
            };
        case actionTypes.VARIATION_GROUPS:
            // console.log('action.payload',action.payload)
            // console.log('[...action.payload]',[...action.payload])
            // if (isArray(action.payload)) {
                // if(action.payload.length > 0){
                    return {
                        ...state,
                        variation_groups: {...action.payload}
                    };
                // }
            // }
            // return state
        case actionTypes.FEATURES:
            return {
                ...state,
                features: action.payload
            };
        case actionTypes.DESCRIPTION_VI:
            return {
                ...state,
                description: {
                    ...state.description,
                    vi: action.payload
                }
            };
        case actionTypes.DESCRIPTION_EN:
            return {
                ...state,
                description: {
                    ...state.description,
                    en: action.payload
                }
            };
        case actionTypes.WEIGHT:
            return {
                ...state,
                shippings: {
                    ...state.shippings,
                    weight: action.payload
                }
            };
        case actionTypes.LENGTH:
            return {
                ...state,
                shippings: {
                    ...state.shippings,
                    length: action.payload
                }
            };
        case actionTypes.HEIGHT:
            return {
                ...state,
                shippings: {
                    ...state.shippings,
                    height: action.payload
                }
            };
        case actionTypes.WIDTH:
            return {
                ...state,
                shippings: {
                    ...state.shippings,
                    width: action.payload
                }
            };
        case actionTypes.PRODUCT_TEMPORARY_STATUS:
            return {
                ...state,
                product_temporary_status: action.payload
            };
        case actionTypes.DELETED_IMAGE:
            return {
                ...state,
                deleted_images: action.payload
            };
        // case actionTypes.SHIPPING:
        //     _state.description.en = action.payload
        //     return _state
        case actionTypes.RESET:
            return {
                ...state,
                product_id: '',
                product_temporary_id:'',
                name: {
                    en: '',
                    vi: '',
                },
                description: {
                    en: '',
                    vi: ''
                },
                category_id: '',
                images: [],
                image_path: {},
                deleted_images: [],
                sku: '',
                price: '',
                list_price: '',
                amount: '',
                status: '',
                features: {},
                variations: [],
                variation_groups: {},
                shippings: {
                    width: '',
                    height: '',
                    length: '',
                    weight: '',
                }
            }
        default:
            return state;
    }
}
export default productsReducer;
