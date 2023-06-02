import React, {ReactElement, useEffect, useMemo, useState} from "react"
import {fnPriceFormat} from "../../utils/price"
import {useIntl} from "react-intl"
import moment from 'moment'
import {fnFullName} from "../../utils/fullName"
import Link from "next/link"
import {useLang} from "../i18n/Metronici18n"
import {Obj} from "../../utils/types"
import _ from "lodash"
import {Button, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isMobileDevice} from "../../utils/metronic/_utils"
import {faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import {useRouter} from "next/router";
import {TableNoData} from "./tableNoData";
import {BlankRow} from "./blankRow";
import {TableLoading} from "./tableLoading";

type propsTable = {
    orders: any, //TODO: declare this
    loading?: boolean,
    submitHandleSort: Function,
}

export const listColorStatus = [
    {value: 'P', label: "#33B44A"},
    {value: 'O', label: "#FAA51A"},
    {value: 'A', label: "#33B44A"},
    {value: 'E', label: "#33B44A"},
    {value: 'G', label: "#33B44A"},
    {value: 'H', label: "#33B44A"},
    {value: 'C', label: "#33B44A"},
    {value: 'F', label: "#EB5757"},
    {value: 'D', label: "#EB5757"},
    {value: 'I', label: "#EB5757"},
    {value: 'B', label: "#33B44A"}
]

const OrderTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const lang: string = useLang() ?? "vi"
    const {orders, loading, submitHandleSort } = {...props}
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const[data, setData] = useState<Obj[]>([])
    const header = [
        {id: 'order_nr', label: intl.formatMessage({id: 'LANGUAGE.ORDER_NUMBER'})},
        {id: 'firstname', label: intl.formatMessage({id: 'LANGUAGE.FULL_NAME'})},
        {id: 'total', label: intl.formatMessage({id: 'LANGUAGE.TOTAL_PRICE'})},
        {id: 'date', label: intl.formatMessage({id: 'LANGUAGE.ORDER_DATE'})},
        {id: 'status', label: intl.formatMessage({id: 'LANGUAGE.STATUS'})},
        {id: 'payment_status', label: intl.formatMessage({id: 'LANGUAGE.PAYMENT_METHODS'})},
    ]
    const list_status = useMemo(() => [
        {value: 'P', label: intl.formatMessage({id: 'LANGUAGE.PAID'})},
        {value: 'O', label: intl.formatMessage({id: 'LANGUAGE.WAITING_CONFIRM'})},
        {value: 'A', label: intl.formatMessage({id: 'LANGUAGE.CONFIRMED'})},
        {value: 'E', label: intl.formatMessage({id: 'LANGUAGE.PACKING'})},
        {value: 'G', label: intl.formatMessage({id: 'LANGUAGE.HANDED_OVER_AND_SHIPPED'})},
        {value: 'H', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY'})},
        {value: 'C', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY_SUCCESSFUL'})},
        {value: 'F', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY_FAILED'})},
        {value: 'D', label: intl.formatMessage({id: 'LANGUAGE.CANCELLED_BY_SELLER'})},
        {value: 'I', label: intl.formatMessage({id: 'LANGUAGE.CANCELLED_BY_CUSTOMER'})},
        {value: 'B', label: intl.formatMessage({id: 'LANGUAGE.RETURNS'})}
    ], [intl])

    let _list_status: any = {}
    list_status.forEach(s => {
        _list_status[`${s.value}`] = s.label
    })
    let _listColorStatus: any = {}
    listColorStatus.forEach(s => {
        _listColorStatus[`${s.value}`] = s.label
    })

    /* Function Sort Table Head Start */
    const [sortTotal, setSortTotal] = useState('any')
    const [sortTimeStamp, setSortTimeStamp] = useState('any')
    const router = useRouter()
    useEffect(() => {
        if (router.isReady) {
            let {
                sort_by,
                sort_order
            } = router.query
            /* Check Url Browser Set Active for SortBy And SortOrder Start */
            if (sort_by == 'total'){
                setSortTimeStamp('any')
                if (sort_order === 'desc') setSortTotal('false')
                if (sort_order === 'asc') setSortTotal('true')
            }
            if (sort_by == 'date'){
                setSortTotal('any')
                if(sort_order === 'desc') setSortTimeStamp('false')
                if (sort_order === 'asc') setSortTimeStamp('true')
            }
            /* Check Url Browser Set Active for SortBy And SortOrder End */
        }
    }, [router.isReady, router.query])

    const onsubmitHandleSort = (sort_by?: string, sort_order?: string) => {
        if (sort_by == 'total'){
            setSortTimeStamp('any')
            if (sort_order === 'desc') setSortTotal('false')
            if (sort_order === 'asc') setSortTotal('true')
        }
        if (sort_by == 'date'){
            setSortTotal('any')
            if(sort_order === 'desc') setSortTimeStamp('false')
            if (sort_order === 'asc') setSortTimeStamp('true')
        }
        submitHandleSort(
            {
                sort_by: sort_by,
                sort_order: sort_order
            }
        )
    }

    /* Function Sort Table Head End */
    const tableHeader = useMemo(() => header.map(order_props => {
        return (
            <th key={`th-${order_props.label}`} scope="col" className='w-md-100px' >
                {/* Sort Total Start  */}
                {order_props.id === 'total' ? <div style={{display:"flex",alignItems:"center"}}>{order_props.label}
                    <div className="ms-1 icon-sort"><FontAwesomeIcon className={`icon1 ${sortTotal == "true" || sortTotal == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                        order_props.id,
                        'desc'
                )} icon={faArrowUp} /> <FontAwesomeIcon className={`icon2 ${sortTotal == "false" || sortTotal == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                        order_props.id,
                        'asc'
                    )}icon={faArrowDown} />
                    </div></div> : order_props.id === 'date' ? '' : order_props.label }
                {/* Sort Total End */}

                {/* Sort Date Start  */}
                {order_props.id === 'date' ? <div style={{display:"flex",alignItems:"center"}}>{order_props.label}
                    <div className="ms-1 icon-sort"><FontAwesomeIcon className={`icon1 ${sortTimeStamp == "true" || sortTimeStamp == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                        order_props.id,
                        'desc'
                    )} icon={faArrowUp} /><FontAwesomeIcon className={`icon2 ${sortTimeStamp == "false" || sortTimeStamp == "any" ? "active" : ""}`}  onClick={()=>onsubmitHandleSort(
                        order_props.id,
                        'asc'
                    )}icon={faArrowDown} />
                    </div></div> : '' }
                {/* Sort Date End */}
            </th>)
    }), [header])
    const tableHeaderMobile = useMemo(() => header.map(order_props => {
        return (
            <th key={`th-${order_props.label}`} scope="col" className='min-w-150px'>
                {order_props.label}
            </th>)
    }), [header])
    const noData = useMemo(() => {
        return (
            <tr>
                <td colSpan={header.length}>
                    <div className={'d-flex justify-content-center mt-10 mb-10'}>
                    <span className="indicator-progress" style={{display: 'block'}}>
                        No data
                    </span>
                    </div>
                </td>
            </tr>
        )
    }, [])

    useEffect(() => {
        if (orders) {
            let elm: ReactElement[] = []
            Object.values(orders).forEach((order: any) => {
                if (!_.isNil(order)) {
                    elm.push(
                        <tr key={`tr-${order.order_id}`}>
                            <td>
                                <Link href={`/orders/${order.order_nr}`}>
                                    <a className="text-primary">
                                        #{order.order_nr}
                                    </a>
                                </Link>
                            </td>
                            <td>
                                {fnFullName(order.firstname, order.lastname)}
                            </td>
                            <td>
                                {fnPriceFormat(order.total)}
                            </td>
                            <td>
                                {moment.unix(order.timestamp).format(lang === "vi" ? "DD/MM/YYYY HH:mm" : "MM/DD/YYYY HH:mm")}
                            </td>
                            <td>
                                <span
                                    style={{color: _listColorStatus[order.status]}}>{_list_status[order.status]}</span>
                            </td>
                            <td>
                                {order.payment}
                            </td>
                        </tr>
                    )
                }
            })
            setData(elm)
        }
    }, [orders])


    return (<div className="table-responsive table-loading">
            {loading && (
                <TableLoading/>
            )}

            <table className="table table-row-bordered table-row-dashed align-middle fw-bolder dataTable4">
                <thead className={'fs-7 text-gray-400'}>
                <tr>
                    {!isMobile ? tableHeader : tableHeaderMobile}
                </tr>
                </thead>
                <tbody className="fs-7 border-top-0">
                {(!loading && data.length > 0) ? data : (loading) ?
                    <BlankRow colSpan={header.length}/> : <TableNoData colSpan={header.length}/>  }
                </tbody>
            </table>

        </div>
    )
}

export {OrderTable}
