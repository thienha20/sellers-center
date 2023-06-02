import React, {useMemo} from "react";
import {fnPriceFormat} from "../../utils/price";
import {useIntl} from "react-intl";
import moment from 'moment'
import {fnFullName} from "../../utils/fullName";
import Link from "next/link"
import {useLang} from "../i18n/Metronici18n";
import {Obj} from "../../utils/types";
import {listColorStatus} from "./orderTable"

type propsTable = {
    orders?: Obj[]
}

const OrderTableDashboard: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const lang: string = useLang() ?? "vi"
    const {orders} = {...props}
    const header = useMemo(() => [
        intl.formatMessage({id: 'LANGUAGE.ORDER_NUMBER'}),
        intl.formatMessage({id: 'LANGUAGE.FULL_NAME'}),
        intl.formatMessage({id: 'LANGUAGE.ORDER_DATE'}),
        intl.formatMessage({id: 'LANGUAGE.TOTAL_PRICE'}),
        intl.formatMessage({id: 'LANGUAGE.STATUS'})
    ], [intl])

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

    let _listColorStatus: Obj = {}
    listColorStatus.forEach(s => {
        _listColorStatus[`${s.value}`] = s.label
    })

    const tableHeader = header.map(order_props => {
        return (
            <th key={`th-${order_props}`} scope="col">
                {order_props}
            </th>)
    })

    const showStatus = (status: string) => {
        let label = ""
        list_status.forEach((item:{value: string, label:string}, index: number) => {
            if(item.value === status){
                label = item.label
            }
        })
        return label
    }

    const data = orders && orders.map((order: any) => {
        return (
            <tr key={`tr-${order.order_id}`}>
                <td>
                    <Link href={`/orders/${order.order_nr}`}>
                        <a className="text-primary fw-bold text-hover-primary fs-6">
                            #{order.order_nr}
                        </a>
                    </Link>
                </td>
                <td>
                    {fnFullName(order.firstname, order.lastname)}
                </td>
                <td>
                    {moment.unix(order.timestamp).format(lang === "vi" ? "DD/MM/YYYY HH:mm" : "MM/DD/YYYY HH:mm")}
                </td>
                <td>
                    <strong>{fnPriceFormat(order.total)}</strong>
                </td>
                <td>
                    <span style={{color: _listColorStatus[order.status]}}>{showStatus(order.status)}</span>
                </td>
            </tr>
        )
    })
    return (
        <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
            <thead>
            <tr className="fw-bolder text-muted">
                {tableHeader}
            </tr>
            </thead>
            <tbody>
            {data}
            </tbody>
        </table>
    );
}

export {OrderTableDashboard}
