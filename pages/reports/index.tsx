import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect} from "react"
import {useIntl} from 'react-intl'
import {MasterLayout} from "../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../utils/url"
import {NextPageWithLayout} from "../../utils/types"
import {usePageData} from "../../components/layout/core";


//xử lý page cho view giao diện với các biến lấy từ hàm trên
const Index: NextPageWithLayout = () => {
    const intl = useIntl()
    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id:"LANGUAGE.REPORTS"}),
                isActive: true
            }
        ])
    }, [])
    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'LANGUAGE.REPORTS'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'LANGUAGE.REPORTS'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            noi dung ....
        </>
    )
}

Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
