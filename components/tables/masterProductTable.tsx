import React, {MouseEvent, useEffect, useMemo, useState} from "react"
import {useIntl} from "react-intl"
import axios from "axios"
import {useAlert} from 'react-alert'
import {fnCurrentApiUrl} from "../../utils/url"
import Image from "next/image"
import {Button, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import {isMobileDevice} from "../../utils/metronic/_utils";
import Link from "next/link";
import {TableLoading} from "./tableLoading";
import {BlankRow} from "./blankRow";
import {TableNoData} from "./tableNoData";

type propsTable = {
    products: any //TODO: declare this
    sellSelected: Function
    loading?: boolean
    submitHandleSort: Function
}

const MasterProductTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const {products, sellSelected, loading,submitHandleSort} = {...props}
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const alert = useAlert()
    const [tableHeader, setTableHeader] = useState<JSX.Element[]>([])
    const [tableData, setTableData] = useState<JSX.Element[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const header = useMemo(() => [
        {id: 'product_id_select', label: ''},
        {id: 'product', label: intl.formatMessage({id: 'PRODUCT.NAME_MSKU'})},
        {id: 'categories', label: intl.formatMessage({id: 'LANGUAGE.CATEGORY'})},
        {id: 'brand', label: intl.formatMessage({id: 'LANGUAGE.BRAND'})},
        {id: 'sell', label: intl.formatMessage({id: 'PRODUCT.SELL'})}
    ], [])
    const noData = useMemo(() => {
        return (
            <tr>
                <td colSpan={header.length}>
                    <div className={'d-flex justify-content-center mt-10 mb-10'}>
                    <span className='indicator-progress' style={{display: 'block'}}>
                        No data
                    </span>
                    </div>
                </td>
            </tr>
        )
    }, [])

    const handleSelect = (id: string) => {
        let _selectedIds = [...selectedIds]
        const index = _selectedIds.indexOf(id)
        if (index == -1) {
            _selectedIds.push(id)
        } else {
            _selectedIds.splice(index, 1)
        }
        setSelectedIds(_selectedIds)
    }

    const handleSelectAll = () => {
        let _selectedIds: string[] = []
        if (selectedIds.length != Object.keys(products).length) {
            _selectedIds = Object.keys(products).map((index) => {
                return products[index]['product_id']
            })
        }
        setSelectedIds(_selectedIds)
    }

    useEffect(() => {
        sellSelected(selectedIds);
    }, [selectedIds])

    /* Function Sort Table Head Start */
    const [sortProductName, setSortProductName] = useState('any')
    const [sortCategory, setSortCategory] = useState('any')
    const [sortBrand, setSortBrand] = useState('any')
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            let {
                sort_by,
                sort_order
            } = router.query
            /* Check Url Browser Set Active for SortBy And SortOrder Start */
            if (sort_by == 'product'){
                setSortCategory('any')
                setSortBrand('any')
                if (sort_order === 'desc') setSortProductName('false')
                if (sort_order === 'asc') setSortProductName('true')
            }
            if (sort_by == 'categories'){
                setSortProductName('any')
                setSortBrand('any')
                if(sort_order === 'desc') setSortCategory('false')
                if (sort_order === 'asc') setSortCategory('true')
            }
            if (sort_by == 'brand'){
                setSortProductName('any')
                setSortCategory('any')
                if(sort_order === 'desc') setSortBrand('false')
                if (sort_order === 'asc') setSortBrand('true')
            }
            /* Check Url Browser Set Active for SortBy And SortOrder End */
        }
    }, [router.isReady, router.query])
    const onsubmitHandleSort = (sort_by?: string, sort_order?: string) => {
        if (sort_by == 'product'){
            setSortCategory('any')
            setSortBrand('any')
            if (sort_order === 'desc') setSortProductName('false')
            if (sort_order === 'asc') setSortProductName('true')
        }
        if (sort_by == 'categories'){
            setSortProductName('any')
            setSortBrand('any')
            if(sort_order === 'desc') setSortCategory('false')
            if (sort_order === 'asc') setSortCategory('true')
        }
        if (sort_by == 'brand'){
            setSortProductName('any')
            setSortCategory('any')
            if(sort_order === 'desc') setSortBrand('false')
            if (sort_order === 'asc') setSortBrand('true')
        }
        submitHandleSort(
            {
                sort_by: sort_by,
                sort_order: sort_order
            }
        )
    }
    const tableHeaderMobile = useMemo(() => header.map(product_props => {
        return (
            <th key={`th-${product_props.id}`} scope="col" className={`w-mobile-${product_props.id}`}>
                {product_props.label}
            </th>)
    }), [header])
    useEffect(() => {
        let _tableHeader = header.map(product_props => {
            if (product_props.id == 'product_id_select') {
                const isselected = selectedIds.length == Object.keys(products).length
                return (
                    <th key={`th-check-all`} scope="col" className={'w-25px'}>
                        <div className={'form-check form-check-sm form-check-custom form-check-solid'}>
                            <input style={{height: 20, width: 20}} className="form-check-input" type="checkbox"
                                   checked={isselected} onChange={e => {
                                handleSelectAll()
                            }}/>
                        </div>
                    </th>)
            } else return (
                <th key={`th-${product_props.id}`} scope="col" className={`w-${product_props.id}`}>
                    {/* Sort Code Start  */}
                    {product_props.id === 'product' ? <div style={{display:"flex",alignItems:"center"}}>{product_props.label}
                        <div className="ms-1 icon-sort"><FontAwesomeIcon className={`icon1 ${sortProductName == "true" || sortProductName == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                            product_props.id,
                            'desc'
                        )} icon={faArrowUp} /> <FontAwesomeIcon className={`icon2 ${sortProductName == "false" || sortProductName == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                            product_props.id,
                            'asc'
                        )} icon={faArrowDown} />
                        </div></div> : product_props.id === 'categories' || product_props.id === 'brand' ? '' : product_props.label }
                    {/* Sort Code End */}

                    {/* Sort Category Start  */}
                    {product_props.id === 'categories' ? <div style={{display:"flex",alignItems:"center"}}>{product_props.label}
                        <div className="ms-1 icon-sort"><FontAwesomeIcon className={`icon1 ${sortCategory == "true" || sortCategory == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                            product_props.id,
                            'desc'
                        )} icon={faArrowUp} /> <FontAwesomeIcon className={`icon2 ${sortCategory == "false" || sortCategory == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                            product_props.id,
                            'asc'
                        )} icon={faArrowDown} />
                        </div></div> : ''}
                    {/* Sort Category End */}

                    {/* Sort Brand Start  */}
                    {product_props.id === 'brand' ? <div style={{display:"flex",alignItems:"center"}}>{product_props.label}
                        <div className="ms-1 icon-sort"><FontAwesomeIcon className={`icon1 ${sortBrand == "true" || sortBrand == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                            product_props.id,
                            'desc'
                        )} icon={faArrowUp} /> <FontAwesomeIcon className={`icon2 ${sortBrand == "false" || sortBrand == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                            product_props.id,
                            'asc'
                        )} icon={faArrowDown} />
                        </div></div> : ''}
                    {/* Sort Brand End */}
                </th>
            )
        })
        setTableHeader(_tableHeader)
        /* Function Sort Table Head End */
        let data: JSX.Element[] = [];
        Object.values(products).forEach((product: any) => {
                const rowSelected = selectedIds.indexOf(product.product_id) != -1
                data.push(
                    <tr key={`tr-${product.product_id}`}>
                        <td className={'w-25px'}>
                            <div className={'form-check form-check-sm form-check-custom form-check-solid'}>
                                <input
                                    style={{height: 20, width: 20}}
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={rowSelected}
                                    onChange={e => {
                                        handleSelect(product.product_id)
                                    }
                                    }
                                />
                            </div>
                        </td>
                        <td>
                            <div className="d-flex align-items-center">
                                <div className="symbol symbol-45px me-5">
                                    <Image width={45} height={45}
                                       src={(product.image_path && product.image_path[0]) ? product.image_path  : "/media/products/no_image.png"}
                                        alt=""/>
                                </div>
                                <div
                                    className="d-flex justify-content-start flex-column fw-bold fs-6">
                                    <span className={"tat-text-blue"}>{product.product}</span>
                                    <strong>{product.product_code}</strong>
                                </div>

                            </div>
                        </td>
                        <td>
                            <div className="d-flex justify-content-start">
                                {product.category}
                            </div>
                        </td>
                        <td>
                            <div className="d-flex justify-content-start">
                                {product.brand}
                            </div>
                        </td>

                        <td>
                            <div className="d-flex justify-content-end">
                                {(product.vendor_product_id != null) ? <span
                                        className="btn btn-bg-light btn-active-color-primary btn-sm me-1">{intl.formatMessage({id: 'PRODUCT.SALE_FOR'})}</span> :
                                    <Link href={{
                                        pathname: `/products/create`,
                                        query:{
                                            source_product_id: product.product_id
                                        }
                                    }} passHref>
                                        {/*<button className="btn btn-primary btn-sm me-1"*/}
                                        {/*        onClick={(e: MouseEvent<HTMLButtonElement>) => {*/}
                                        {/*            handleSellerThis(product.product_id, e);*/}
                                        {/*        }}>{intl.formatMessage({id: 'PRODUCT.SELL_THIS'})}*/}
                                        {/*</button> */}
                                        <button className="btn btn-primary btn-sm me-1"
                                               >{intl.formatMessage({id: 'PRODUCT.SELL_THIS'})}</button>
                                    </Link>
                                    }
                            </div>
                        </td>
                    </tr>
                )
            }
        );
        setTableData([...data])
    }, [products, selectedIds])


    const handleSellerThis = (product_id: number, e: MouseEvent<HTMLButtonElement>) => {
        const sell_this = (product_id: number) => {
            return axios.post(fnCurrentApiUrl("/api/master_products/sell_this"), {
                product_ids: product_id
            })
        }
        sell_this(product_id).then(response => {
            let button: any = e.target
            if (button) {
                button.style.display = "none"
                const span = document.createElement("span");
                span.innerHTML = intl.formatMessage({id: 'PRODUCT.SALE_FOR'})
                span.classList.add("btn")
                span.classList.add("btn-bg-light")
                span.classList.add("btn-active-color-primary")
                span.classList.add("btn-sm")
                span.classList.add("me-1")
                button.parentElement.appendChild(span)
            }
            alert.show(intl.formatMessage({id: intl.formatMessage({id: 'PRODUCT.UPDATE_SUCCESS'})}), {type: "success"})
        })
    }

    if (typeof products == 'undefined') {
        return (<></>)
    }


    return (
        <div className="table-responsive table-loading"
             style={{'overflow': 'scroll'}}
        >
            {loading && (
               <TableLoading/>
            )}
            <table className="table table-row-bordered table-row-dashed align-middle fw-bolder dataTable">
                <thead className={'fs-7 text-gray-400'}>
                <tr>
                    {!isMobile ? tableHeader : tableHeaderMobile}
                </tr>
                </thead>
                <tbody className={'fs-7 border-top-0'}>
                {(!loading && tableData.length > 0) ? tableData : (loading) ?
                    <BlankRow colSpan={header.length}/> : <TableNoData colSpan={header.length}/>  }
                </tbody>
            </table>
        </div>
    );
}

export {MasterProductTable}
