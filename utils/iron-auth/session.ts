// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session"
import type { User } from "../../pages/api/me"

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD ?? "c1d50c8d1a0d61962d9b4556607986ab",
  cookieName: "sig_tat_id",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User
    changeInfo: {
      emailOldCode?: string
      emailNewCode?: string
      phoneOldCode?: string
      phoneNewCode?: string
    }
  }
}
