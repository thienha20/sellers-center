import React, {ReactElement, useEffect, useState} from 'react'
import {AsideDefault} from './components/aside/AsideDefault'
import {Footer} from './components/Footer'
import {HeaderWrapper} from './components/header/HeaderWrapper'
import {ScrollTop} from './components/ScrollTop'
import {Content} from './components/Content'
import {MasterInit} from './MasterInit'
import {PageDataProvider, usePageData} from './core'
import {Toolbar} from './components/toolbar/Toolbar'
import {InviteUsers, Main} from '../partials'
import useUser from "../../utils/iron-auth/useUser"
import {fnUrl, getCurrentLink} from "../../utils/url"
import axios from "axios"
import {useDispatch} from "react-redux"
import allActions from '../../redux/actions'
import {isMobile} from 'react-device-detect'

type MasterProps = {
    children: ReactElement
}

const MasterLayout: (properties: MasterProps) => JSX.Element = ({children}: MasterProps) => {
    const dispatch = useDispatch()
    const [permission, setPermission] = useState<boolean>(false)
    useUser({
        redirectTo: `/login${getCurrentLink() !== "/" ? `?return_url=${encodeURIComponent(getCurrentLink())}` : ""}`,
        login: false,
        setPermission
    })
    const {pageBreadcrumbs} = usePageData()
    useEffect(() => {
        const getSecurityHash = async () => {
            if (dispatch) {
                return await axios.get(fnUrl("tat_commons.security_hash")).then(rs => {
                    dispatch(allActions.settings.securityHash(rs.data))
                })
            }
        }
        getSecurityHash().then(r => true)
    }, [dispatch])

    return (
        <PageDataProvider>
            {permission &&
                <div className='page d-flex flex-row flex-column-fluid'>
                    <AsideDefault/>
                    <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
                        <HeaderWrapper/>
                        <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
                            {isMobile && <Toolbar breadcrumb={pageBreadcrumbs ?? []}/>}
                            <div className='post d-flex flex-column-fluid'>
                                <Content>{children}</Content>
                            </div>
                        </div>
                        <Footer/>
                    </div>
                </div>
            }
            <Main/>
            <InviteUsers/>
            <MasterInit/>
            <ScrollTop/>
        </PageDataProvider>
    )
}

export {MasterLayout}
