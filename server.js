const express = require("express")
const next = require("next")
// const cors = require("cors")
const {getIronSession} = require("iron-session")

const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD ?? "c1d50c8d1a0d61962d9b4556607986ab",
    cookieName: "sig_tat_id",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production"
    }
}

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = process.env.PORT || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({dev, hostname, port})
// const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    // server.use(cors({credentials: true, origin: process.env.API_DOMAIN ?? "https://staging.tatmart.com"}))
    server.get("/tk-sso", (req, res) => {
        //dung cho hub login câp cookie
        // res.cookie()
        // sessionData = await getIronSession(req, res, sessionOptions) session check
        return res.json({
            "status": 200
        })
    })

    server.all("*", async (req, res) => {
        // const allowPath = ["/", "/404", "/500", "/login", "/logout", "/media/",
        //     "/_next/", "/css/", "/js/", "/__nextjs", "/favicon.ico"]
        // let bol = false
        // for (let item of allowPath) {
        //     if (req.path.indexOf(item) === 0) {
        //         bol = true
        //         break
        //     }
        // }
        if (req.path.indexOf("/api") === 0) {
            const arrPathAllow = ["/api/me", "/api/login"]
            if(!arrPathAllow.includes(req.path)) {
                let sessionData = await getIronSession(req, res, sessionOptions)
                if (!sessionData?.user) {
                    // kiem tra neu call api ma user empty là error
                    return res.status(403).json({message: "Access denied"})
                }
            }
        }

        return handle(req, res)
    })

    server.listen(process.env.PORT, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${process.env.PORT}`)
    })
})