import React, {useEffect, useState} from "react"
import {useIntl} from "react-intl"
import {Obj} from "../../utils/types"
import _ from "lodash"

type propsTabOrder = {
    tabAll?: boolean,
    options: Obj[], //TODO: Fix type [{value: ' ', label: ''}]
    defaultStatus?: string | null | undefined | string[],
    handleTab: Function,
    prefix?: string | number,  // custom object params { prefix : selected_value }
}

const TabList: (props: propsTabOrder) => JSX.Element = (props: propsTabOrder) => {
    const intl = useIntl()
    const {tabAll, handleTab, options, prefix, defaultStatus} = {...props}
    const [tabStatus, setTabStatus] = useState<string | string[]>("")
    const [widthUl, setWidthUl] = useState<number>(0)
    const paddingRight = 15

    useEffect(() => {
        let ul: HTMLUListElement | null = document.querySelector(".js-tab-bar")
        let li: HTMLCollection | undefined = ul?.children
        let w: number = 0
        if (li) {
            Array.from(li).forEach((item: Element) => {
                let computedStyle: CSSStyleDeclaration = getComputedStyle(item)
                w += parseFloat(computedStyle.width) + paddingRight
            })
            setWidthUl(w)
        }

    }, [options])

    useEffect(() => {
        setTabStatus(defaultStatus ?? "")
    }, [defaultStatus])

    const tab_status = options.map((strStatus: Obj, index: number) => {
        return !_.isEmpty(strStatus) ? (
            <li className={`nav-item me-3`} key={`tab-${index}`}>
                <button type={'button'}
                        className={`btn-sm btn-light-primary btn btn-primary ${tabStatus == strStatus.value ? 'active' : ''}`}
                        onClick={() => {
                            if (!_.isEmpty(prefix)) {
                                // @ts-ignore
                                handleTab({[prefix]: strStatus.value})
                            } else {
                                handleTab(strStatus.value)
                            }
                            setTabStatus(strStatus.value)
                        }}>{strStatus.label}</button>
            </li>) : ''
    })
    return (
        <div className="card mb-5 mb-xxl-8">
            <div className="card-body p-4">
                <div className={"scroll-x mw-100"} data-kt-scroll="true">
                    <ul className="js-tab-bar nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-6 fw-bolder"
                        style={{minWidth:"100%", width: widthUl}}>
                        {(!_.isNil(tabAll) || !_.isEmpty(tabAll)) ? '' : (<li className={`nav-item me-3`}>
                                <button type={'button'}
                                        className={`btn-sm btn-light-primary btn btn-primary ${tabStatus == undefined || tabStatus == '' ? 'active' : ''}`}
                                        onClick={() => {
                                            if (!_.isEmpty(prefix)) {
                                                // @ts-ignore
                                                handleTab({[prefix]: ''})
                                            } else {
                                                handleTab('')
                                            }
                                            setTabStatus('')
                                        }}>{intl.formatMessage({id: 'LANGUAGE.ALL'})}</button>
                            </li>
                        )}
                        {tab_status}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export {TabList}
