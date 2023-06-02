import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

type User = {
    userData: any
};

export default withIronSessionApiRoute(checkEmailRoute, sessionOptions);

async function checkEmailRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    const {  email } = await req.body;
    try {
        if (req.session.user) {
            
            const api_response = await axios.get(fnApiUrl('3.0/users'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'check_email',
                },
                data: {
                    email: email ?? undefined,
                }
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
