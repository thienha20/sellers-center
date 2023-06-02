import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import md5 from "md5";

export default withIronSessionApiRoute(readNotificationRoute, sessionOptions);

async function readNotificationRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" || !req.session.user) {
        return res.status(403).json({message: "Access denied"});
    }
    try {
        const {notification_id} = req.body
        let code = await axios.post(fnApiUrl('3.0/notification?mode=read_notify'), {
            area: "A",
            user_id: req.session.user.userData.user_id,
            notification_id
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

        let api_response_data = code.data
        res.json(api_response_data)
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
