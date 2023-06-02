/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import React, {FC} from 'react'
import {useLang, setLanguage} from '../../../i18n/Metronici18n'
import {toAbsoluteUrl} from "../../../../utils/url";
import Image from 'next/image'
import Link from "next/link";
import {KTSVG} from "../../../images/KTSVG";

type Lang = {
    lang: string
    name: string
    flag: string
}

const languages: Lang[] = [
    {
        lang: 'vi',
        name: 'Vietnamese',
        flag: '/media/flags/vietnam.svg' as string,
    },
    {
        lang: 'en',
        name: 'English',
        flag: '/media/flags/united-states.svg' as string,
    },
]

const Languages: FC = () => {
    let lang = useLang()
    lang = lang ?? "vi"
    let currentLanguage = languages.find((x) => x.lang === lang)
    currentLanguage = currentLanguage ?? languages[0]
    let toolbarButtonIconSizeClass = 'svg-icon-1'
    return (
        <div
            className={clsx('d-flex align-items-center')}
            id='kt_header_language_menu_toggle'
        >
            <div
                className={clsx('cursor-pointer symbol btn btn-icon btn-active-light-primary')}
                data-kt-menu-trigger='click'
                data-kt-menu-attach='parent'
                data-kt-menu-placement='bottom-end'
                data-kt-menu-flip='bottom'
            >
                <KTSVG
                    path={currentLanguage?.flag}
                    className={toolbarButtonIconSizeClass}
                    svgClassName={"rounded-circle"}
                />
            </div>
            <div className='menu menu-sub menu-sub-dropdown w-175px py-4' data-kt-menu='true'>
                {languages.map((l) => (
                    <div
                        className='menu-item px-3'
                        key={l.lang}
                        onClick={() => {
                            if(l.lang === currentLanguage?.lang) return false
                            setLanguage(l.lang)
                        }}
                    >
                       <a className={clsx('menu-link d-flex px-5', {"lang-active": l.lang === currentLanguage?.lang})}>
                                    <span className='symbol symbol-20px me-4'>
                                       <KTSVG
                                           path={l.flag}
                                           className={toolbarButtonIconSizeClass}
                                           svgClassName={"rounded-circle"}
                                       />
                                    </span>
                           {l.name}
                       </a>
                    </div>
                ))}
            </div>

        </div>
    )
}

export {Languages}
