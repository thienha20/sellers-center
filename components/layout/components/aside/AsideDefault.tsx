/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import clsx from 'clsx'
import {useLayout} from '../../core'
import {AsideMenu} from './AsideMenu'
import {toAbsoluteUrl} from "../../../../utils/url";
import {KTSVG} from "../../../images/KTSVG";
import Link from "next/link";
import Image from 'next/image'

const AsideDefault: FC = () => {
    const {config, classes} = useLayout()
    const {aside} = config

    return (
        <div
            id='kt_aside'
            className={clsx('aside', classes.aside.join(' '))}
            data-kt-drawer='true'
            data-kt-drawer-name='aside'
            data-kt-drawer-activate='{default: true, lg: false}'
            data-kt-drawer-overlay='true'
            data-kt-drawer-width="{default:'200px', '300px': '250px'}"
            data-kt-drawer-direction='start'
            data-kt-drawer-toggle='#kt_aside_mobile_toggle'
        >
            {/* begin::Brand */}
            <div className='aside-logo flex-column-auto' id='kt_aside_logo'>
                {/* begin::Logo */}

                    <Link href='/'>
                        <a>
                            <Image alt='Logo' src={toAbsoluteUrl('/media/logos/tatmart_kt4t-uu.png')} width={128} height={53}/>
                        </a>
                    </Link>

                {/* end::Logo */}

                {/* begin::Aside toggler */}
                {aside.minimize && (
                    <div
                        id='kt_aside_toggle'
                        className='btn btn-icon w-auto px-0 btn-active-color-primary aside-toggle'
                        data-kt-toggle='true'
                        data-kt-toggle-state='active'
                        data-kt-toggle-target='body'
                        data-kt-toggle-name='aside-minimize'
                    >
                        <KTSVG
                            path={'/media/icons/duotune/arrows/arr080.svg'}
                            className={'svg-icon-1 rotate-180'}
                        />
                    </div>
                )}
                {/* end::Aside toggler */}
            </div>
            {/* end::Brand */}

            {/* begin::Aside menu */}
            <div className='aside-menu flex-column-fluid'>
                <AsideMenu asideMenuCSSClasses={classes.asideMenu}/>
            </div>
            {/* end::Aside menu */}

            {/* begin::Footer */}
          {/*  <div className='aside-footer flex-column-auto pt-5 pb-7 px-5' id='kt_aside_footer'>*/}
          {/*      <Link href={process.env.REACT_APP_PREVIEW_DOCS_URL ?? "/"} passHref>*/}
          {/*          <a*/}
          {/*              target='_blank'*/}
          {/*              className='btn btn-custom btn-primary w-100'*/}
          {/*              data-bs-toggle='tooltip'*/}
          {/*              data-bs-trigger='hover'*/}
          {/*              data-bs-dismiss-='click'*/}
          {/*              title='Check out the complete documentation with over 100 components'*/}
          {/*          >*/}
          {/*              <span className='btn-label'>Docs & Components</span>*/}
          {/*              <span className='svg-icon btn-icon svg-icon-2'>*/}
          {/*  <KTSVG path='/media/icons/duotune/general/gen005.svg'/>*/}
          {/*</span>*/}
          {/*          </a>*/}
          {/*      </Link>*/}
          {/*  </div>*/}
            {/* end::Footer */}
        </div>
    )
}

export {AsideDefault}
