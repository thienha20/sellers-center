import Types from "../types";
import {Obj} from "../../utils/types";

const all_data = (product: Obj) => {
    return {
        type: Types.ALL_DATA,
        payload: product
    }
}
const product_id = (id: string) => {
    return {
        type: Types.PRODUCT_ID,
        payload: id
    }
}
const source_product_id = (id: string) => {
    return {
        type: Types.SOURCE_PRODUCT_ID,
        payload: source_product_id
    }
}
const product_temporary_id = (product_temporary_id: string) => {
    return {
        type: Types.PRODUCT_ID,
        payload: product_temporary_id
    }
}
const name_en = (name: string) => {
    return {
        type: Types.NAME_EN,
        payload: name
    }
}
const name_vi = (name: string) => {
    return {
        type: Types.NAME_VI,
        payload: name
    }
}

const images = (images: string[]) => {
    return {
        type: Types.IMAGES,
        payload: images
    }
}
const image_path = (image_path: string[]) => {
    return {
        type: Types.IMAGE_PATH,
        payload: image_path
    }
}
const category_id = (category_id: number) => {
    return {
        type: Types.CATEGORY_ID,
        payload: category_id
    }
}
const list_price = (list_price: number | string) => {
    return {
        type: Types.LIST_PRICE,
        payload: list_price
    }
}
const price = (price: number | string) => {
    return {
        type: Types.PRICE,
        payload: price
    }
}
const amount = (amount: number | string) => {
    return {
        type: Types.AMOUNT,
        payload: amount
    }
}
const sku = (sku: number | string) => {
    return {
        type: Types.SKU,
        payload: sku
    }
}
const status = (status: string) => {
    return {
        type: Types.STATUS,
        payload: status
    }
}
const variations = (variations: any) => {
    return {
        type: Types.VARIATIONS,
        payload: variations
    }
}

const features = (features: any) => {
    return {
        type: Types.FEATURES,
        payload: features
    }
}

const description_en = (description_en: any) => {
    return {
        type: Types.DESCRIPTION_EN,
        payload: description_en
    }
}
const description_vi = (description_vi: any) => {
    return {
        type: Types.DESCRIPTION_VI,
        payload: description_vi
    }
}
const variation_groups = (variation_groups: any) => {
    // console.log(variation_groups)
    return {
        type: Types.VARIATION_GROUPS,
        payload: {...variation_groups}
    }
}
const weight = (weight: string | number) => {
    return {
        type: Types.WEIGHT,
        payload: weight
    }
}
const height = (height: string | number) => {
    return {
        type: Types.HEIGHT,
        payload: height
    }
}
const length = (length: string | number) => {
    return {
        type: Types.LENGTH,
        payload: length
    }
}
const width = (width: string | number) => {
    return {
        type: Types.WIDTH,
        payload: width
    }
}
const product_temporary_status = (product_temporary_status: string) => {
    return {
        type: Types.PRODUCT_TEMPORARY_STATUS,
        payload: product_temporary_status
    }
}

const deleted_images = (deleted_images: string) => {
    return {
        type: Types.DELETED_IMAGE,
        payload: deleted_images
    }
}

const reset = ()=> {
    return {
        type: Types.RESET,
        payload: {
            product_id: '',
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
            image_path: [],
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
            },
            deleted_images: []
        }
    }
}
let actions = {
    all_data,
    product_id,
    source_product_id,
    product_temporary_id,
    name_vi,
    name_en,
    images,
    list_price,
    price,
    amount,
    sku,
    status,
    category_id,
    variations,
    features,
    description_en,
    description_vi,
    variation_groups,
    weight, length, width, height,
    product_temporary_status,
    deleted_images,
    reset
}
export default actions
