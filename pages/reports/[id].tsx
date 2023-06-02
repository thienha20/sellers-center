import Head from 'next/head'
import style from '../../assets/styles/modules/orders.module.scss'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next'
import React, {ReactElement, ReactNode} from "react"
import {useIntl} from 'react-intl'
import {MasterLayout} from "../../components/layout/MasterLayout"
import {toAbsoluteUrl} from "../../utils/url"
import {NextPageWithLayout} from "../../utils/types"

//hàm lấy data từ server về để đổ vào props của page
type staticProps = {
    data?: string[]
}

export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: [
            {params: {id: '1'}},
            {params: {id: '2'}}
        ],
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    // const res = await fetch('https://.../data')
    // const data: Data = await res.json()
    //
    let rs: staticProps = {}
    rs.data = ["hello", "ban"]
    return {
        props: rs
    }

}

//xử lý page cho view giao diện với các biến lấy từ hàm trên
const Index: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
    const {data} = props
    const intl = useIntl()
    return (
        <div className={style.container}>
            <Head>
                <title>{intl.formatMessage({id: 'ORDER.MANAGE_ORDERS'})}</title>
                <meta name="description" content="Orders"/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            noi dung ....
            {data && data.map((i:string) => i)}
        </div>
    )
}

Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
