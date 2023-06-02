import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

export default withIronSessionApiRoute(createRoute, sessionOptions);

async function createRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({ message: "Access denied" });
    }
    const { input_name, input_email, input_password, group_id } = req.body
    try {
        if (req.session.user) {
            const api_response = await axios.post(fnApiUrl(`3.0/users`), {
                name: input_name ?? '',
                email: input_email ?? '',
                password: input_password ?? '',
                permission_group: group_id ?? [],
            }, {
                params: {
                    mode: 'create_user'
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



