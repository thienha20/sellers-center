import {NextApiRequest, NextApiResponse} from "next"
import axios from "axios"
import {fnApiUrl} from "../../../utils/url"
import {withIronSessionApiRoute} from "iron-session/next"
import {sessionOptions} from "../../../utils/iron-auth/session"
import FormData from "form-data"
import fs from "fs"
// @ts-ignore
import formidable from 'formidable'

export const config = {
    api: {
        bodyParser: false, // Do not use body parser for formidable, set to true by default which parses request bodies
    }
}

export default withIronSessionApiRoute(productsImageUploadHandler, sessionOptions)

async function productsImageUploadHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(403).json({message: "Access denied"})
    }
    try {
        if (req.session.user) {
            const userData = req.session.user
            const form = new formidable.IncomingForm({
                multiples: true,
                uploadDir: 'public/upload/',
                keepExtensions: true,
            })
            await form.parse(req, async (err: any, fields: any, files: any) => {
                // console.log(err, fields, files)
                let formData = new FormData()
                let filePathList: string[] = []
                if (fields && fields['product_images']) {
                    for (const field of fields['product_images']) {
                        for (const indexAndfileName of Object.keys(field)) {
                            // console.log(indexAndfileName)
                            let indexAndName = indexAndfileName.split('.')
                            const index = indexAndName[0]
                            let fileName = indexAndName.shift()
                            fileName = indexAndName.join('.')
                            formData.append(`product_images[${index}][${fileName}]`, field[indexAndfileName])
                        }
                    }
                }
                if (files) {
                    for (const index of Object.keys(files)) {
                        let generated_name = files[index]['newFilename'].split(".");
                        (generated_name.pop())
                        generated_name = generated_name.join('.')

                        let filePath = files[index]['filepath'].split("\\")
                        filePath[filePath.length - 1] = generated_name + '-' + files[index]['originalFilename']

                        await fs.renameSync(files[index]['filepath'], filePath.join('\\'))
                        filePath = filePath.join('\\')

                        let file = await fs.createReadStream(filePath)
                        formData.append(index, file)

                        filePathList = [...filePathList, filePath]
                    }
                }
                formData.append('0', '0')

                axios.post(fnApiUrl("3.0/products?mode=product_image_upload"), formData, {
                    headers: {
                        "Authorization": "Basic " + process.env.TOKEN,
                        "x-api-key": userData.userData.api_key,
                        ...formData.getHeaders()
                    }
                }).then((result: any) => {
                    remove_tmp_file(filePathList)
                    // console.log('ok')
                    // console.log('ok', result.data)
                    res.json({
                        status: 'success',
                        dir: result.data.dir,
                        images: result.data.images
                    })

                }).catch((err: any) => {
                    remove_tmp_file(filePathList)
                    // console.log('err', err.response)
                    res.json({
                        status: 'error'
                    })
                })
            })
        } else {
            res.end()
        }
    } catch (error: any) {
        res.end()
    }
}

const remove_tmp_file = (filePathList: string[]) => {
    try {
        for (const path of filePathList) {
            fs.unlinkSync(path)
        }
    } catch (e) {

    }
}
