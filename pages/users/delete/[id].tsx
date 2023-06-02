import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect} from "react"
import {MasterLayout} from "../../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../../utils/url"
import {NextPageWithLayout} from "../../../utils/types"
import ProfileBlock from "../../../components/blocks/user/profile"
import {usePageData} from "../../../components/layout/core";
import {useIntl} from "react-intl";
// import {InferGetStaticPropsType} from "next"
// import { withIronSessionSsr } from "iron-session/next"
// import {sessionOptions} from "../../utils/iron-auth/session"

// export const getServerSideProps = withIronSessionSsr<{[key:string]:any}>(
//     async function getServerSideProps({ req }) {
//         return {
//             props: {
//                 user: req.session.user
//             }
//         }
//     }, sessionOptions
// )
// export const getStaticProps = async () => {
//     // const res = await fetch('https://.../data')
//     // const data: Data = await res.json()
//     //
//
//     return {
//         props: {
//             data: ["hello", "ban"],
//         },
//     }
//
// }

const Detail: NextPageWithLayout = () => {
    const intl = useIntl()
    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id:"USERS.DELETE"}),
                isActive: true
            }
        ])
    }, [])
    return (
      <>
        <Head>
          <title>User Management</title>
          <meta name="description" content="User Management"/>
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
