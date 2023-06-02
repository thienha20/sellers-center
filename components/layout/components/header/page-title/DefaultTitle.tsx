import clsx from 'clsx'
import React, {FC} from 'react'
import Link from "next/link";
import {useLayout} from '../../../core/LayoutProvider'
import {usePageData} from '../../../core/PageData'
import {KTSVG} from "../../../../images/KTSVG"
import {useIntl} from "react-intl"

const DefaultTitle: FC = () => {
    const {pageTitle, pageDescription, pageBreadcrumbs} = usePageData()
    const {config, classes} = useLayout()
    const intl = useIntl()
    return (
        <div
            id='kt_page_title'
            className={clsx('page-title d-flex', classes.pageTitle.join(' '))}
        >
            {/* begin::Title */}
            {pageTitle && (
                <h1 className='d-flex align-items-center text-dark fw-bolder my-1 fs-3'>
                    {pageTitle}
                    {pageDescription && config.pageTitle && config.pageTitle.description && (
                        <>
                            <span className='h-20px border-gray-200 border-start ms-3 mx-2'></span>
                            <small className='text-muted fs-7 fw-bold my-1 ms-1'>{pageDescription}</small>
                        </>
                    )}
                </h1>
            )}
            {/* end::Title */}

            {pageBreadcrumbs &&
            config.pageTitle &&
            config.pageTitle.breadCrumbs && (
                <>
                    {config.pageTitle.direction === 'row' && (
                        <span className='h-20px border-gray-200 border-start mx-4'></span>
                    )}
                    <ul className='breadcrumb breadcrumb-separatorless fw-bold fs-6 my-1'>
                        <li className={"breadcrumb-item"}>
                            {pageBreadcrumbs.length > 0 ?
                                <Link href={"/"}>
                                    <a className='text-muted text-hover-primary me-4'>
                                        <KTSVG
                                            path='/media/icons/duotune/general/gen001.svg'
                                            className={"svg-icon-2 p-1"}
                                        />
                                        {intl.formatMessage({id: 'MENU.DASHBOARD'})}
                                    </a>
                                </Link> : <span className='text-dark'>
                                    <KTSVG
                                        path='/media/icons/duotune/general/gen001.svg'
                                        className={"svg-icon-2 p-2"}
                                    />
                                    {intl.formatMessage({id: 'MENU.DASHBOARD'})}
                                </span>}
                        </li>
                        {Array.from(pageBreadcrumbs).map((item, index) => (
                            <li
                                className={clsx('breadcrumb-item', {
                                    'text-dark': !item.isSeparator && item.isActive,
                                    'text-muted': !item.isSeparator && !item.isActive,
                                })}
                                key={`${item.path}${index}`}
                            >
                                {!item.isSeparator ? (
                                    item.path ? <Link href={item.path}>
                                        <a className='text-muted text-hover-primary me-4'>
                                            {item.icon && <KTSVG
                                                path={item.icon}
                                                className='svg-icon-2 p-1'
                                            />}
                                            {item.title}
                                        </a>
                                    </Link> : <>
                                        {item.icon && <KTSVG
                                            path={item.icon}
                                            className='svg-icon-2 p-1'
                                        />}{item.title}
                                    </>
                                ) : (
                                    <span className='bullet bg-gray-200 w-5px h-2px'></span>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export {DefaultTitle}
