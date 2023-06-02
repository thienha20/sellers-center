import React, {useEffect, useMemo, useState} from "react"
import {useIntl} from "react-intl"
import {fnPriceFormat} from "../../utils/price"
import Link from 'next/link'
import _ from 'lodash'
import Image from "next/image"
import {Spinner, Button} from "react-bootstrap"
import axios from "axios";
import {fnCurrentApiUrl} from "../../utils/url";
import {Obj} from "../../utils/types";
import {BlankRow} from "./blankRow";
import {TableLoading} from "./tableLoading";
import {TableNoData} from "./tableNoData";

type propsTable = {
    parent_product_id?: string | null | undefined | string[],
    simple?: boolean,
    handleDeleteTemporaryProduct: Function,
    colSpan?: number | undefined,
}

type productParams = {
    parent_product_id?: string | null | undefined | string[],
}


const SubProductTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const default_product_image = '/media/products/no_image.png'
    const {parent_product_id, simple, colSpan, handleDeleteTemporaryProduct} = {...props}
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<JSX.Element[]>([])
    const [products, setProducts] = useState<Obj>()

    const header = useMemo(() => simple ? [
        intl.formatMessage({id: 'PRODUCT.PRODUCT'})
    ] : [
        intl.formatMessage({id: 'PRODUCT.PRODUCT'}),
        intl.formatMessage({id: 'LANGUAGE.PRODUCT_AMOUNT'}),
        intl.formatMessage({id: 'PRODUCT.PRODUCT_PRICE'}),
    ], [simple])

    const tableHeader = useMemo(() => header.map(product_props => {
        return (
            <th key={`th-${product_props}`} scope="col" className="text-center">
                {product_props}
            </th>)
    }), [header])

    const call_api = (par: productParams) => {
        return axios.post(fnCurrentApiUrl("/api/products"), par)
    }
    useEffect(() => {
        if (parent_product_id != '') {
            call_api({parent_product_id: parent_product_id})
                .then((res) => {
                    setProducts(res.data?.data ?? [])
                    setLoading(false)
                })
        }
    }, [parent_product_id])
    const noData = useMemo(() => {
        return (
            (
                <div className="productTable dataTables_wrapper dt-bootstrap4">
                    <div className="table-responsive">
                        <span> {intl.formatMessage({id: 'LANGUAGE.NO_DATA'})}.</span>
                    </div>
                </div>
            )
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
                                                    {/*<Link*/}
                                                    {/*    href={`/products/update/temporaries_product/${product.product_temporary_id}`}>*/}
                                                        <a>{product.product_name}</a>
                                                    {/*</Link>*/}
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
                                        <tr key={`tr-${product.product_id}`}>
                                            {/*<td>*/}

                                            {/*    {product.product_id}*/}
                                            {/*</td>*/}
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div style={{width: '24.5px'}}></div>
                                                    <div className="symbol symbol-45px me-5">
                                                        <div className="symbol symbol-45px me-2">
                                                            <Image
                                                                src={(product.image_path && product.image_path[0]) ? product.image_path : default_product_image}
                                                                alt=""
                                                                width={45}
                                                                height={45}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="d-flex justify-content-start flex-column fw-bold text-hover-primary fs-6"
                                                        // style={{'max-width': '300px'}}
                                                    >
                                                        {/*<Link href={`/products/update/${product.product_id}`}>*/}
                                                            <a className={" tat-text-blue text-truncate"}>{product.product}</a>
                                                        {/*</Link>*/}
                                                        <small>
                                                            {intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}: {product.seller_sku ?? ''}
                                                        </small>
                                                        {/*<span className="text-muted fw-bold text-muted d-block fs-7"> ... </span>*/}
                                                    </div>
                                                </div>
                                            </td>
                                            {/*<td>*/}
                                            {/*    {product.category}*/}
                                            {/*</td>*/}
                                            {/*<td>*/}
                                            {/*    {product.brand}*/}
                                            {/*</td>*/}

                                            <td >
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
                                                    {/*<a href="#"*/}
                                                    {/*   className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">*/}
                                                    {/*        <span*/}
                                                    {/*            className="svg-icon svg-icon-3">*/}
                                                    {/*            <svg width="24" height="24" viewBox="0 0 24 24"*/}
                                                    {/*                 className="mh-50px">*/}
                                                    {/*                <path*/}
                                                    {/*                    d="M17.5 11H6.5C4 11 2 9 2 6.5C2 4 4 2 6.5 2H17.5C20 2 22 4 22 6.5C22 9 20 11 17.5 11ZM15 6.5C15 7.9 16.1 9 17.5 9C18.9 9 20 7.9 20 6.5C20 5.1 18.9 4 17.5 4C16.1 4 15 5.1 15 6.5Z"*/}
                                                    {/*                    fill="black">*/}
                                                    {/*                </path>*/}
                                                    {/*                <path opacity="0.3"*/}
                                                    {/*                      d="M17.5 22H6.5C4 22 2 20 2 17.5C2 15 4 13 6.5 13H17.5C20 13 22 15 22 17.5C22 20 20 22 17.5 22ZM4 17.5C4 18.9 5.1 20 6.5 20C7.9 20 9 18.9 9 17.5C9 16.1 7.9 15 6.5 15C5.1 15 4 16.1 4 17.5Z"*/}
                                                    {/*                      fill="black">*/}
                                                    {/*                </path>*/}
                                                    {/*            </svg>*/}
                                                    {/*        </span>*/}
                                                    {/*</a>*/}
                                                    {/*<Link href={`/products/update/${product.product_id}`}>*/}
                                                    {/*    <a*/}
                                                    {/*        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">*/}
                                                    {/*    <span*/}
                                                    {/*        className="svg-icon svg-icon-3">*/}
                                                    {/*        <svg width="24" height="24" viewBox="0 0 24 24"*/}
                                                    {/*             fill="none" xmlns="http://www.w3.org/2000/svg"*/}
                                                    {/*             className="mh-50px">*/}
                                                    {/*            <path opacity="0.3"*/}
                                                    {/*                  d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z"*/}
                                                    {/*                  fill="black">*/}

                                                    {/*            </path>*/}
                                                    {/*            <path*/}
                                                    {/*                d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z"*/}
                                                    {/*                fill="black"/>*/}
                                                    {/*        </svg>*/}
                                                    {/*    </span>*/}
                                                    {/*    </a>*/}
                                                    {/*</Link>*/}
                                                    {/*<a href="#"*/}
                                                    {/*   className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">*/}
                                                    {/*<span*/}
                                                    {/*    className="svg-icon svg-icon-3">*/}
                                                    {/*    <svg width="24" height="24" viewBox="0 0 24 24"*/}
                                                    {/*         fill="none" xmlns="http://www.w3.org/2000/svg"*/}
                                                    {/*         className="mh-50px">*/}
                                                    {/*        <path*/}
                                                    {/*            d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"*/}
                                                    {/*            fill="black"/>*/}
                                                    {/*        <path opacity="0.5"*/}
                                                    {/*              d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"*/}
                                                    {/*              fill="black">*/}

                                                    {/*        </path>*/}
                                                    {/*        <path opacity="0.5"*/}
                                                    {/*              d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"*/}
                                                    {/*              fill="black">*/}

                                                    {/*        </path>*/}
                                                    {/*    </svg>*/}
                                                    {/*</span>*/}
                                                    {/*</a>*/}
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )
                            }
                        }
                    }
                }
            )
            setData(dataTemp)
        }
    }, [products])

    return (
        <div className={`table-responsive ${loading? 'table-loading':''}`}>
            {loading && (
                <TableLoading/>
            )}

            {data.length > 0 && !loading ?
                <div className={'bg-lighten p-2'}>
                    <table
                        className="table table-row-bordered table-row-dashed align-middle fw-bolder bg-white dataTable"
                    >
                        <thead className="fs-7 text-gray-400">
                            <tr>
                                {tableHeader}
                            </tr>
                        </thead>
                        <tbody className="fs-7 border-top-0">
                        {data}
                        </tbody>
                    </table>
                </div> : (loading)?
                    <BlankRow colSpan={header.length}/> : <TableNoData colSpan={header.length}/>
            }
        </div>
    )
}

export {SubProductTable}
