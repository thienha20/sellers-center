import {NextApiRequest, NextApiResponse} from "next";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../utils/iron-auth/session";
import axios from "axios";
import {fnApiUrl} from "../../../utils/url";

export default withIronSessionApiRoute(productsDeleteHandler, sessionOptions);

async function productsDeleteHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"});
    }
    try {
        if (req.session.user && Object.keys(req.body).length > 0) {
            // console.log(req.body)

            // Assign user ID to request
            // req.body.user_id = req.session.user.userData.user_id
            // req.body.company_id = req.session.user.userData.company_id
            //
            // if (req.body.variation_groups.length > 0) {
            //     req.body.sku = ''
            //     req.body.price = ''
            //     req.body.amount = ''
            //     req.body.list_price = ''
            // }
            // console.log(req.body)
            axios.post(fnApiUrl("3.0/products"), {
                    "product_temporary_id" : req.body.id
                },
                {
                    headers: {
                        "content-type": "application/json",
                        "Authorization": "Basic " + process.env.TOKEN,
                        "x-api-key": req.session.user.userData.api_key
                    },
                    params: {
                        mode: 'delete_product_temporary',
                    },
                })
                .then(response => {
                    console.log(response.data)
                })
                .catch(error => console.log(error))
            res.end()
        } else
            res.end()

    } catch (error: any) {
        // console.log(error)
        res.end()
    }
}
