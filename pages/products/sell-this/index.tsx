import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect, useMemo, useState} from "react"
import {MasterLayout} from "../../../components/layout/MasterLayout"
import {NextPageWithLayout, Obj} from "../../../utils/types"
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../../utils/url"
import {Pagination} from "../../../components/paginations/Pagination"
import {useRouter} from "next/router"
import axios from "axios"
import {MasterProductSearch} from '../../../components/search/MasterProductSearch'
import {MasterProductTable} from '../../../components/tables/masterProductTable'
import {useLang} from '../../../components/i18n/Metronici18n'
import {useIntl} from "react-intl"
import {usePageData} from "../../../components/layout/core"
import {useAlert} from 'react-alert'
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import {isMobileDevice} from "../../../utils/metronic/_utils";
import { ReducerInterFace } from '../../../redux/reducers'
import {useSelector} from "react-redux"

type paramsSellThis = {
    items_per_page?: number | null | undefined | string[] | string,
    total_items?: number | null | undefined | string[] | string,
    page?: number | null | undefined | string[] | string,
    search_query?: string | null | undefined | string[],
    product_code?: string | null | undefined | string[],
    product_id?: string | null | undefined | string[],
    seller_skus?: string | null | undefined | string[],
    sell_this?: string | null | undefined | string[],
    price_from?: number | null | undefined | string[] | string,
    price_to?: number | null | undefined | string[] | string,
    category_id?: number | null | undefined | string | string[],
    brand_id?: number | null | undefined | string | string[],
    sort_by?: string | null | undefined | string[],
    sort_order?: string | null | undefined | string[],
    lang_code?: string | null | undefined | string[],
}


const default_item_per_page = 10
// const default_page = 1

const Index: NextPageWithLayout = () => {
    const intl = useIntl()
    const alert = useAlert()
    const router = useRouter()
    const lang: string = useLang() ?? "vi"
    const defaultParams: paramsSellThis = useMemo(() => {
        let obj: paramsSellThis = {
            page: +1,
            items_per_page: +10,
            lang_code: lang
        }
        return obj
    }, [lang])


    const [totalItems, setTotalItems] = useState<number>(0)

    const [itemsPerPage, setItemsPerPage] = useState<number>(default_item_per_page)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [params, setParams] = useState<paramsSellThis>(defaultParams)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loadPage, setLoadPage] = useState<boolean>(true)
    const [products, setProducts] = useState<Obj[]>([])
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const userLogin = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    //page breadcrumb
    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "PRODUCT.PRODUCT_LIST"}),
                isActive: true
            }
        ])
    }, [])

    //Gọi API
    useEffect(() => {

        if (router.isReady) {
            let {
                page,
                search_query,
                items_per_page,
                product_code,
                product_id,
                seller_skus,
                sell_this,
                price_from,
                price_to,
                category_id,
                brand_id,
                lang_code,
                sort_by,
                sort_order
            } = router.query
            let newParams: paramsSellThis = {}
            if (search_query) {
                newParams.search_query = search_query
            }
            newParams.page = page ?? defaultParams.page
            newParams.items_per_page = items_per_page ?? defaultParams.items_per_page
            newParams.lang_code = lang_code ?? defaultParams.lang_code
            newParams.search_query = search_query ?? undefined
            newParams.product_code = product_code ?? undefined
            newParams.product_id = product_id ?? undefined
            newParams.seller_skus = seller_skus ?? undefined
            newParams.sell_this = sell_this ?? undefined
            newParams.price_from = price_from ?? undefined
            newParams.price_to = price_to ?? undefined
            newParams.category_id = category_id ?? undefined
            newParams.brand_id = brand_id ?? undefined
            newParams.sort_by = sort_by ?? undefined
            newParams.sort_order = sort_order ?? undefined
            //call ajax page
            const call_api = (par: paramsSellThis) => {
                return axios.post(fnCurrentApiUrl("/api/master_products"), par)
            }
            call_api(newParams)
                .then((res) => {
                    setLoadPage(false)
                    setParams(newParams)
                    setProducts(res.data?.data ?? [])
                    setTotalItems(+res.data.search.total_items ?? 0)
                    setItemsPerPage(+res.data.search.items_per_page ?? defaultParams.items_per_page)
                    setCurrentPage(+res.data.search.page ?? defaultParams.page)
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
        router.push(fnUrlQueryBuilder('products/sell-this', _params))
    }

    //Handle search
    const handleSearch = (search_params: any) => {
        let _params = {...params, ...search_params}
        _params.page = +1
        if (_params.page == 1) _params.page = undefined
        if (_params.items_per_page == default_item_per_page) _params.items_per_page = undefined
        if (_params.lang_code == lang) _params.lang_code = undefined
        setLoadPage(true)
        router.push(fnUrlQueryBuilder('products/sell-this', _params))
    }

    const sellSelected = (product_ids: string[]) => {
        setSelectedIds(product_ids)
    }
    // handle sell selected
    const handleSellSelected = (product_ids: string[]) => {
        setLoadPage(true);
        if (!product_ids || product_ids.length === 0) return false
        const sell_this = (product_ids: string[]) => {
            return axios.post(fnCurrentApiUrl("/api/master_products/sell_this"), {
                product_ids: product_ids,
                user_id: userLogin.user_id
            })
        }
        sell_this(product_ids).then(response => {
            alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_SUCCESS'}), {type: "success"})
            router.push(fnUrlQueryBuilder('products/sell-this', params))
            setLoadPage(false);
        }).catch(e => {
            setLoadPage(false);
        })
       
    }
    //TODO: search params trên url

    /* 20220509 Function Sort Table Head Start */

    const [open, setOpen] = useState<boolean>(false)
    const options_sort_by = [
        { value: 'product', label: intl.formatMessage({id: 'PRODUCT.NAME_MSKU'}) },
        { value: 'categories', label: intl.formatMessage({id: 'LANGUAGE.CATEGORY'})},
        { value: 'brand', label: intl.formatMessage({id: 'LANGUAGE.BRAND'})}
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
        router.push(fnUrlQueryBuilder('products/sell-this', _params))
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
    /* 20220509 Function Sort Table Head End */
    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'PRODUCT.PRODUCT_LISTING_PAGE'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'PRODUCT.PRODUCT_LISTING_PAGE'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <div className={'row'}>
                <div className={'col-12 col-lg-3 order-lg-2'}>
                    <MasterProductSearch
                        found_number={Number(totalItems)}
                        price_from={params.price_from} price_to={params.price_to}
                        product_id={params.product_id} product_code={params.product_code}
                        seller_skus={params.seller_skus} sell_this={params.sell_this}
                        category_id={params.category_id} brand_id={params.brand_id}
                        search_query={String(params.search_query ?? '')}
                        submitSearchHandler={handleSearch}
                    />
                </div>
                <div className={'col-12 col-lg-9 order-lg-1'}>
                    <div className={"card"}>
                        <div className="card card-flush">
                            <div className="card-header border-0 pt-5">
                                <h3 className="card-title align-items-start flex-column">
                                        <span
                                            className="card-label fw-bolder fs-3 mb-1">{intl.formatMessage({id: 'PRODUCT.PRODUCT_LIST'})}</span>
                                    <span
                                        className="text-muted mt-1 fw-bold fs-7">{totalItems ? Number(totalItems) : 0} {intl.formatMessage({id: 'PRODUCT.ITEMS_FOUND'})}</span>
                                </h3>
                                {isMobile ? sortMobile : ''}
                                <div className="card-toolbar" data-bs-toggle="tooltip" data-bs-placement="top"
                                     data-bs-trigger="hover" title="Sell Selected">
                                    <button className="btn btn-sm btn-light-primary" onClick={() => {
                                        // TODO: đổi chỗ này
                                        handleSellSelected(selectedIds)
                                    }}>{intl.formatMessage({id: 'PRODUCT.SELL_SELECTED'})}</button>
                                </div>

                            </div>
                            <div className="card-body py-3">
                                <MasterProductTable products={products}
                                                    sellSelected={sellSelected}
                                                    submitHandleSort={handleSort}
                                                    loading={loadPage}/>
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

// @ts-ignore
Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
