import React from 'react'
import clsx from 'clsx'
import Link from "next/link";
import {useRouter} from 'next/router'
import {useLayout} from '../../core'
import {KTSVG} from "../../../images/KTSVG";
import {checkIsActive} from "../../../../utils/url";

type Props = {
    to: string
    title: string
    icon?: string
    fontIcon?: string
    hasBullet?: boolean
}

const AsideMenuItem: React.FC<Props> = ({
                                            children,
                                            to,
                                            title,
                                            icon,
                                            fontIcon,
                                            hasBullet = false,
                                        }) => {
    const {asPath} = useRouter()
    const isActive = checkIsActive(asPath, to)
    const {config} = useLayout()
    const {aside} = config

    return (
        <div className='menu-item fs-7'>
            <Link href={to}>
                <a className={clsx('menu-link without-sub', {active: isActive})}>
                    {hasBullet && (
                        <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
                    )}
                    {icon && aside.menuIcon === 'svg' && (
                        <span className='menu-icon'>
            <KTSVG path={icon} className='svg-icon-2'/>
          </span>
                    )}
                    {fontIcon && aside.menuIcon === 'font' && <i className={clsx('bi fs-3', fontIcon)}></i>}
                    <span className='menu-title'>{title}</span>
                </a>
            </Link>
            {children}
        </div>
    )
}

export {AsideMenuItem}
