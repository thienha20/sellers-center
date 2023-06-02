import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import {Obj} from "../../../utils/types";

export default withIronSessionApiRoute(ordersRoute, sessionOptions);

async function ordersRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"});
    }
    const {
        order_id,
        order_nr,
        search_phone,
        search_email,
        status,
        payment_ids,
        search_customer_name,
        items_per_page,
        page,
        lang_code,
        date_from,
        date_to,
        order_status,
        sort_by,
        sort_order,
        order_type
    } = await req.body;

    try {
        if (req.session.user) {

            const api_response = await axios.get(fnApiUrl('3.0/orders'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'list',
                },
                data: {
                    order_id: order_id ?? undefined,
                    order_nr: order_nr ?? undefined,
                    search_customer_name: search_customer_name ?? undefined,
                    search_phone: search_phone ?? undefined,
                    email: search_email ?? undefined,
                    status: status ?? undefined,
                    order_status: order_status ?? undefined,
                    payment_ids: payment_ids ?? undefined,
                    date_from: date_from ?? undefined,
                    date_to: date_to ?? undefined,
                    items_per_page: items_per_page ?? undefined,
                    sort_by: sort_by ?? undefined,
                    sort_order: sort_order ?? undefined,
                    page: page ?? 1,
                    lang_code: lang_code ?? 'vi',
                    order_type: order_type ?? 'C'
                }
            })
            let api_response_data = api_response.data
            if (api_response_data.data) {
                //loc lai cac cot cho phep lay ra
                let columns: string[] = ["firstname", "lastname", "order_nr", "order_id", "payment", "payment_id", "payment_status", "total", "status", "timestamp"]
                let result: Obj[] = []
                let elm: Obj
                for (elm of api_response_data.data) {
                    let tam: Obj = {}
                    let keys: string[] = Object.keys(elm)
                    for (let k of keys) {
                        if (columns.includes(k)) {
                            tam[k] = elm[k]
                        }
                    }
                    result.push(tam)
                }
                api_response_data.data = result
            }
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
