import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect} from "react"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../utils/url"
import {NextPageWithLayout} from "../../utils/types"
import {useIntl} from "react-intl";
import ProfileBlock from "../../components/blocks/user/profile"
import {usePageData} from "../../components/layout/core";

const Detail: NextPageWithLayout = () => {
    const intl = useIntl()
    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id:"AUTH.GENERAL.PROFILE"}),
                isActive: true
            }
        ])
    }, [])
    return (
      <>
        <Head>
          <title>{intl.formatMessage({id:"AUTH.GENERAL.PROFILE"})}</title>
          <meta name="description" content={intl.formatMessage({id:"AUTH.GENERAL.PROFILE"})} />
          <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
        </Head>
          <ProfileBlock />
      </>
  )
}

Detail.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Detail
