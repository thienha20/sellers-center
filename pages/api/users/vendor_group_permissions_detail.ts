import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import {Obj} from "../../../utils/types";

export default withIronSessionApiRoute(vendorGroupPermissionsRoute, sessionOptions);

async function vendorGroupPermissionsRoute(req: NextApiRequest, res: NextApiResponse<Obj>) {

    const {group_id} = await req.body;
    try {
        if (req.session.user) {

            const api_response = await axios.get(fnApiUrl('3.0/vendors'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'vendor_group_permissions_detail',
                },
                data: {
                    group_id: group_id ?? undefined,
                    company_id: req.session.user.userData.company_id,
                }
            })
            let api_response_data = api_response.data
            api_response_data.rules ?
                api_response_data.rules = JSON.parse(api_response_data.rules) : []
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.json({})
    }
}
