import type {NextPage} from 'next'
import router from 'next/router'
import {toAbsoluteUrl} from '../utils/url'
import {useIntl} from 'react-intl'
import style from '../assets/styles/modules/error.module.scss'
import Head from "next/head";
import {FooterNotAuth} from "../components/layout/components/FooterNotAuth";
import Link from "next/link";
import Image from 'next/image'

const Custom404: NextPage = () => {
    // console.log(messages)
    const intl = useIntl()

    return (
        <div className='d-flex flex-column flex-root'>
            <Head>
                <title>{intl.formatMessage({id: 'ERROR.PAGE_NOT_FOUND'})}</title>
                <meta name="description" content="Page not found"/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
                <div className='d-flex flex-column flex-column-fluid text-center'>
                    <Link href='/'>
                        <a className={`mb-10 pt-lg-10 pb-lg-10 ${style.bgPink}`}>
                            <Image
                                alt='Logo'
                                src={toAbsoluteUrl('/media/logos/TATMart_Logo_M.svg')}
                                className='h-50px'
                                width={207} height={60}
                            />
                        </a>
                    </Link>
                    <div className='pt-lg-10 mb-10'>
                        <h1 className='fw-bolder fs-4x text-gray-700 mb-10'>{intl.formatMessage({id: 'ERROR.PAGE_NOT_FOUND'})}</h1>

                        <div className='fw-bold fs-3 text-gray-400 mb-15'>
                            {intl.formatMessage({id: 'ERROR.PAGE_YOU_LOOKED_NOT_FOUND'})}
                        </div>

                        <div className='text-center'>
                            <Link href="/">
                                <a className='btn btn-lg btn-primary fw-bolder'>
                                    {intl.formatMessage({id: 'ERROR.GO_TO_HOME'})}
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div
                        className='
                              d-flex
                              flex-row-auto
                              bgi-no-repeat
                              bgi-position-x-center
                              bgi-size-contain
                              bgi-position-y-bottom
                              min-h-100px min-h-lg-350px
                            '
                        style={{
                            backgroundImage: `url('${toAbsoluteUrl('/media/illustrations/sketchy-1/17.png')}')`,
                        }}
                    ></div>
                </div>
                <FooterNotAuth/>
            </div>
        </div>
    )
}
export default Custom404