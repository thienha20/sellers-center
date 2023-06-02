import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";

export type User = {
    userData: any
};

export default withIronSessionApiRoute(meRoute, sessionOptions);

function meRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    if (req.session.user) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        res.json({
            ...req.session.user
        });
    } else {
        res.json({
            userData: {}
        });
    }
}
