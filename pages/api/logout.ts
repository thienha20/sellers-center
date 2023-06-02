import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../utils/iron-auth/session";
import {NextApiRequest, NextApiResponse} from "next";
import type {User} from "./me";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({ userData: {} });
}
