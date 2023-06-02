/** @type {import("next").NextConfig} */
const withImages = require("next-images")
const path = require("path")
const fs = require("fs")
require('dotenv').config()
const securityHeaders = [
    {
        key: "X-DNS-Prefetch-Control",
        value: "on"
    },
    {
        key: "X-Content-Type-Options",
        value: "nosniff",
    },
    {
        key: "X-Frame-Options",
        value: "ALLOW-FROM https://*.tatmart.com",
    },
    {
        key: "X-XSS-Protection",
        value: "1; mode=block",
    }
]
module.exports = {
    env: {
        CRYPTO:"TsellerACENTERT123",
        TINYMCE: "8kshnjzw3rnx26qbnunafhq31p3alzapv141flxt07j50hrq",
        PUBLIC_URL: process.env.PUBLIC_URL ?? "http://localhost:3000",
        JQUERY: fs.readFileSync('public/js/jquery/jquery.min.js').toString(),
        JQUERYUI: fs.readFileSync('public/js/jquery-ui/jquery-ui.min.js').toString(),
        ELFINDER: fs.readFileSync('public/js/elfinder/js/elfinder.min.js').toString(),
        API_DOMAIN: process.env.API_DOMAIN ?? "https://staging.tatmart.com",
        ES_PRODUCTS: (process.env.ES_PRODUCTS === 'true') ?? false
    },
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "assets/styles")],
    },
    generateBuildId: async () => {
        let current = new Date()
        let year = current.getFullYear()
        let month = current.getMonth() + 1
        let day = current.getDate()
        let hour = current.getHours()
        let minute = current.getMinutes()
        return `${year}-${month}-${day}_${hour}_${minute}`
    },
    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: "/(.*)",
                headers: securityHeaders,
            },
        ]
    },
    images: {
        domains: ['localhost', 'www.tatmart.com', 'www.mrtho.vn', "dev.tatmart.vn", "*.tatmart.com"],
    },
    ...withImages({
        webpack(config, options) {
            return config
        }
    })
}
