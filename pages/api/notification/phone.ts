import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import md5 from "md5";

export default withIronSessionApiRoute(phoneRoute, sessionOptions);

async function phoneRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" || !req.session.user) {
        return res.status(403).json({message: "Access denied"});
    }
    try {
        const {phone, verify = false} = req.body
        let code = await axios.post(fnApiUrl('3.0/notification?mode=send_phone_code'), {
            phone: phone ?? req.session.user.userData.phone,
            user_id: req.session.user.userData.user_id,
            check_exist: verify
        }, {
            headers: {
                "content-type": "application/json",
                "Authorization": "Basic " + process.env.TOKEN,
                "x-api-key": req.session.user.userData.api_key
            }
        })

        if(code.data === ""){
            return res.json("")
        }
        if (!verify) {
            req.session.changeInfo = {
                ...req.session.changeInfo,
                phoneOldCode: code.data.data.code
            }
        } else {
            req.session.changeInfo = {
                ...req.session.changeInfo,
                phoneNewCode: code.data.data.code
            }
        }

        await req.session.save()
        code.data.data = {...code.data.data, code: md5(code.data.data.object + code.data.data.code)}
        let api_response_data = code.data.data
        res.json(api_response_data)
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
