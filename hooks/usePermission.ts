import {useEffect,useMemo} from "react"
import {useRouter} from 'next/router'
import {useSelector} from "react-redux"
import _ from "lodash"
import {ReducerInterFace} from "../redux/reducers"
import {WhiteListPermission} from "../utils/permission"
import {UserData} from "../redux/reducers/authReducer"
import CryptoJS from "crypto-js"

export default function usePermission() {
    const router = useRouter()
    let user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const permission: string[] | null | undefined = useMemo<string[] | null | undefined>(() => {
        if (user?.permission) {
            let per: string = CryptoJS.AES.decrypt(user.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(per)
        }
    }, [user?.permission])

    useEffect(() => {
        const checkPermission = async (userData: UserData | null) => {
            // console.log(router.asPath)
            // console.log(router.basePath)
            // console.log(router.pathname)
            if (userData && permission && permission.length > 0) {
                let bol: boolean = false
                if (WhiteListPermission.includes(router.pathname)) {
                    bol = true
                } else {
                    for (let elm of permission) {
                        if (router.pathname === elm) {
                            bol = true
                            break
                        }
                    }
                }

                if (!bol) {
                    await router.push("/404")
                }
            }
        }
        if (user) {
            checkPermission(user).then(r => true)
        }
    }, [user, router, permission])

}
