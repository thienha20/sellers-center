import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from "react"
import {MasterLayout} from "../../../components/layout/MasterLayout"
import {NextPageWithLayout, Obj} from "../../../utils/types"
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../../utils/url"
import {Pagination} from "../../../components/paginations/Pagination"
import {useRouter} from "next/router"
import axios from "axios"
import {OrderSearch} from '../../../components/search/OrderSearch'
import {OrderTable} from '../../../components/tables/orderTable'
import {useLang} from '../../../components/i18n/Metronici18n'
import {useIntl} from "react-intl"
import {usePageData} from "../../../components/layout/core"
import {TabList} from "../../../components/tabs/tabList"
import {fnListOrderStatus} from '../../../utils/string'
import {isMobileDevice} from "../../../utils/metronic/_utils"
import {Button} from 'react-bootstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import _ from "lodash";

type paramType = {
    items_per_page?: number | null | undefined | string[] | string,
    total_items?: number | null | undefined | string[] | string,
    page?: number | null | undefined | string[] | string,
    order_nr?: string | null | undefined | string[],
    search_order_nr?: string | null | undefined | string[],
    search_customer_name?: string | null | string[] | undefined,
    status?: string | null | string[] | undefined,
    order_status?: string | null | string[] | undefined,
    order_type?: string | null | string[] | undefined,
    payment_ids?: number | null | string[] | undefined | string,
    date_from?: string | null | undefined | string[],
    date_to?: string | null | undefined | string[],
    sort_by?: string | null | undefined | string[],
    sort_order?: string | null | undefined | string[],
    lang_code?: string | null | undefined | string[]
}

const default_item_per_page = 10

const Index: NextPageWithLayout = () => {
    // TODO: Search params
    const router = useRouter()
    const lang: string = useLang() ?? "vi"
    const intl = useIntl()
    const defaultParams: paramType = useMemo(() => {
        let obj: paramType = {
            page: +1,
            items_per_page: default_item_per_page,
            lang_code: lang
        }
        return obj
    }, [lang])
    const listOrderStatus: Obj[] = useMemo(() => fnListOrderStatus(intl), [intl])
    const [totalItems, setTotalItems] = useState<number>(0)
    const [itemsPerPage, setItemsPerPage] = useState<number>(default_item_per_page)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [loadPage, setLoadPage] = useState<boolean>(true)
    const [params, setParams] = useState<paramType>(defaultParams)
    const [orders, setOrders] = useState<Obj[]>([])
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    
    //page breadcrumb
    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "ORDER.ORDER"}),
                isActive: true
            }
        ])
    }, [])

    useEffect(() => {
        if (router.isReady) {
            let {
                page,
                items_per_page,
                payment_ids,
                search_customer_name,
                order_nr,
                order_status,
                date_from,
                date_to,
                sort_by,
                sort_order,
                lang_code,
                status
            } = router.query
            let newParams: paramType = {}
            newParams.page = page ?? defaultParams.page
            newParams.items_per_page = items_per_page ?? defaultParams.items_per_page
            newParams.lang_code = lang_code ?? defaultParams.lang_code
            newParams.payment_ids = payment_ids ?? undefined
            newParams.search_customer_name = search_customer_name ?? undefined
            newParams.order_nr = order_nr ?? undefined
            newParams.date_from = date_from ?? undefined
            newParams.date_to = date_to ?? undefined
            newParams.sort_by = sort_by ?? ""
            newParams.sort_order = sort_order ?? ""
            newParams.order_type = "B"
            newParams.status = status ?? ""
            if(!_.isEmpty(status)){
                newParams.order_status = ""
            }else{
                newParams.order_status = order_status ?? ""
            }
            const call_api = (par: paramType) => {
                return axios.post(fnCurrentApiUrl("/api/orders"), par)
            }
            call_api(newParams)
                .then((res) => {
                    setLoadPage(false)
                    setParams(newParams)
                    setOrders(res.data?.data ?? [])
                    setTotalItems(+res.data?.search?.total_items ?? 0)
                    setItemsPerPage(+res.data?.search?.items_per_page ?? defaultParams.items_per_page)
                    setCurrentPage(+res.data?.search?.page ?? defaultParams.page)
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
        router.push(fnUrlQueryBuilder('orders/b2b', _params))
    }
    //Handle search
    const handleSearch = (search_params: any) => {
        search_params.order_status = !_.isEmpty(search_params.status) ? "" : search_params.order_status
        let _params = {...params, ...search_params}
        _params.page = +1
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setParams(_params);
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('orders/b2b', _params))
    }
    //Handle search status
    const handleStatus = (order_status: any = '') => {
        let _params = {...params, ...order_status}
        _params.order_status = !_.isEmpty(_params.status) ? "" : _params.order_status
        _params.page = +1
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setParams(_params);
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('orders/b2b', _params))
    }

    /* 20220509 Function Sort Table Head Start */

    //Submit Handle Sort
    const [open, setOpen] = useState<boolean>(false)
    const options_sort_by: Obj[] = useMemo(() => [
        {value: 'total', label: intl.formatMessage({id: 'LANGUAGE.TOTAL_PRICE'})},
        {value: 'date', label: intl.formatMessage({id: 'LANGUAGE.ORDER_DATE'})}
    ], [intl])
    const options_sort_order: Obj[] = useMemo(() => [
        {value: 'desc', label: intl.formatMessage({id: 'LANGUAGE.DESC'})},
        {value: 'asc', label: intl.formatMessage({id: 'LANGUAGE.ASC'})}
    ], [intl])
    const [selectSortBy, setSelectSortBy] = useState<Obj>(options_sort_by[0])
    const [selectSortOrder, setSelectSortOrder] = useState<Obj>(options_sort_order[0])
    const handleSort = (sort_params: any) => {
        setOpen(false)
        let _params = {...params, ...sort_params}
        _params.sort_by ? _params.sort_by = _params.sort_by : ''
        _params.sort_order ? _params.sort_order = _params.sort_order : ''
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('orders/b2b', _params))
    }

    const handleSortMobileOpen = () => {
        setOpen(!open)
    }
    const sortMobile = (
        <div className="card-toolbar">
            <Button onClick={handleSortMobileOpen} className="btn btn-icon btn-sm btn-light-primary btn btn-primary ">
                <FontAwesomeIcon icon={faFilter}/>
            </Button>
            <div className={`menu menu-sub menu-sub-dropdown w-250px ${open === true ? "active" : ""}`}>
                <div className="px-7 py-5">
                    <Select options={options_sort_by}
                            defaultValue={selectSortBy}
                            onChange={
                                (option: any) => {
                                    if (option)
                                        setSelectSortBy(option)
                                }
                            }
                    />
                    <Select options={options_sort_order}
                            defaultValue={selectSortOrder}
                            onChange={
                                (option: any) => {
                                    if (option)
                                        setSelectSortOrder(option)
                                }
                            }
                            className="pt-5"/>
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
    )
    /* 20220509 Function Sort Table Head End */
    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'LANGUAGE.ORDER_LIST'})}</title>
                <meta name="description" content="{intl.formatMessage({id: 'LANGUAGE.ORDER_LIST'})}"/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <TabList defaultStatus={params?.order_status} handleTab={handleStatus} prefix={'order_status'} options={
                listOrderStatus
            }/>
            <div className={'row'}>
                <div className={'col-12 col-lg-3 order-lg-2'}>
                    <OrderSearch submitSearchHandler={handleSearch}
                                 payment_ids={params.payment_ids}
                                 date_from={params.date_from}
                                 date_to={params.date_to}
                                 search_customer_name={params.search_customer_name}
                                 order_nr={params.order_nr}
                                 status={params.status}
                    />
                </div>
                <div className={'col-12 col-lg-9 order-lg-1'}>
                    <div className={"card"}>
                        <div className="card card-flush">
                            <div className="card-header border-0 pt-5">
                                <h3 className="card-title align-items-start flex-column">
                                    <span
                                        className="card-label fw-bolder fs-3 mb-1">{intl.formatMessage({id: 'LANGUAGE.ORDER_LIST'})}</span>
                                    <span
                                        className="text-muted mt-1 fw-bold fs-7">{totalItems ? Number(totalItems) : 0} {intl.formatMessage({id: 'LANGUAGE.ORDER_FOUND'})}</span>
                                </h3>
                                {isMobile ? sortMobile : ''}
                            </div>
                            <div className="card-body py-3">
                                <OrderTable orders={orders}
                                            submitHandleSort={handleSort}
                                            loading={loadPage}
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

            </div>
        </>
    )
}

Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}
export default Index
