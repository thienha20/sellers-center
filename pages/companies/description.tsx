import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect} from "react"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../utils/url"
import {NextPageWithLayout} from "../../utils/types"
import {useIntl} from "react-intl";
import DescriptionCompanyBlock from "../../components/blocks/company/description";
import {usePageData} from "../../components/layout/core";

const Description: NextPageWithLayout = () => {
    const intl = useIntl()
    const {setPageBreadcrumbs} = usePageData()

    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id:"LANGUAGE.COMPANY_INFO"}),
                path: "/companies",
                icon: "/media/icons/duotune/communication/com006.svg"
            },
            {
                title: intl.formatMessage({id:"LANGUAGE.DESCRIPTION"}),
                isActive: true
            }
        ])
    }, [])

    return (
        <>
            <Head>
                <title>{intl.formatMessage({id:"LANGUAGE.COMPANY_INFO"})}</title>
                <meta name="description" content={intl.formatMessage({id:"LANGUAGE.COMPANY_INFO"})} />
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <DescriptionCompanyBlock />
        </>
    )
}

Description.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Description
