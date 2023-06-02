/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useLayout} from '../core'
import {useIntl} from "react-intl"
import Link from 'next/link'

const Footer: FC = () => {
  const intl = useIntl()
  const {classes} = useLayout()
  return (
    <div className='footer py-4 d-flex flex-lg-column' id='kt_footer'>
      {/* begin::Container */}
      <div
        className={`${classes.footerContainer} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        {/* begin::Copyright */}
        <div className='text-dark order-2 order-md-1'>
          <span className='text-muted fw-bold me-2'>{new Date().getFullYear()} &copy;</span>
          <a href='#' className='text-gray-800 text-hover-primary'>
            Seller Center
          </a>
        </div>
        {/* end::Copyright */}

        {/* begin::Nav */}
        <ul className='menu menu-gray-600 menu-hover-primary fw-bold order-1'>
          <li className='menu-item'>
            <Link href={'https://www.tatmart.com/about.html'} passHref>
              <a target={'_blank'} className='menu-link ps-0 pe-2'>
                {intl.formatMessage({id: 'FOOTER.ABOUT'})}
              </a>
            </Link>
          </li>
          <li className='menu-item'>
            <a href={"mailto:support@tatmart.com"} className='menu-link pe-0 pe-2'>
              {intl.formatMessage({id: 'FOOTER.CONTACT'})}
            </a>
          </li>
          <li className='menu-item'>
            <a href='tel:1900299918' className='menu-link pe-0'>
              {intl.formatMessage({id: 'FOOTER.HOTLINE'})}
            </a>
          </li>
        </ul>
        {/* end::Nav */}
      </div>
      {/* end::Container */}
    </div>
  )
}

export {Footer}
