import Head from 'next/head'
import Image from 'next/image'
import styles from '../../../assets/styles/modules/products.module.scss'
import {toAbsoluteUrl} from "../../../utils/url"
import React, {ReactElement, ReactNode} from "react"
import {MasterLayout} from "../../../components/layout/MasterLayout"
import {NextPageWithLayout} from "../../../utils/types"

const Detail: NextPageWithLayout = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href={toAbsoluteUrl("/favicon.ico")} />
      </Head>

      noi dung
    </div>
  )
}

// @ts-ignore
Detail.getLayout = (page: ReactElement): ReactNode => {
  return (<MasterLayout>{page}</MasterLayout>)
}

export default Detail
