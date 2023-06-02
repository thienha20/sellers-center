import {FC, useMemo} from 'react'
import Link from "next/link"
import Image from 'next/image'
import {useRouter} from "next/router"
import {useDispatch, useSelector} from "react-redux";
import {fnCurrentApiUrl, toAbsoluteUrl} from "../../../../utils/url";
import {ReducerInterFace} from "../../../../redux/reducers";
import axios from "axios";
import {useIntl} from "react-intl";
import allActions from '../../../../redux/actions/index'
import CryptoJS from "crypto-js";
import {WhiteListPermission} from "../../../../utils/permission";
import {useLang} from "../../../i18n/Metronici18n";

const HeaderUserMenu: FC = () => {
    const intl = useIntl()
    const lang: string = useLang() ?? "vi"
    const Router = useRouter()
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const dispatch = useDispatch()
    const logout = async () => {
        await axios.post(fnCurrentApiUrl("/api/logout")).then(() => {
            dispatch(allActions.auth.logOut())
            Router.push("/login")
        })
    }
    const permission: string[] | null | undefined = useMemo<string[] | undefined | null>(() => {
        if (user?.permission) {
            let per: string = CryptoJS.AES.decrypt(user.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(per)
        }
    }, [user?.permission])

    return (
        <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
            data-kt-menu='true'
        >
            <div className='menu-item px-3'>
                <div className='menu-content d-flex align-items-center px-3'>
                    <div className='symbol symbol-50px me-5 position-relative'>
                        <Image alt='Logo' src={toAbsoluteUrl("/media/icons/duotune/general/gen026.svg")} width={50} height={50}/>
                    </div>

                    <div className='d-flex flex-column'>
                        <div className='fw-bolder d-flex align-items-center fs-5'>
                            {lang === "vi" ? `${user?.firstname} ${user?.lastname}`: `${user?.lastname} ${user?.firstname}`}
                        </div>
                        {!permission || permission?.includes("/users/profile") || WhiteListPermission.includes("/users/profile") ?
                            <Link href={`/users/profile`}>
                                <a className='fw-bold text-muted text-hover-primary fs-7'>
                                    {user?.email}
                                </a>
                            </Link> : <span className='fw-bold text-muted text-hover-primary fs-7'>
                                {user?.email}
                            </span>}
                    </div>
                </div>
            </div>

            {!permission || permission?.includes("/users/profile") || WhiteListPermission.includes("/users/profile") ?
                <>
                    <div className='separator my-2'></div>
                    <div className='menu-item px-5'>
                        <Link href={`/users/profile`}>
                            <a className='menu-link px-5'>
                                {intl.formatMessage({id: 'AUTH.GENERAL.PROFILE'})}
                            </a>
                        </Link>
                    </div>
                </> : null}

            {!permission || permission?.includes("/companies") || WhiteListPermission.includes("/companies") ?
                <>
                    <div className='separator my-2'></div>
                    <div className='menu-item px-5'>
                        <Link href={`/companies`}>
                            <a className='menu-link px-5'>
                                {intl.formatMessage({id: 'AUTH.GENERAL.COMPANY_PROFILE'})}
                            </a>
                        </Link>
                    </div>
                </> : null}

            <div className='separator my-2'></div>
            <div className='menu-item px-5'>
                <span className='menu-link px-5 cursor-pointer' onClick={() => logout()}>
                    {intl.formatMessage({id: 'AUTH.LOGOUT.BUTTON'})}
                </span>
            </div>
        </div>
    )
}

export {HeaderUserMenu}
