import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

export default withIronSessionApiRoute(sellThisRoute, sessionOptions);

async function sellThisRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({ message: "Access denied" });
    }
    const {product_ids, user_id} = req.body
    try {
        if (req.session.user) {
            const api_response = await axios.post(fnApiUrl(`3.0/products`), {
                product_ids: product_ids ?? 0,
                user_id: user_id ?? 0
            }, {
                params:{
                   mode: 'sell_this'
                },
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



