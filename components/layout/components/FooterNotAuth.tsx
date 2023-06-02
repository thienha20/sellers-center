/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from "react-intl"

const FooterNotAuth: FC = () => {
    const intl = useIntl()
    return (
        <div className='d-flex flex-center flex-column-auto p-10'>
            <div className='d-flex align-items-center fw-bold fs-6'>
                <a href='https://www.tatmart.com' className='text-muted text-hover-primary px-2'>
                    {intl.formatMessage({id: 'FOOTER.ABOUT'})}
                </a>
                <a href='mailto:support@tatmart.com' className='text-muted text-hover-primary px-2'>
                    {intl.formatMessage({id: 'FOOTER.CONTACT'})}
                </a>
                <a href='tel:1900299918' className='text-muted text-hover-primary px-2'>
                    {intl.formatMessage({id: 'FOOTER.HOTLINE'})}
                </a>
            </div>
        </div>
    )
}

export {FooterNotAuth}
