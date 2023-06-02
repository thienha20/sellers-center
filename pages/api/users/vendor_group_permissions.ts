import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

type User = {
    userData: any
};

export default withIronSessionApiRoute(vendorGroupPermissionsRoute, sessionOptions);

async function vendorGroupPermissionsRoute(req: NextApiRequest, res: NextApiResponse<User>) {

    const { page, items_per_page, status, group_id, company_id } = await req.body;
    try {
        if (req.session.user) {

            const api_response = await axios.get(fnApiUrl('3.0/vendors'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'list_vendor_group_permissions',
                },
                data: {
                    status: status ?? undefined,
                    page: page ?? undefined,
                    items_per_page: items_per_page ?? undefined,
                    group_id: group_id ?? undefined,
                    company_id: req.session.user.userData.company_id,
                }
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
