import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";
import {fnFirstLast} from "../../../utils/fullName";
import {User} from "../me";

export default withIronSessionApiRoute(ProfileRoute, sessionOptions);

async function ProfileRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST" || !req.session.user) {
        return res.status(403).json({message: "Access denied"});
    }
    const {
        phone = req.session.user.userData.phone,
        name = null,
        lang = "vi",
        email = req.session.user.userData.email,
        emailOldCode = null,
        emailNewCode = null,
        phoneOldCode = null,
        phoneNewCode = null,
        passwordOld = null,
        password1 = null,
        password2 = null
    } = req.body
    try {
        if (req.session.user) {
            //change email
            if (emailOldCode && emailNewCode) {
                //có expired time cần thì có thể check thêm
                if (emailNewCode != req.session.changeInfo.emailNewCode && emailOldCode != req.session.changeInfo.emailOldCode) {
                    return res.status(500).json({message: "Error code"});
                }
            }
            //change phone
            if (phoneOldCode && phoneNewCode) {
                if (phoneNewCode != req.session.changeInfo.phoneNewCode && phoneOldCode != req.session.changeInfo.phoneOldCode) {
                    return res.status(500).json({message: "Error code"});
                }
            }
            //change password
            if (password1 && password2 && passwordOld) {
                if (password1 != password2 || password1.length < 6) {
                    return res.status(500).json({message: "Error code"});
                }
            }
            let newData: User = {
                userData: {
                    phone,
                    email,
                    company_id: req.session.user.userData.company_id,
                    password1,
                    password2,
                    passwordOld
                },
                ...fnFirstLast(name, lang)
            }
            //console.log(newData.userData)
            await axios.put(fnApiUrl(`3.0/users/${req.session.user.userData.user_id}`), newData.userData, {
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Basic " + process.env.TOKEN,
                    "x-api-key": req.session.user.userData.api_key
                }
            }).then(async (rs: any) => {
                let api_response_data = rs.data
                req.session.user = {
                    userData: {...req.session?.user?.userData, ...newData.userData}
                }
                await req.session.save()
                res.json(api_response_data)
            }).catch(reason => {
                if (reason.response.status === 401 && passwordOld) {
                    return res.status(401).json("error_oldPassword");
                }
            })


        }
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
