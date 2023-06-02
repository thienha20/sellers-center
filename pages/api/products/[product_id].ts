import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {Obj} from "../../../utils/types";
import _ from "lodash"

export default withIronSessionApiRoute(productsIdHandler, sessionOptions);

type Variant = {
    variant_id?:string|null|undefined,
    name?:string|null|undefined,
    code?:string|null|undefined,
}

var isOldProduct:boolean = false

async function productsIdHandler(req: NextApiRequest, res: NextApiResponse) {

    const {
        product_id
    } = req.query;
    try {
        if (req.session.user) {
            const api_response = await axios.get(fnApiUrl(`3.0/products/${product_id}`), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                }
            })
            let api_response_data = api_response.data.data
            api_response_data.category_id = parseInt(api_response_data.category_id)

            // variations
            api_response_data?.variations ?
                api_response_data.variations = validateVariations(api_response_data?.variations, api_response_data.product_id) :
                api_response_data.variations = {}

            // variation_groups
            api_response_data?.variation_groups ?
                api_response_data.variation_groups = VarriantGroupArrayToObj(api_response_data?.variation_groups, api_response_data.product_id) :
                api_response_data.variation_groups = {}

            // category_id
            _.isNaN(Number(api_response_data.category_id))
                ? api_response_data.category_id = -1 :
                api_response_data.category_id = Number(api_response_data.category_id)

            res.json(api_response_data)
        }
    } catch (error: any) {
        // res.status(error.response.status).json(error.response.data);
        res.end()
    }
}

const validateVariations = (data: Obj[], product_id:string) => {
    data.map(variation => {
        variation.variants.forEach((variant:Variant)=>{
            if(_.isNil(variant.code)){
                isOldProduct = true
                variant.code = 'SC-'+product_id + '-' + variant.variant_id
            }
             return variant
         })
        return variation
    })
    return data
}

const VarriantGroupArrayToObj = (data: Obj[], product_id:string=''): Obj => {
        let result: Obj = {}
        if (data?.length > 0) {
            let _data = (data)
            _data.map((v: Obj) => {
                // phải xử lý mapping Varriant trước khi convert thành Object
                if(isOldProduct && !_.isNil(v.variant_ids) && !_.isNil(v.code)) {
                    v.variant_ids.forEach((variant_id:string,index:number)=>{
                        v.code[index] = 'SC-'+ product_id + '-' + variant_id
                    })
                }

                let codeA = v.code[0];
                let codeB = undefined
                if (v.code.length == 2) {
                    codeB = v.code[1];
                }

                if (codeB) {
                    if (!result[codeA]) result[codeA] = {}
                    if (!result[codeA].variations) result[codeA].variations = {}
                    result[codeA].variations[codeB] = v
                } else {
                    result[codeA] = v
                }
            })
        }
    return result
}
