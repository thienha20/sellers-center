import {NextApiRequest, NextApiResponse} from "next"
import {withIronSessionApiRoute} from "iron-session/next"
import {sessionOptions} from "../../../utils/iron-auth/session"
import axios from "axios"
import {fnApiUrl} from "../../../utils/url"
import {Obj} from "../../../utils/types"
import _ from "lodash"

export default withIronSessionApiRoute(productsCreateHandler, sessionOptions);

async function productsCreateHandler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"});
    }
    try {
        if (req.session.user && Object.keys(req.body).length > 0) {

            // Assign user ID to request
            req.body.user_id = req.session.user.userData.user_id
            if(!_.isNil(req.body.variation_groups)){
                req.body.variation_groups = VarriantGroupObjToArray(req.body.variation_groups, req.body.variations )

                if (req.body.variation_groups.length > 0) {
                    req.body.sku = ''
                    req.body.price = ''
                    req.body.amount = ''
                    req.body.list_price = ''
                }
            }
            req.body.company_id = req.session.user.userData.company_id

            if(!_.isEmpty(req.body.variations)) {
                req.body.status = 'A'
            }

            delete req.body.image_path

            axios.post(fnApiUrl("3.0/products"), req.body,
                {
                    headers: {
                        "content-type": "application/json",
                        "Authorization": "Basic " + process.env.TOKEN,
                        "x-api-key": req.session.user.userData.api_key
                    },
                    params: {
                        mode: 'create_product',
                    },
                })
                .then(response => {
                    res.end()
                })
                .catch(error => {
                    console.log(error)
                    res.end()
                })
        } else
            res.end()

    } catch (error: any) {
        console.log(error)
        res.end()
    }
}

const VarriantGroupObjToArray = (data: Obj, variations: Obj[]) => {
    let result: Obj[] = []
    Object.keys(data).map((codeA, index) => {
        if (data[codeA].variations) {
            Object.keys(data[codeA].variations).map((codeB, indexB) => {
                variations.filter((variation) => {
                    variation.variants.filter((variant: Obj)=>{
                        if(codeA == variant.code) return data[codeA].variations[codeB].group_1 = variant.name
                        if(codeB == variant.code) return data[codeA].variations[codeB].group_2 = variant.name
                    })
                })
                data[codeA].variations[codeB].code = [codeA, codeB]
                if(_.isNil(data[codeA].variations[codeB]['price'])
                    || _.isEmpty(data[codeA].variations[codeB]['price'])
                ){
                    data[codeA].variations[codeB]['price'] = 0
                }
                if(_.isNil(data[codeA].variations[codeB]['list_price'])
                    || _.isEmpty(data[codeA].variations[codeB]['list_price'])
                ){
                    data[codeA].variations[codeB]['list_price'] = 0
                }
                if(_.isNil(data[codeA].variations[codeB]['amount'])
                    || _.isEmpty(data[codeA].variations[codeB]['amount'])
                ){
                    data[codeA].variations[codeB]['amount'] = 0
                }
                result.push(data[codeA].variations[codeB])
            })
        } else {
            variations.filter((variation) => {
                variation.variants.filter((variant: Obj)=>{
                    if(codeA == variant.code) return data[codeA].group_1 = variant.name
                })
            })

            data[codeA].code = [codeA]
            if(_.isNil(data[codeA]['price']) || _.isEmpty(data[codeA]['price'])){
                data[codeA]['price'] = 0
            }
            if(_.isNil(data[codeA]['list_price']) || _.isEmpty(data[codeA]['list_price'])){
                data[codeA]['list_price'] = 0
            }
            if(_.isNil(data[codeA]['amount']) || _.isEmpty(data[codeA]['amount'])){
                data[codeA]['amount'] = 0
            }
            result.push(data[codeA])
        }
    })
    return result
}
