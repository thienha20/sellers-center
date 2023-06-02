import React, {useEffect, useMemo, useState} from "react"
import {useIntl} from "react-intl"
import {fnPriceFormat} from "../../utils/price"
import Link from 'next/link'
import _ from 'lodash'
import Image from "next/image"
import {SubProductTable} from "./subProductTable";
import {Obj} from "../../utils/types";
import {KTSVG} from "../images/KTSVG";
import {isMobileDevice} from "../../utils/metronic/_utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons";
import {BlankRow} from "./blankRow";
import {TableLoading} from "./tableLoading";
import {TableNoData} from "./tableNoData";

type propsTable = {
    products: any, //TODO: declare this
    simple?: boolean,
    loading?: boolean,
    handleDeleteTemporaryProduct: Function
    submitHandleSort: Function
}

const ProductTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const default_product_image = '/media/products/no_image.png'
    const {products, loading, simple, handleDeleteTemporaryProduct,submitHandleSort} = {...props}
    const [data, setData] = useState<JSX.Element[]>([])
    const [expanded, setExpanded] = useState<Obj>({})
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const [tableHeader, setTableHeader] = useState<JSX.Element[]>([])

    // tablet header sorting
    const [sortProductName, setSortProductName] = useState('any')
    const [sortCategory, setSortCategory] = useState('any')
    const [sortBrand, setSortBrand] = useState('any')

    useEffect(() => {
        // console.log('expanded', expanded)
    }, [expanded])
    const header = useMemo(() => simple ? [
        {id: 'product', label: intl.formatMessage({id: 'PRODUCT.PRODUCT'})}
    ] : [
        {id: 'children', label: ''},
        {id: 'product', label: intl.formatMessage({id: 'PRODUCT.PRODUCT'})},
        {id: 'category', label: intl.formatMessage({id: 'LANGUAGE.CATEGORY'})},
        {id: 'brand', label: intl.formatMessage({id: 'LANGUAGE.BRAND'})},
        {id: 'amount', label: intl.formatMessage({id: 'LANGUAGE.PRODUCT_AMOUNT'})},
        {id: 'price', label: intl.formatMessage({id: 'PRODUCT.PRODUCT_PRICE'})},
        {id: 'actions', label: ''},
    ], [simple])

    const onsubmitHandleSort = (sort_by?: string, sort_order?: string) => {
        if (sort_by == 'product'){
            setSortCategory('any')
            setSortBrand('any')
            if (sort_order === 'desc') setSortProductName('false')
            if (sort_order === 'asc') setSortProductName('true')
        }
        if (sort_by == 'category'){
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

    useEffect(() => {
        let _tableHeader = header.map(product_props => {
             return (
                 // <th key={`th-${product_props.label}`} scope="col" className=" text-center table-sort-desc">
                 //     {product_props.label}
                 // </th>
                 <th key={`th-${product_props.id}`} scope="col"  className=" text-center">
                     {/* Sort Code Start  */}
                     {product_props.id === 'product' ? <div style={{display:"flex",alignItems:"center"}}>{product_props.label}
                         <div className="ms-1 icon-sort"><FontAwesomeIcon className={`icon1 ${sortProductName == "true" || sortProductName == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                             product_props.id,
                             'desc'
                         )} icon={faArrowUp} /> <FontAwesomeIcon className={`icon2 ${sortProductName == "false" || sortProductName == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                             product_props.id,
                             'asc'
                         )} icon={faArrowDown} />
                         </div></div> : product_props.id === 'category' || product_props.id === 'brand' ? '' : product_props.label }
                     {/* Sort Code End */}

                     {/* Sort Category Start  */}
                     {product_props.id === 'category' ? <div style={{display:"flex",alignItems:"center"}}>{product_props.label}
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

                     {product_props.id == 'children' || product_props.id == 'action' ? <div style={{display:"flex",alignItems:"center"}}>  &nbsp; </div> : ''}
                 </th>
             )
        })
        setTableHeader(_tableHeader)
    }, [products])


    const tableHeaderMobile = useMemo(() => header.map(product_props => {
        return (
            // <th key={`th-${product_props.id}`} scope="col" className={`w-mobile-${product_props.id}`}>
            //     {product_props.label}
            <th key={`th-${product_props.id}`} scope="col" className=" text-center">
                {product_props.label}
            </th>)
    }), [header])

    const loadingData = useMemo(() => {
        return (
            <tr>
                <td colSpan={header.length}>
                    <div className={'d-flex justify-content-center mt-10 mb-10'}>
                    <span className="indicator-progress" style={{display: 'block'}}>
                    </span>
                    </div>
                </td>
            </tr>
        )
    }, [])
    useEffect(() => {
        if (products) {
            let dataTemp: JSX.Element[] = []
            Object.values(products).forEach((product: any) => {
                    if (!_.isNil(product)) {
                        if (simple) {
                            if (!_.isNil(product.product_temporary_id)) {
                                dataTemp.push(
                                    <tr key={`tr-${product.product_temporary_id}`}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="symbol symbol-45px me-2">
                                                    <Image
                                                        src={(product.images && product.images[0]) ?? default_product_image}
                                                        alt=""
                                                        width={45}
                                                        height={45}
                                                    />
                                                </div>
                                                <div
                                                    className="d-flex justify-content-start flex-column fw-bold tat-text-blue text-hover-primary fs-6">
                                                    <Link
                                                        href={`/products/update/temporaries_product/${product.product_temporary_id}`}>
                                                        <a className={' tat-text-blue text-truncate '} title={product.product_name}>
                                                            {product.product_name}</a>
                                                    </Link>
                                                    {/*<span className="text-muted fw-bold text-muted d-block fs-7"> ... </span>*/}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-end flex-shrink-0">
                                                <Link
                                                    href={`/products/update/temporaries_product/${product.product_temporary_id}`}>
                                                    <a
                                                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                                        <span
                                                            className="svg-icon svg-icon-3">
                                                            <svg width="24" height="24" viewBox="0 0 24 24"
                                                                 fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                 className="mh-50px">
                                                                <path opacity="0.3"
                                                                      d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z"
                                                                      fill="black">

                                                                </path>
                                                                <path
                                                                    d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z"
                                                                    fill="black"/>
                                                            </svg>
                                                        </span>
                                                    </a>
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        handleDeleteTemporaryProduct(product.product_temporary_id)
                                                    }}
                                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                                                    <span
                                                        className="svg-icon svg-icon-3">
                                                        <svg width="24" height="24" viewBox="0 0 24 24"
                                                             fill="none" xmlns="http://www.w3.org/2000/svg"
                                                             className="mh-50px">
                                                            <path
                                                                d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                                                                fill="black"/>
                                                            <path opacity="0.5"
                                                                  d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                                                                  fill="black">

                                                            </path>
                                                            <path opacity="0.5"
                                                                  d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                                                                  fill="black">

                                                            </path>
                                                        </svg>
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        } else {
                            if (!_.isNil(product.product_id)) {
                                dataTemp.push(
                                    <>
                                        <tr key={`tr-${product.product_id}`}
                                            className={'text-hover-primary '}
                                        >
                                            <td >
                                                <div
                                                    className="d-flex align-items-center">
                                                    {
                                                        product.variation_group_id > 0 ? expanded[product.product_id] > 0 ?
                                                            <div onClick={(e) => {
                                                                // console.log('will expand ', product.product_id)
                                                                let newSate = {...expanded}
                                                                newSate[product.product_id] = expanded[product.product_id] ? !expanded[product.product_id] : true
                                                                setExpanded(newSate)
                                                            }}>
                                                                <KTSVG
                                                                    path='/media/icons/duotune/arrows/arr014.svg'
                                                                    className='svg-icon-1'
                                                                />
                                                            </div>:
                                                            <div onClick={(e) => {
                                                                // console.log('will expand ', product.product_id)
                                                                let newSate = {...expanded}
                                                                newSate[product.product_id] = expanded[product.product_id] ? !expanded[product.product_id] : true
                                                                setExpanded(newSate)
                                                            }}>
                                                                <KTSVG
                                                                    path='/media/icons/duotune/arrows/arr013.svg'
                                                                    className='svg-icon-1'
                                                                />
                                                            </div> : <div style={{width:'24.5px'}}></div>
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="symbol symbol-45px me-5">
                                                        <Image
                                                            src={(product.image_path && product.image_path[0]) ? product.image_path : default_product_image}
                                                            alt=""
                                                            width={45}
                                                            height={45}
                                                        />
                                                    </div>
                                                    <div
                                                        className="d-flex justify-content-start flex-column fw-bold fs-6 w-50">
                                                        <span className={"tat-text-blue"}>{product.product}</span>
                                                        <strong>
                                                            {/*{intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}: */}
                                                            {product.seller_sku?? ''}
                                                        </strong>
                                                    </div>
                                                </div>
                                                {/*<div className="d-flex justify-content-start">*/}
                                                {/*    <div className="symbol symbol-45px me-2">*/}
                                                {/*        <Image*/}
                                                {/*            src={(product.image_path && product.image_path[0]) ? product.image_path : default_product_image}*/}
                                                {/*            alt=""*/}
                                                {/*            width={45}*/}
                                                {/*            height={45}*/}
                                                {/*        />*/}
                                                {/*    </div>*/}
                                                {/*    <div*/}
                                                {/*        className="d-flex justify-content-start flex-column fw-bold fs-6">*/}
                                                {/*        <span>*/}
                                                {/*            <Link href={`/products/update/${product.product_id}`}>*/}
                                                {/*                <a className={`tat-text-blue`}  title={product.product}>*/}
                                                {/*                    {product.product}</a>*/}
                                                {/*            </Link>*/}
                                                {/*        </span>*/}
                                                {/*        /!*<div>*!/*/}
                                                {/*            <small>*/}
                                                {/*                {intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}: {product.seller_sku?? ''}*/}
                                                {/*            </small>*/}
                                                {/*        /!*</div>*!/*/}

                                                {/*        /!*<span className="text-muted fw-bold text-muted d-block fs-7"> ... </span>*!/*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-start">
                                                    {product.category}
                                                </div>
                                            </td>
                                            <td>
                                                {product.brand}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center flex-shrink-0">
                                                    {product.amount??''}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-end flex-shrink-0">
                                                    {fnPriceFormat(parseInt(product.price as string))}
                                                </div>
                                            </td>

                                            {/*<td>*/}
                                            {/*    <div className="d-flex justify-content-end flex-shrink-0">*/}
                                            {/*        {product.status}*/}
                                            {/*    </div>*/}
                                            {/*</td>*/}

                                            <td>
                                                <div className="d-flex justify-content-end flex-shrink-0">
                                                    <Link href={`/products/update/${product.product_id}`}>
                                                        <a
                                                            className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                                        <span
                                                            className="svg-icon svg-icon-3">
                                                            <svg width="24" height="24" viewBox="0 0 24 24"
                                                                 fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                 className="mh-50px">
                                                                <path opacity="0.3"
                                                                      d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z"
                                                                      fill="black">

                                                                </path>
                                                                <path
                                                                    d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z"
                                                                    fill="black"/>
                                                            </svg>
                                                        </span>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                        {expanded[product.product_id] > 0 && product.variation_group_id > 0 &&
                                            <tr key={`tr-${product.product_id}`} >
                                                <td colSpan={header.length}>
                                                    <SubProductTable parent_product_id={product.product_id}
                                                                     colSpan={header.length}
                                                                     handleDeleteTemporaryProduct={(e: any) => {
                                                                     }}/>
                                                </td>
                                            </tr>
                                        }
                                    </>
                                )
                            }
                        }
                    }
                }
            )
            setData(dataTemp)
        }
    }, [products, expanded])


    return (
        <div className="productTable dataTables_wrapper dt-bootstrap4">
            <div className={`table-responsive ${loading? 'table-loading':''}`}
                 style={{'overflow': 'scroll'}}
            >
                    {loading && (
                        <TableLoading/>
                    )}
                    <table
                        className="table table-row-bordered table-row-dashed align-middle fw-bolder dataTable g-2">
                        <thead >
                        <tr className="fw-bold fs-7 text-gray-700 border-bottom border-gray-200">
                            {!isMobile ? tableHeader : tableHeaderMobile}
                        </tr>
                        </thead>
                        <tbody className="fs-7 border-top-0">
                        {(!loading && data.length > 0) ? data : (loading) ?
                            <BlankRow colSpan={header.length}/> : <TableNoData colSpan={header.length}/>  }
                        </tbody>
                    </table>
            </div>
        </div>
    )
}

export {ProductTable}
