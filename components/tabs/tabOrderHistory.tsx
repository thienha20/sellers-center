import React, {useEffect, useState} from "react";
import {useIntl} from "react-intl";
import {useRouter} from "next/router";
import {Button} from "react-bootstrap";

type propsTabOrder = {
    link?: string,
    submitLinkOrderStatus: Function,
    tabCurrent?: string | string[]
}

const TabOrderHistory: (props: propsTabOrder) => JSX.Element = (props: propsTabOrder) => {
    const intl = useIntl()
    let router = useRouter()
    const {submitLinkOrderStatus, link, tabCurrent} = {...props}
    const [tab, setTab] = useState<string | string[]>(tabCurrent ?? '')

    useEffect(() => {
        if (tabCurrent) {
            setTab(tabCurrent);
        }
    }, [tabCurrent])

    return (
        <>
            <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder'>
                <li className='nav-item me-3'><Button
                    className={`btn btn-sm btn-light-primary ${!tab || tab == '' ? 'active' : ''}`}
                    onClick={() => {
                        submitLinkOrderStatus({tab_order: ''})
                        setTab('')
                        // history.replaceState(null, 'title', link);
                        router.push(link ?? "/")
                    }}>{intl.formatMessage({id: 'LANGUAGE.GENERAL'})}</Button>
                </li>
                <li className='nav-item'>
                    <Button className={`btn btn-sm btn-light-primary ${tab == 'order_history' ? 'active' : ''}`}
                       onClick={() => {
                           submitLinkOrderStatus({tab_order: 'order_history'})
                           setTab('order_history')
                           router.push(link + '?tab_order=order_history')
                           // history.replaceState(null, 'title', link + '?tab_order=order_history');
                       }}>{intl.formatMessage({id: 'ORDER.ORDER_HISTORY'})}</Button>
                </li>
            </ul>
        </>
    );
}

export {TabOrderHistory}
