import {useIntl} from "react-intl";
import React, {ReactElement, ReactNode, useEffect} from "react"
import {NextPageWithLayout} from "../../../utils/types";
import {MasterLayout} from "../../../components/layout/MasterLayout";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight, fas} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import VendorGroupPermission from "../../../components/blocks/user/vendorGroupPermission";
import styles from "../../../assets/styles/modules/products.module.scss";
import Head from "next/head";
import {toAbsoluteUrl} from "../../../utils/url";
import {usePageData} from "../../../components/layout/core";
import {useDispatch} from "react-redux";

library.add(fas, faCheckSquare, faChevronRight, faSquareMinus)

const Index: NextPageWithLayout = () => {
    const intl = useIntl()
    const dispatch = useDispatch()

    const {setPageBreadcrumbs} = usePageData()

    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "USER.MANAGE_ROLES"}),
                path: "/users/vendor_group_permission"
            },
            {
                title: intl.formatMessage({id: "USER.PERMISSION_ADD"}),
                isActive: true
            }
        ])
    }, [])
    // @ts-ignore
    return (
        <div className={styles.container}>
            <Head>
                <title>{intl.formatMessage({id: 'USER.PERMISSION_ADD'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'USER.PERMISSION_ADD'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <VendorGroupPermission />
        </div>
    )
}


Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index

