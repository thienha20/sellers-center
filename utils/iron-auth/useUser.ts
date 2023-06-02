import {useCallback, useEffect} from "react"
import {useRouter} from 'next/router'
import {User} from "../../pages/api/me"
import axios from "axios"
import {useDispatch} from "react-redux"
import allActions from '../../redux/actions/index'
import _ from "lodash"
import {fnCurrentApiUrl} from "../url"
import CryptoJS from "crypto-js"
import {WhiteListPermission} from "../permission"

type params = {
    redirectTo: string
    login: boolean
    setLoading?: (bol: boolean) => void
    setPermission?: (bol: boolean) => void
}

export default function useUser({
                                    redirectTo = "",
                                    login = false,
                                    setLoading,
                                    setPermission
                                }: params) {
    const Router = useRouter()
    const dispatch = useDispatch()
    const checkPermission = useCallback((permission: string) => {
        try{
            let per:string = CryptoJS.AES.decrypt(permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(per)
        }catch (e){
            return false
        }
    }, [])
    useEffect(() => {
        let user: User | null = null
        const getUser = async () => await axios.get(fnCurrentApiUrl("/api/me")).then(rs => {
            if (!_.isEmpty(rs.data?.userData)) {
                user = rs.data
            }
        })
        getUser().then(() => {
            if (setLoading) {
                setLoading(false)
            }
            if (!user) {
                dispatch(allActions.auth.logOut())
            } else {
                dispatch(allActions.auth.logIn(user))
            }
            if ((!login && !user) || (login && user)) {
                return Router.push(redirectTo)
            }
            if (user?.userData?.permission) {
                let permission: string = checkPermission(user?.userData?.permission)
                if (permission && permission.length > 0) {
                    let bol: boolean = false
                    if (WhiteListPermission.includes(Router.pathname)) {
                        bol = true
                    } else {
                        for (let elm of permission) {
                            if (Router.pathname === elm) {
                                bol = true
                                break
                            }
                        }
                    }
                    if (setPermission) {
                        setPermission(bol)
                    }
                    if (!bol) {
                        if(Router.pathname === "/"){
                            return Router.push("/companies")
                        }
                        return Router.push("/404")
                    }
                }
            }else{
                if (setPermission) {
                    setPermission(true)
                }
            }
        })
    }, [login, redirectTo])
}
