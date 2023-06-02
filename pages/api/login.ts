import type {User} from "./me"

import {withIronSessionApiRoute} from "iron-session/next"
import {sessionOptions} from "../../utils/iron-auth/session"
import {NextApiRequest, NextApiResponse} from "next"
import axios from "axios"
import {fnApiUrl} from "../../utils/url"
import CryptoJS from "crypto-js"

export default withIronSessionApiRoute(loginRoute, sessionOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"})
    }

    const {emailOrPhone, password, lang} = await req.body

    try {
        let url = fnApiUrl("3.0/auth")

        let api_response: any = await axios.post(url, {
            user_login: emailOrPhone,
            password,
            lang_code: lang
        }, {
            headers: {
                "content-type": "application/json",
                "Authorization": "Basic " + process.env.TOKEN
            },
            params: {
                mode: "login"
            }
        })

        let api_response_data = api_response.data.data
        const user: User = {
            userData: {
                user_id: api_response_data.user_id,
                company_id: api_response_data.company_id,
                email: api_response_data.email,
                phone: api_response_data.phone,
                firstname: api_response_data.firstname,
                lastname: api_response_data.lastname,
                vendor_root: api_response_data.vendor_permission?.vendor_root,
                permission: api_response_data.vendor_permission?.rules ? CryptoJS.AES.encrypt(JSON.stringify(api_response_data.vendor_permission?.rules), process.env.CRYPTO ?? "scTAT").toString() : null,
                api_key: api_response_data.company_data.api_key
            }
        }
        req.session.user = user
        await req.session.save()
        return res.status(api_response.status).json(user)
        //--end code call api
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data)
    }
}
