import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";

export default withIronSessionApiRoute(featureIdHandler, sessionOptions);

async function featureIdHandler(req: NextApiRequest, res: NextApiResponse) {
    const {
        feature_id
    } = req.query;
    try {
        if (req.session.user) {
            const api_domain = process.env.API_DOMAIN
            const api_response = await axios.get(`${api_domain}/api/features/${feature_id}`, {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                }
            })
            let api_response_data = api_response.data
            const variantsMapped: Array<{[value:string]: any}> = []
            Object.keys(api_response.data.data).map(v => {
                variantsMapped.push( { 'value' : v , "label" : api_response_data.data[v].variant})
            })
            res.json({'data': variantsMapped , 'search': {...api_response.data.search} })

        }
    } catch (error: any) {
        console.log(error)
        res.status(error.response.status).json(error.response.data);
        // res.end()
    }
}
