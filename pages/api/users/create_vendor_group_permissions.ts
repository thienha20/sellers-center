import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import {Obj} from "../../../utils/types";
import _ from 'lodash'

type User = {
    userData: any
};

export default withIronSessionApiRoute(createVendorGroupPermissionsRoute, sessionOptions);

async function createVendorGroupPermissionsRoute(req: NextApiRequest, res: NextApiResponse<User>) {

    const {name, rules, status,group_id} = await req.body;
    try {
        if (req.session.user) {
            let data: Obj = {
                company_id: req.session.user.userData.company_id,
                user_id: req.session.user.userData.user_id,
            }
            if (!_.isNil(group_id)) {
                data.group_id = group_id
            }
            if (!_.isNil(name)) {
                data.name = name
            }
            if (!_.isNil(rules)) {
                data.rules = JSON.stringify(rules)
            }
            if (!_.isNil(status)) {
                data.status = status
            } else {
                data.status = 'A'
            }
            const api_response = await axios.post(fnApiUrl('3.0/vendors?mode=create_vendor_group_permissions'), data, {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                }
            })
            let api_response_data = api_response.data
            // console.log(api_response_data)
            res.json(api_response_data)
        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
