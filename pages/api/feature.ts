import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../utils/url";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../utils/iron-auth/session";

export default withIronSessionApiRoute(featureByCateRoute, sessionOptions);

async function featureByCateRoute(req: NextApiRequest, res: NextApiResponse) {
    const {ids, id,variants, status} = req.body
    try {
        if (req.session.user) {
            const data = {
                'category_id': undefined,
                'category_ids': undefined,
                'variants': true,
                'status': 'A'
            }
            if (id) {
                data.category_id = id
            }
            if (ids) {
                data.category_ids = ids
            }
            if (variants) {
                data.variants = variants
            }
            if (status) {
                data.status = status
            }
            // console.log(data)
            const api_response = await axios.get(fnApiUrl('3.0/features'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    mode: 'list',
                },
                data: data
            })
            let api_response_data = api_response.data
            // console.log(api_response_data)
            res.json(api_response_data)
        }
    } catch (error: any) {
        // console.log(error)
        res.status(error.response.status).json(error.response.data);
    }
}
