import React from 'react'
import Link from "next/link";
import {useRouter} from 'next/router'
import clsx from 'clsx'
import {checkIsActive} from "../../../../utils/url";
import {KTSVG} from "../../../images/KTSVG";

type Props = {
    to: string
    title: string
    icon?: string
    fontIcon?: string
    hasArrow?: boolean
    hasBullet?: boolean
}

const MenuItem: React.FC<Props> = ({
                                       to,
                                       title,
                                       icon,
                                       fontIcon,
                                       hasArrow = false,
                                       hasBullet = false,
                                   }) => {
    const {asPath} = useRouter()

    return (
        <div className='menu-item me-lg-1'>
            <Link
                href={to}
            >
                <a className={clsx('menu-link py-3', {
                    active: checkIsActive(asPath, to),
                })}>
                    {hasBullet && (
                        <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
                    )}

                    {icon && (
                        <span className='menu-icon'>
            <KTSVG path={icon} className='svg-icon-2'/>
          </span>
                    )}

                    {fontIcon && (
                        <span className='menu-icon'>
            <i className={clsx('bi fs-3', fontIcon)}></i>
          </span>
                    )}

                    <span className='menu-title'>{title}</span>

                    {hasArrow && <span className='menu-arrow'></span>}
                </a>
            </Link>
        </div>
    )
}

export {MenuItem}
