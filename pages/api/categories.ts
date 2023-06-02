import {withIronSessionApiRoute} from "iron-session/next"
import {sessionOptions} from "../../utils/iron-auth/session"
import {NextApiRequest, NextApiResponse} from "next"
import axios from "axios"
import {fnApiUrl} from "../../utils/url"

export default withIronSessionApiRoute(categoriesRoute, sessionOptions)

async function categoriesRoute(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"})
    }

    const {lang_code} = await req.body

    try {
        if (req.session.user) {

            const api_response = await axios.get(fnApiUrl('3.0/categories'), {
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
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data)
    }
}
