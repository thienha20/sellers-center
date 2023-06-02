import Head from 'next/head'
import {useIntl} from "react-intl";
import {useRouter} from "next/router";

import React, {ReactElement, ReactNode, useEffect, useState} from "react"
import _ from "lodash";
import {NextPageWithLayout} from "../../../utils/types";
import {useLang} from "../../../components/i18n/Metronici18n";
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../../utils/url";
import {MasterLayout} from "../../../components/layout/MasterLayout";
import styles from "../../../assets/styles/modules/products.module.scss";
import {Button} from "react-bootstrap";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faChevronRight, fas} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faSquareMinus} from '@fortawesome/free-regular-svg-icons';
import {Permission} from "../../../utils/permission";
import axios from "axios";
import allActions from "../../../redux/actions";
import VendorGroupPermission from "../../../components/blocks/user/vendorGroupPermission";
import {usePageData} from "../../../components/layout/core";

library.add(fas, faCheckSquare, faChevronRight, faSquareMinus)

const Index: NextPageWithLayout = () => {
    const intl = useIntl()

    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "USER.MANAGE_ROLES"}),
                path: "/users/vendor_group_permission"
            },
            {
                title: intl.formatMessage({id: "USER.PERMISSION_VIEW"}),
                isActive: true
            }
        ])
    }, [])
    // @ts-ignore
    return (
        <div className={styles.container}>

            <Head>
                <title>{intl.formatMessage({id: 'USER.PERMISSION_VIEW'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'USER.PERMISSION_VIEW'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <div className="">
                <VendorGroupPermission viewOnly={true}></VendorGroupPermission>
            </div>
        </div>
    )
}


Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index

