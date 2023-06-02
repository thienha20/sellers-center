import Head from 'next/head'
import styles from '../../assets/styles/modules/orders.module.scss'
import React, {ReactElement, ReactNode} from "react"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../utils/url"
import {NextPageWithLayout} from "../../utils/types";

const Detail: NextPageWithLayout = () => {
  return (
      <div className={styles.container}>
        <Head>
          <title>...</title>
          <meta name="description" content="Orders"/>
          <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
        </Head>
        noi dung ....
      </div>
  )
}

// @ts-ignore
Detail.getLayout = (page: ReactElement): ReactNode => {
  return (<MasterLayout>{page}</MasterLayout>)
}

export default Detail
