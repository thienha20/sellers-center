import clsx from 'clsx'
import React from 'react'
import {PageLink, useLayout} from '../../core'
import {KTSVG} from "../../../images/KTSVG"
import {useIntl} from "react-intl"
import Link from 'next/link'

export type BreadcrumbParams = {
    breadcrumb?: PageLink[]
}
const Toolbar1: (properties: BreadcrumbParams) => JSX.Element = (props: BreadcrumbParams) => {
    const {classes} = useLayout()
    const {breadcrumb} = props
    const len: number = breadcrumb?.length ?? 0
    const intl = useIntl()
    return (
        <div className='toolbar'>
            <div className={clsx(classes.toolbarContainer.join(' '), 'page-title d-flex align-items-center flex-wrap me-3 mb-lg-0')}>
                {/*<h1 className="d-flex align-items-center text-dark fw-bolder fs-3 my-1">*/}
                {/*    {len > 0 && breadcrumb ? (breadcrumb[len - 1]?.title ?? intl.formatMessage({id: breadcrumb[len - 1]?.titleCode ?? ""})) : ""}*/}
                {/*</h1>*/}
                {/*{len > 0 ? <span className="h-20px border-gray-200 border-start mx-4"></span> : null}*/}
                <ul className="breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1">
                    <li className="breadcrumb-item">
                        <Link href={"/"}>
                            <a className='text-muted text-hover-primary me-4'>
                                <KTSVG
                                    path='/media/icons/duotune/general/gen001.svg'
                                    className={"svg-icon-2 p-1"}
                                />
                                {intl.formatMessage({id: 'MENU.DASHBOARD'})}
                            </a>
                        </Link>
                    </li>
                    {breadcrumb && breadcrumb.map((i: PageLink, ixd: number) =>
                        <li className="breadcrumb-item" key={`b${ixd}`}>
                            {ixd < (len - 1) ?
                                <Link href={i.path ?? "/"}>
                                    <a
                                        className='text-muted text-hover-primary me-4'
                                    >
                                        {i.icon && typeof i.icon === "string" ?
                                            <KTSVG
                                                path={i.icon}
                                                className='svg-icon svg-icon-2 p-1'
                                            />
                                            : null}
                                        {i.icon && typeof i.icon !== "string" ? i.icon : null}
                                        {i.title}
                                    </a>
                                </Link> : i.title
                            }
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export {Toolbar1}