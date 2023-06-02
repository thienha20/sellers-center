import {withIronSessionApiRoute} from "iron-session/next"
import {sessionOptions} from "../../../utils/iron-auth/session"
import {NextApiRequest, NextApiResponse} from "next"
import axios from "axios"
import {fnApiUrl} from "../../../utils/url"
import {draft_status, product_status} from "../../../utils/type/Product/productStatus.type"
import {Obj} from "../../../utils/types"

export default withIronSessionApiRoute(productsRoute, sessionOptions)

async function productsRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"})
    }

    const {
        product_id,
        search_query,
        product_code,
        seller_skus,
        price_from,
        price_to,
        items_per_page,
        category_id,
        brand_id,
        page,
        lang_code,
        status,
        parent_product_id,
        time_from,
        time_to,
        sort_by,
        sort_order
    } = await req.body

    try {
        if (req.session.user) {
            let mode = 'list'
            let data: Obj = {}
            if (req.body.status in draft_status) {
                mode = 'product_temporaries'
                data = {
                    product_name: search_query ?? undefined,
                    status: product_status[status],
                    page: page ?? 1,
                    lang_code: lang_code ?? 'vi',
                    items_per_page: items_per_page ?? undefined,
                    time_from: time_from ?? undefined,
                    time_to: time_to ?? undefined,
                    sort_by:sort_by?? undefined,
                    sort_order:sort_order?? undefined,
                }
            } else {
                data = {
                    product_id: product_id ?? undefined,
                    search_query: search_query ?? undefined,
                    product_code: product_code ?? undefined,
                    seller_skus: seller_skus ?? undefined,
                    items_per_page: items_per_page ?? undefined,
                    price_from: price_from ?? undefined,
                    price_to: price_to ?? undefined,
                    page: page ?? 1,
                    lang_code: lang_code ?? 'vi',
                    status: product_status[status]?? undefined,
                    category_id: category_id ?? undefined,
                    brand_id: brand_id ?? undefined,
                    parent_product_id: parent_product_id?? undefined,
                    sort_by:sort_by?? undefined,
                    sort_order:sort_order?? undefined,
                }

                data['es_search'] = (process.env.ES_PRODUCTS) ? true : ''
            }
            console.log(data['sort_by'], data['sort_order'])
            const api_response = await axios.get(fnApiUrl('3.0/products'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: mode,
                },
                data: data
            })
            // console.log('api_response',api_response);
            let api_response_data = api_response.data
            let _data: Obj = api_response_data.data
            // let _data: Obj = {}
            // Object.keys(api_response_data.data).map((product_id: string) => {
            //     _data[product_id] = {
            //         product_id: api_response_data.data[product_id]['product_id'],
            //         product: api_response_data.data[product_id]['product'],
            //         price: api_response_data.data[product_id]['price'],
            //         model: api_response_data.data[product_id]['model'],
            //         image_path: api_response_data.data[product_id]['image_path'],
            //         product_temporary_id: api_response_data.data[product_id]['product_temporary_id'],
            //         product_name: api_response_data.data[product_id]['product_name'],
            //         images: api_response_data.data[product_id]['images'],
            //         product_code: api_response_data.data[product_id]['product_code'],
            //         seller_sku: api_response_data.data[product_id]['seller_sku'],
            //         brand: api_response_data.data[product_id]['brand'],
            //         has_child_variations: api_response_data.data[product_id]['has_child_variations'],
            //     }
            // })
            api_response_data.search.category_id = api_response_data?.search?.cid
            api_response_data.search.brand_id = api_response_data?.search?.variant_id
            res.json({
                data: _data,
                search: api_response_data.search
            })
        }
    } catch (error: any) {
        res.json(error)
    }
}
