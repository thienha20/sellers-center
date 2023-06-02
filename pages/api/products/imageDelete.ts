import {NextApiRequest, NextApiResponse} from "next"
import axios from "axios"
import {fnApiUrl} from "../../../utils/url"
import {withIronSessionApiRoute} from "iron-session/next"
import {sessionOptions} from "../../../utils/iron-auth/session"
// @ts-ignore
import formidable from 'formidable'

export default withIronSessionApiRoute(productsImageDeleteHandler, sessionOptions);

async function productsImageDeleteHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"});
    }
    try {
        if (req.session.user) {
            const userData = req.session.user
            // console.log(req.body)

            axios.post(fnApiUrl("3.0/products?mode=product_image_delete"),
                req.body, {
                    headers: {
                        "content-type": "application/json",
                        "Authorization": "Basic " + process.env.TOKEN,
                        "x-api-key": userData.userData.api_key
                    }
                })
                .then((result: any) => {
                    // console.log('ok')
                    // console.log('ok', result.data)
                    res.json({
                        status: 'success',
                    })

                })
                .catch((err: any) => {
                    // console.log('err', err.response)
                    res.json({
                        status: 'error'
                    })
                })
        }
    } catch (error: any) {
        res.end()
    }
}
