import axios from "axios"
import Head from 'next/head'
import {useIntl} from "react-intl"
import {useRouter} from "next/router"
import {NextPageWithLayout} from "../../utils/types"
import {useLang} from '../../components/i18n/Metronici18n'
import {UserTable} from '../../components/tables/userTable'
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../utils/url"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {Pagination} from "../../components/paginations/Pagination"
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from "react"
import {UserSearch} from "../../components/search/UserSearch"
import {usePageData} from "../../components/layout/core"
import Link from 'next/link'
import {TabList} from "../../components/tabs/tabList"
import _ from "lodash"
import {ReducerInterFace} from "../../redux/reducers"
import {useSelector} from "react-redux"
import {checkRouterPermission} from "../../utils/permission"
import CryptoJS from "crypto-js"
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {isMobileDevice} from "../../utils/metronic/_utils";

type userParams = {
    items_per_page?: number | null | undefined | string[] | string,
    total_items?: number | null | undefined | string[] | string,
    search_email?: string | null | undefined | string[],
    search_status?: string | null | undefined | string[],
    search_name?: string | null | string[] | undefined,
    page?: number | null | undefined | string[] | string,
    search_query?: string | null | undefined | string[],
    lang_code?: string | null | undefined | string[],
    sort_by?: string | null | undefined | string[],
    sort_order?: string | null | undefined | string[],
    tab?: string | null | undefined,
}

const default_item_per_page = 10

const Index: NextPageWithLayout = () => {
    const intl = useIntl()
    const router = useRouter()
    const lang: string = useLang() ?? "vi"
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const defaultParams: userParams = useMemo(() => {
        let obj: userParams = {
            page: +1,
            items_per_page: +10,
            lang_code: lang
        }
        return obj
    }, [lang])

    const [userManagePermission, setUserManagePermission] = useState<boolean>(false)
    const [vendorGroupPermission, setVendorGroupPermission] = useState<boolean>(false)

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
    }, [userPermission])


    const [totalItems, setTotalItems] = useState<number>(0)

    const [itemsPerPage, setItemsPerPage] = useState<number>(default_item_per_page)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [params, setParams] = useState<userParams>(defaultParams)
    const [users, setUsers] = useState([])
    const [loadPage, setLoadPage] = useState<boolean>(true)
    const userLogin = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const [vendorRoot, setVendorRoot] = useState<boolean>(true)
    const {setPageBreadcrumbs} = usePageData()

    const tabs = [
        userManagePermission ? {
            value: 'manage_users',
            label: intl.formatMessage({id: 'USER.MANAGE_USERS'}),
            active: true
        } : {},
        vendorGroupPermission ? {value: 'manage_roles', label: intl.formatMessage({id: 'USER.MANAGE_ROLES'})} : {},
    ]
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "USERS.USER_LIST"}),
                isActive: true
            }
        ])
    }, [])

    useEffect(() => {
        if (!_.isEmpty(userLogin)) {
            if (userLogin.vendor_root == 'Y' || (userLogin.vendor_root == 'N' && _.isEmpty(userLogin.permission))) {
                setVendorRoot(false)
            } else {
                setVendorRoot(true)
            }
        } else {
            setVendorRoot(true)
        }
    }, [])

    useEffect(() => {
        if (router.isReady) {
            let {
                page,
                items_per_page,
                search_email,
                search_status,
                search_name,
                lang_code,
                sort_by,
                sort_order
            } = router.query

            let newParams: userParams = {}
            newParams.page = page ?? defaultParams.page
            newParams.items_per_page = items_per_page ?? defaultParams.items_per_page
            newParams.lang_code = lang_code ?? defaultParams.lang_code
            newParams.search_email = search_email ?? undefined
            newParams.search_status = search_status ?? undefined
            newParams.search_name = search_name ?? undefined
            newParams.sort_by = sort_by ?? undefined
            newParams.sort_order = sort_order ?? undefined
            const call_api = (params: userParams) => {
                return axios.post(fnCurrentApiUrl("/api/users"), {
                    ...params,
                    user_id: userLogin.user_id
                })
            }
            call_api(newParams)
                .then((res) => {
                    setLoadPage(false)
                    setParams(newParams)
                    setUsers(res.data?.data ?? [])
                    setTotalItems(Number(res.data?.search.total_items) ?? 0)
                    setItemsPerPage(res.data?.search?.items_per_page ?? defaultParams.items_per_page)
                    setCurrentPage(res.data?.search?.page ?? defaultParams.page)
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
        router.push(fnUrlQueryBuilder('users', _params))
    }

    //Handle search
    const handleSearch = (search_params: any) => {
        let _params = {...params, ...search_params}
        _params.page = +1
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('users', _params))
    }

    const handleStatusTab = (tab: string) => {
        if (tab == 'manage_roles') {
            router.push(fnUrlQueryBuilder('users/vendor_group_permission', {}))
        }
    }
    /* 20220511 Function Sort Table Head Start */
    const [open, setOpen] = useState<boolean>(false)
    const options_sort_by = [
        { value: 'name', label: intl.formatMessage({id: 'LANGUAGE.FULL_NAME'}) },
        { value: 'email', label: intl.formatMessage({id: 'LANGUAGE.EMAIL'})}
    ]
    const options_sort_order = [
        { value: 'desc', label: intl.formatMessage({id: 'LANGUAGE.DESC'})  },
        { value: 'asc', label: intl.formatMessage({id: 'LANGUAGE.ASC'}) }
    ]
    const [selectSortBy, setSelectSortBy] = useState(options_sort_by[0])
    const [selectSortOrder, setSelectSortOrder] = useState(options_sort_order[0])
    const handleSort = (sort_params: any) =>{
        setOpen(false)
        let _params = {...params, ...sort_params}
        _params.sort_by ? _params.sort_by = _params.sort_by : ''
        _params.sort_order ? _params.sort_order = _params.sort_order : ''
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('users', _params))
    }
    const handleSortMobileOpen = () =>{
        if(open == false)  setOpen(true)
        else setOpen(false)
    }
    const sortMobile = (
        <div className="card-toolbar">
            <Button onClick={handleSortMobileOpen} className='btn btn-icon btn-sm btn-light-primary btn btn-primary '>
                <FontAwesomeIcon icon={faFilter} />
            </Button>
            <div className={`menu menu-sub menu-sub-dropdown w-250px ${open === true ? "active" : ""}`} >
                <div className="px-7 py-5">
                    <Select options={options_sort_by}
                            defaultValue={selectSortBy}
                            onChange={
                                (option: any) => {
                                    if(option)
                                        setSelectSortBy(option)
                                }
                            }
                    />
                    <Select options={options_sort_order}
                            defaultValue={selectSortOrder}
                            onChange={
                                (option: any) => {
                                    if(option)
                                        setSelectSortOrder(option)
                                }
                            }
                            className="pt-5" />
                    <div className="d-flex justify-content-end pt-5">
                        <Button className="btn btn-sm btn-primary" onClick={() => handleSort(
                            {
                                sort_by: selectSortBy.value,
                                sort_order: selectSortOrder.value
                            }
                        )}>
                            {intl.formatMessage({id: 'LANGUAGE.SORT'})}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
    /* 20220511 Function Sort Table Head End */
    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: "USERS.USER_LIST"})}</title>
                <meta name="description" content={intl.formatMessage({id: "USERS.USER_LIST"})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <TabList defaultStatus={(params?.tab) ? params?.tab : 'manage_users'} handleTab={handleStatusTab}
                     options={tabs} tabAll={false}/>
            <UserSearch search_email={params.search_email}
                        search_name={params.search_name}
                        search_status={params.search_status}
                        submitSearchHandler={handleSearch}/>

            <div className={"card"}>
                <div className="card card-flush">
                    <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span
                                className="card-label fw-bolder fs-3 mb-1">{intl.formatMessage({id: 'USERS.USER_LIST'})}</span>
                            <span
                                className="text-muted mt-1 fw-bold fs-7">{totalItems ? Number(totalItems) : 0} {intl.formatMessage({id: 'LANGUAGE.USER_FOUND'})}</span>
                        </h3>
                        {isMobile ? sortMobile : ''}
                        {(vendorRoot) ? "" : (
                            <div className="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top"
                                 data-bs-trigger="hover" title="Click to add a user">
                                <Link href="/users/create">
                                    <a className="btn btn-sm btn-light-primary"><span
                                        className="svg-icon svg-icon-3"></span>{intl.formatMessage({id: 'USER.ADD_USER'})}
                                    </a>
                                </Link>
                            </div>)}

                    </div>
                    <div className="card-body pt-0">
                        <UserTable users={users}
                                   loading={loadPage}
                                   paramsUser={params}
                                   submitHandleSort={handleSort}
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
        </>
    )
}


Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
