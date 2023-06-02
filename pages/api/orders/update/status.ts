import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../../utils/url";

export default withIronSessionApiRoute(statusRoute, sessionOptions);

async function statusRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({ message: "Access denied" });
    }
    const {order_id, status, notify_user, lang_code, cancel_note, cancel_reason_id} = req.body
    try {
        if (req.session.user) {
            const api_response = await axios.put(fnApiUrl(`3.0/orders/${order_id}`), {
                status: status ?? undefined,
                notify_user: notify_user ?? undefined,
                cancel_reason_id: cancel_reason_id ?? undefined,
                cancel_note: cancel_note ?? undefined,
                lang_code: lang_code ?? 'vi'
            }, {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                }
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}



