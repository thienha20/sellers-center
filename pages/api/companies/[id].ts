import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

export default withIronSessionApiRoute(companyDetailRoute, sessionOptions);

async function companyDetailRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        if (req.session.user) {
            const {lang_code} = req.body
            const api_response = await axios.get(fnApiUrl('3.0/vendors/' + req.session.user.userData.company_id), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                data: {
                    lang_code: lang_code ?? 'vi'
                }
            })
            let api_response_data = api_response.data
            if(api_response_data){
                delete api_response_data.api_key
                delete api_response_data.api_secret_key
            }
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
