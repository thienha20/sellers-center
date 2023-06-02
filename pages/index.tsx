import Head from 'next/head'
import type {ReactElement, ReactNode} from 'react'
import React, {useEffect, useMemo, useState} from "react"
import {MasterLayout} from "../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../utils/url"
import {NextPageWithLayout} from "../utils/types"
import {useIntl} from "react-intl"
import {LatestOrders} from "../components/wigets/LatestOrders"
import {LatestB2bOrders} from "../components/wigets/LatestB2bOrders"
import {GraphicToDayOrders} from "../components/wigets/GraphicToDayOrders"
import {GraphicWeekOrders} from "../components/wigets/GraphicWeekOrders"
import {usePageData} from "../components/layout/core"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../redux/reducers"
import {checkRouterPermission} from "../utils/permission"
import CryptoJS from "crypto-js"
import {useRouter} from "next/router"

const Index: NextPageWithLayout = () => {
    const intl = useIntl()
    const Router = useRouter()
    const {setPageBreadcrumbs} = usePageData()
    const [orderPermission, setOrderPermission] = useState<boolean>(false)
    const [orderB2bPermission, setOrderB2bPermission] = useState<boolean>(false)
    const [reportPermission, setReportPermission] = useState<boolean>(false)
    let user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    let userPermission = useMemo(() => {
        try {
            if (user && (user.permission === null || user.permission === "")) return null
            let rs = CryptoJS.AES.decrypt(user.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(rs)
        } catch (e) {
            return false
        }
    }, [user])

    useEffect(() => {
        if (userPermission && !checkRouterPermission("/", userPermission)) {
            Router.push("/companies")
        } else {
            setOrderPermission(checkRouterPermission("/orders", userPermission))
            setOrderB2bPermission(checkRouterPermission("/orders/b2b", userPermission))
            setReportPermission(checkRouterPermission("/reports", userPermission))
        }
    }, [userPermission])

    useEffect(() => {
        setPageBreadcrumbs([])
    }, [])
    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'MENU.DASHBOARD'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            {reportPermission && <GraphicToDayOrders/>}
            {orderPermission && orderB2bPermission ? <div className={"row"}>
                <div className={"col-xl-6"}><LatestOrders/></div>
                <div className={"col-xl-6"}><LatestB2bOrders/></div>
            </div> : orderPermission ? <LatestOrders/> : orderB2bPermission && <LatestB2bOrders/>}
            {reportPermission && <GraphicWeekOrders/>}
            {(!reportPermission && !orderPermission) && <div>

            </div>}
        </>
    )
}

Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
