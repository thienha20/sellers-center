/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import React, {useEffect} from 'react'
import {useLayout} from '../../core'
import {Header} from './Header'
import {DefaultTitle} from './page-title/DefaultTitle'
import {Topbar} from './Topbar'
import {MenuComponent} from "../../../../utils/metronic/components";
import {KTSVG} from "../../../images/KTSVG";
import {toAbsoluteUrl} from "../../../../utils/url";
import Link from "next/link";
import Image from 'next/image'
import {useRouter} from "next/router";

export function HeaderWrapper() {
    const {asPath} = useRouter()
    const {config, classes, attributes} = useLayout()
    const {header, aside} = config

    useEffect(() => {
        MenuComponent.reinitialization()
    }, [asPath])

    return (
        <div
            id='kt_header'
            className={clsx('header', classes.header.join(''), 'align-items-stretch')}
            {...attributes.headerMenu}
        >
            <div
                className={clsx(
                    classes.headerContainer.join(' '),
                    'container-fluid d-flex align-items-stretch justify-content-between'
                )}
            >
                {/* begin::Aside mobile toggle */}
                {aside.display && (
                    <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
                        <div
                            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
                            id='kt_aside_mobile_toggle'
                        >
                            <KTSVG path='/media/icons/duotune/abstract/abs015.svg' className='svg-icon-2x mt-1'/>
                        </div>
                    </div>
                )}

                {/* begin::Logo */}
                {!aside.display && (
                    <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
                        <Link href='/'>
                            <a className='d-lg-none'>
                                <Image alt='Logo' src={toAbsoluteUrl('/media/logos/tatmart_kt4t-uu.png')}
                                       className='h-45px'
                                       width={90} height={40}/>
                            </a>
                        </Link>
                    </div>
                )}
                {/* end::Logo */}
                {aside.display && (
                    <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
                        <Link href='/'>
                            <a className='align-items-center d-lg-none' style={{margin: "0 auto"}}>
                                <Image alt='Logo'
                                       src={toAbsoluteUrl('/media/logos/tatmart_kt4t-uu.png')}
                                       className='h-45px'
                                       width={90}
                                       height={40}/>
                            </a>
                        </Link>
                    </div>
                )}

                {/* begin::Wrapper */}
                <div className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
                    {header.left === 'menu' && (
                        <div className='d-flex align-items-stretch' id='kt_header_nav'>
                            <Header/>
                        </div>
                    )}

                    {header.left === 'page-title' && (
                        <div className='d-flex align-items-center' id='kt_header_nav'>
                            <DefaultTitle/>
                        </div>
                    )}

                    <div className='d-flex align-items-stretch flex-shrink-0'>
                        <Topbar/>
                    </div>
                </div>
            </div>
        </div>
    )
}
