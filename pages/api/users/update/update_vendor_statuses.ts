import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../../utils/url";

export default withIronSessionApiRoute(updateVendorStatusesRoute, sessionOptions);

async function updateVendorStatusesRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({ message: "Access denied" });
    }
    const { vendor_status, user_id } = req.body
    try {
        if (req.session.user) {
            const api_response = await axios.post(fnApiUrl(`3.0/users`), {
                user_id: user_id,
                vendor_status: vendor_status ?? "A",
            }, {
                params: {
                    mode: 'update_vendor_statuses'
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



