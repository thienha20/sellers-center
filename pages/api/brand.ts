import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../utils/url";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../utils/iron-auth/session";

export default withIronSessionApiRoute(brandRoute, sessionOptions);

async function brandRoute(req: NextApiRequest, res: NextApiResponse) {
    const {ids, id} = req.body
    const {needMap} = req.query
    try {
        if (req.session.user) {
            const data = {
                // 'category_id': undefined,
                // 'category_ids': undefined
            }
            // if (id) {
            //     data.category_id = id
            // }
            // if (ids) {
            //     data.category_ids = ids
            // }
            // console.log(data)
            const api_response = await axios.get(fnApiUrl('3.0/brands'), {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                },
                params: {
                    // mode: 'list',
                },
                data: data
            })

            if(needMap){
                //Mapping data ready to use for Select-2
                const brandsMapped: Array<{[value:string]: any}> = []
                Object.keys(api_response.data.data).map(b => {
                    brandsMapped.push( { 'value' : b , "label" : api_response.data.data[b].variant})
                })
                res.json({'data': brandsMapped , 'search': {...api_response.data.search} })

            } else {
                let api_response_data = api_response.data
                // console.log(api_response_data)
                res.json(api_response_data)
            }
        }
    } catch (error: any) {
        // console.log(error)
        res.status(error.response.status).json(error.response.data);
    }
}
