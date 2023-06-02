import React, {useMemo, useState} from "react"
import {useIntl} from "react-intl"
import {Button} from "react-bootstrap"
import {fnListOrderStatus} from "../../utils/string"
import {Obj} from "../../utils/types"
import {isMobile} from 'react-device-detect'

type propsTabOrder = {
    order_status?: string | null | undefined | string[],
    submitLinkStatus?: Function
    haveBottom?: boolean
}

const TabOrderDashboard: (props: propsTabOrder) => JSX.Element = (props: propsTabOrder) => {
    const intl = useIntl()
    const {submitLinkStatus, order_status, haveBottom} = {...props}
    const [orderStatus, setOrderStatus] = useState<string | string[]>(order_status ?? "")

    const listOrderStatus: Obj[] = useMemo(() => fnListOrderStatus(intl), [intl])

    const tab_status = listOrderStatus.map((strStatus, index) => {
        return (
            <li className={`nav-item me-3 ${(isMobile || haveBottom) && "mb-3"}`} key={`tab-${index}`}>
                <Button
                    className={`btn-sm btn-light-primary ${orderStatus == strStatus.value ? 'active' : ''}`}
                    onClick={() => {
                        setOrderStatus(strStatus.value)
                        if (submitLinkStatus) {
                            submitLinkStatus(strStatus.value)
                        }
                    }}>{strStatus.label}</Button>
            </li>)
    })
    return (
        <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex">
            <li className={`nav-item me-3 ${(isMobile || haveBottom) && "mb-3"}`}><Button
                className={`btn-sm btn-light-primary ${orderStatus == undefined || orderStatus == '' ? 'active' : ''}`}
                onClick={() => {
                    if (submitLinkStatus) {
                        submitLinkStatus('')
                    }
                    setOrderStatus('')
                }}>{intl.formatMessage({id: 'LANGUAGE.ALL'})}</Button>
            </li>
            {tab_status}
        </ul>
    )
}

export {TabOrderDashboard}
