import React, {useEffect, useMemo, useState} from "react";
import {useIntl} from "react-intl";
import {Button} from "react-bootstrap";
import {useRouter} from "next/router";
import {fnListOrderStatus} from "../../utils/string";
import {Obj} from "../../utils/types";

type propsTabOrder = {
    order_status?: string | null | undefined | string[],
    submitLinkStatus: Function
}

const TabOrder: (props: propsTabOrder) => JSX.Element = (props: propsTabOrder) => {
    const intl = useIntl()
    let router = useRouter()
    const {submitLinkStatus} = {...props}
    const [orderStatus, setOrderStatus] = useState<string | string[]>("")

    useEffect(() => {
        let {order_status} = router.query
        setOrderStatus(order_status ?? "")
    }, [router.query, setOrderStatus])

    const listOrderStatus: Obj[] = useMemo(() => fnListOrderStatus(intl), [intl])

    const tab_status = listOrderStatus.map((strStatus, index) => {
        return (
            <li className='nav-item p-1 mb-2' key={`tab-${index}`}>
                <Button
                    className={`btn btn-light-primary ${orderStatus == strStatus.value ? 'active' : ''}`}
                    onClick={() => {
                        submitLinkStatus({order_status: strStatus.value})
                        setOrderStatus(strStatus.value)
                    }}>{strStatus.label}</Button>
            </li>)
    })
    return (
        <div className="mt-2">
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex'>
                <li className='nav-item p-1 mb-2'><Button
                    className={`btn btn-light-primary ${orderStatus == undefined || orderStatus == '' ? 'active' : ''}`}
                    onClick={() => {
                        submitLinkStatus({order_status: ''})
                        setOrderStatus('')
                    }}>{intl.formatMessage({id: 'LANGUAGE.ALL'})}</Button>
                </li>
                {tab_status}
            </ul>
        </div>
    );
}

export {TabOrder}
