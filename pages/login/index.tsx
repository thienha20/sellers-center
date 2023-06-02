import type {NextPage} from 'next'
import Head from 'next/head'
import useUser from "../../utils/iron-auth/useUser"
import {FooterNotAuth} from "../../components/layout/components/FooterNotAuth"
import {toAbsoluteUrl} from "../../utils/url"
import LoginBlock from "../../components/blocks/auth/login"
import Image from 'next/image'
import React, {useState} from "react"
import TwinSpin from '../../components/loading/TwinSpin'

const Index: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(true)

    useUser({
        redirectTo: "/",
        login: true,
        setLoading
    })

    return (<>
        {loading ? <TwinSpin color="#fc2f70" width="100px" height="100px" duration="3s"/> :
            <div
                className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
                <Head>
                    <title>TAT Seller Center - Login</title>
                    <meta name="description" content="Login"/>
                    <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
                </Head>
                {/* begin::Content */}
                <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
                    {/* begin::Logo */}
                    <a href='#' className={`mb-12 d-flex align-items-center`}>
                        <Image alt='Logo' src={toAbsoluteUrl('/media/logos/tatmart_kt4t-uu.png')} className='h-45px'
                               width={120} height={50}/> <span className={`text-dark fw-bolder fs-1`}>Seller Center</span>
                    </a>
                    {/* end::Logo */}
                    {/* begin::Wrapper */}
                    <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
                        <LoginBlock/>
                    </div>
                    {/* end::Wrapper */}
                </div>
                {/* end::Content */}
                {/* begin::Footer */}
                <FooterNotAuth/>
                {/* end::Footer */}
            </div>
        }
        </>
    )
}

export default Index
