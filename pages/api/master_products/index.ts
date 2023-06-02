import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";

export default withIronSessionApiRoute(masterProductsRoute, sessionOptions);

async function masterProductsRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"});
    }

    const {
        product_id,
        search_query,
        product_code,
        seller_skus,
        sell_this,
        price_from,
        price_to,
        category_id,
        brand_id,
        items_per_page,
        page,
        lang_code,
        sort_by,
        sort_order
    } = await req.body;

    try {
        if (req.session.user) {
            const api_response = await axios.get(fnApiUrl('3.0/products'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'list',
                },
                data: {
                    product_id: product_id ?? undefined,
                    search_query: search_query ?? undefined,
                    product_code: product_code ?? undefined,
                    seller_skus: seller_skus ?? undefined,
                    items_per_page: items_per_page ?? undefined,
                    price_from: price_from ?? undefined,
                    price_to: price_to ?? undefined,
                    product_sell: sell_this?? undefined,
                    category_id: category_id?? undefined,
                    brand_id: brand_id?? undefined,
                    only_product_master:true,
                    sort_by:sort_by?? undefined,
                    sort_order:sort_order?? undefined,
                    page: page ?? 1,
                    lang_code: lang_code ?? 'vi',
                    es_search: process.env.ES_PRODUCTS ? true : ''
                }
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
