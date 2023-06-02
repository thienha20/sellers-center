import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../utils/url";

type User = {
    userData: any
};

export default withIronSessionApiRoute(paymentsRoute, sessionOptions);

async function paymentsRoute(req: NextApiRequest, res: NextApiResponse<User>) {

    const {page, q} = await req.body;
    try {
        if (req.session.user) {

            const api_response = await axios.get(fnApiUrl('3.0/payments'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
