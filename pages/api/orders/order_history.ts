import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

export default withIronSessionApiRoute(orderHistoryRoute, sessionOptions);

async function orderHistoryRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({ message: "Access denied" });
    }
    const { order_nr } = await req.body;

    try {
        if (req.session.user) {

            const api_response = await axios.get(fnApiUrl('3.0/orders'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'order_history',
                },
                data: {
                    order_nr: order_nr ?? undefined
                }
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
