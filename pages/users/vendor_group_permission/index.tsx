import axios from "axios"
import Head from 'next/head'
import {useIntl} from "react-intl"
import {useRouter} from "next/router"
import {NextPageWithLayout} from "../../../utils/types"
import {useLang} from '../../../components/i18n/Metronici18n'
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../../utils/url"
import {MasterLayout} from "../../../components/layout/MasterLayout"
import {Pagination} from "../../../components/paginations/Pagination"
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from "react"
import {usePageData} from "../../../components/layout/core"
import Link from 'next/link'
import {TabList} from "../../../components/tabs/tabList"
import {UserVendorPermissionsTable} from "../../../components/tables/userVendorPermissionsTable"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../../redux/reducers"
import CryptoJS from "crypto-js"
import {checkRouterPermission} from "../../../utils/permission"

type params = {
    items_per_page?: number | null | undefined | string[] | string,
    total_items?: number | null | undefined | string[] | string,
    search_email?: string | null | undefined | string[],
    search_phone?: string | null | undefined | string[],
    search_name?: string | null | string[] | undefined,
    page?: number | null | undefined | string[] | string,
    search_query?: string | null | undefined | string[],
    lang_code?: string | null | undefined | string[],
    tab?: string | null | undefined,
}

const default_item_per_page = 10
const default_page = 1

const Index: NextPageWithLayout = () => {
    const intl = useIntl()

    const [userManagePermission, setUserManagePermission] = useState<boolean>(false)
    const [vendorGroupPermission, setVendorGroupPermission] = useState<boolean>(false)
    const [createVendorGroupPermission, setCreateVendorGroupPermission] = useState<boolean>(false)
    const [updateVendorGroupPermission, setUpdateVendorGroupPermission] = useState<boolean>(false)
    const [viewVendorGroupPermission, setViewVendorGroupPermission] = useState<boolean>(false)

    let user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    let userPermission = useMemo(() => {
        try {
            if (user && (user.permission === null || user.permission === "")) return null
            let rs = CryptoJS.AES.decrypt(user.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(rs)
        } catch (e) {
            return false
        }
    }, [user])
    useEffect(() => {
        setUserManagePermission(checkRouterPermission("/users", userPermission))
        setVendorGroupPermission(checkRouterPermission("/users/vendor_group_permission", userPermission))
        setCreateVendorGroupPermission(checkRouterPermission("/users/vendor_group_permission/create", userPermission))
        setUpdateVendorGroupPermission(checkRouterPermission("/users/vendor_group_permission/edit/[id]", userPermission))
        setViewVendorGroupPermission(checkRouterPermission("/users/vendor_group_permission/[id]", userPermission))
    }, [userPermission])

    const router = useRouter()
    const lang: string = useLang() ?? "vi"
    const defaultParams: params = useMemo(() => {
        let obj: params = {}
        return obj
    }, [lang])

    const [totalItems, setTotalItems] = useState<number>(0);

    const [itemsPerPage, setItemsPerPage] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [params, setParams] = useState<params>(defaultParams)
    const [permissions, setPermissions] = useState([]);
    const [loadPage, setLoadPage] = useState<boolean>(true)

    const {setPageBreadcrumbs} = usePageData()

    const tabs = [
        userManagePermission ? {value: 'manage_users', label: intl.formatMessage({id: 'USER.MANAGE_USERS'})} : {},
        vendorGroupPermission? {value: 'manage_roles', label: intl.formatMessage({id: 'USER.MANAGE_ROLES'}), active: true} : {},
    ]

    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "USER.MANAGE_ROLES"}),
                isActive: true
            }
        ])
    }, [])

    useEffect(() => {
        setLoadPage(true)
        if (router.isReady) {
            let {
                page,
                items_per_page,
            } = router.query

            let newParams = defaultParams
            if (page) {
                newParams.page = page
            }
            if (items_per_page) {
                newParams.items_per_page = items_per_page
            }

            const call_api = (params: params) => {
                return axios.post(fnCurrentApiUrl("/api/users/vendor_group_permissions"), {
                    page: params.page ?? 1,
                    items_per_page: params.items_per_page ?? undefined,
                    lang_code: params.lang_code,
                })
            }
            call_api(newParams)
                .then((res) => {
                    setLoadPage(false)
                    setParams(newParams)
                    setPermissions(res.data.data)
                    setTotalItems(Number(res.data.search.total_items))
                    setItemsPerPage(res.data.search.items_per_page ?? default_item_per_page)
                    setCurrentPage(res.data.search.page ?? default_page)
                })

        }
    }, [router.isReady, router.query])
    

    // Handle phân trang
    const handleChangePage = (page_number: number, items_per_page: number) => {
        const _params = {...params}
        page_number ? _params.page = page_number : undefined
        items_per_page ? _params.items_per_page = items_per_page : undefined
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('users/vendor_group_permission', _params))
    }

    //Handle search
    const handleSearch = (search_params: any) => {
        let _params = {...params, ...search_params}
        _params.page = +1
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('users/vendor_group_permission', _params))
    }

    // Handle Status tab
    const handleStatusTab = (tab: string) => {
        if(tab == 'manage_users'){
            router.push(fnUrlQueryBuilder('users', {}))
        }
    }

    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'USER.MANAGE_ROLES'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'USER.MANAGE_ROLES'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <TabList defaultStatus={(params?.tab)?params?.tab: 'manage_roles' } handleTab={handleStatusTab} options={tabs} tabAll={false}/>

            <div className={"card"}>
                <div className="">
                    <div className="card card-flush">
                        <div className="card-header border-0 pt-5">
                            <h3 className="card-title align-items-start flex-column">
                                <span
                                    className="card-label fw-bolder fs-3 mb-1">{intl.formatMessage({id: 'USER.VENDOR_PERMISSION_LIST'})}</span>

                            </h3>
                            <div className="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top"
                                 data-bs-trigger="hover" title="Click to add a user">
                                {createVendorGroupPermission && ( <Link href="/users/vendor_group_permission/create">
                                    <a className="btn btn-sm btn-light-primary"><span
                                        className="svg-icon svg-icon-3"></span>{intl.formatMessage({id: 'USER.PERMISSION_ADD'})}
                                    </a>
                                </Link>)}
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            <UserVendorPermissionsTable permissions={permissions}
                                                        loading={loadPage}
                                                        permissionParams={params}
                                                        allowViewDetail={viewVendorGroupPermission}
                                                        allowUpdate={updateVendorGroupPermission}
                            />
                            <Pagination total_items={Number(totalItems)} current_page={Number(currentPage)}
                                        items_per_page={Number(itemsPerPage)}
                                        onChangePage={(page: number, items_per_page: number) => {
                                            handleChangePage(page, items_per_page)
                                        }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
