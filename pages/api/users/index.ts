import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/iron-auth/session";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { fnApiUrl } from "../../../utils/url";

type User = {
    userData: any
};

export default withIronSessionApiRoute(usersRoute, sessionOptions);

async function usersRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    const { page,
            items_per_page,
            lang_code,
            search_name,
            search_status,
            search_email,
            user_id,
            sort_by,
            sort_order} = await req.body;
    try {
        if (req.session.user) {
            
            const api_response = await axios.get(fnApiUrl('3.0/users'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'list',
                },
                data: {
                    items_per_page: items_per_page ?? undefined,
                    page: page ?? 1,
                    search_name: search_name ?? undefined,
                    vendor_search_status: search_status ?? undefined,
                    search_email: search_email ?? undefined,
                    user_id: user_id ?? undefined,
                    lang_code: lang_code ?? 'vi',
                    sort_by:sort_by?? undefined,
                    sort_order:sort_order?? undefined,
                    user_type: 'V'
                }
            })
            let api_response_data = api_response.data
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
