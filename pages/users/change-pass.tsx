import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect} from "react"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../utils/url"
import {NextPageWithLayout} from "../../utils/types"
import ChangePassBlock from "../../components/blocks/user/changePass"
import {useIntl} from "react-intl";
import {usePageData} from "../../components/layout/core"

const Detail: NextPageWithLayout = () => {
    const intl = useIntl()
    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id:"AUTH.GENERAL.CHANGE_PASS"}),
                isActive: true
            }
        ])
    }, [])
    return (
      <>
        <Head>
          <title>{intl.formatMessage({id:"AUTH.GENERAL.CHANGE_PASS"})}</title>
          <meta name="description" content={intl.formatMessage({id:"AUTH.GENERAL.CHANGE_PASS"})} />
          <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
        </Head>
         <ChangePassBlock />
      </>
  )
}

Detail.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Detail
