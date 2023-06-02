import {KTSVG} from "../../../images/KTSVG";
import Link from "next/link";
import React, {memo, useMemo} from "react";
import {Obj} from "../../../../utils/types";
import {useIntl} from "react-intl";
import {useRouter} from "next/router";
import Image from "next/image"

type OverParams = {
    companyData: Obj
}

const OverviewCompany: (properties: OverParams) => JSX.Element = (props: OverParams) => {
    const intl = useIntl()
    const router = useRouter()
    const {companyData} = {...props}

    const completion = useMemo<number>(() => {
        let complete: number = 0
        if (companyData.firstname && companyData.firstname != "") {
            complete += 5;
        }
        if (companyData.lastname && companyData.lastname != "") {
            complete += 5;
        }
        if (companyData.company && companyData.company != "") {
            complete += 10;
        }
        if (companyData.company_description && companyData.company_description != "") {
            complete += 5;
        }
        if (companyData.category_id && companyData.category_id != 0) {
            complete += 5;
        }
        if (companyData.address && companyData.address != "") {
            complete += 10;
        }
        if (companyData.county && companyData.county != "") {
            complete += 5;
        }
        if (companyData.city && companyData.city != "") {
            complete += 5;
        }
        if (companyData.state && companyData.state != "") {
            complete += 5;
        }
        if (companyData.email && companyData.email != "") {
            complete += 5;
        }
        if (companyData.phone && companyData.phone != "") {
            complete += 10;
        }
        if (companyData.tax_code && companyData.tax_code != "") {
            complete += 10;
        }
        if (companyData.logos) {
            complete += 10;
        }
        if (companyData.plan && companyData.plan != "") {
            complete += 10;
        }
        return complete
    }, [companyData])

    return (<div className='card'>
        <div className='card-body pt-9 pb-0'>
            <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
                <div className='me-7 mb-4'>
                    <div className='symbol symbol-100px symbol-lg-160px symbol-fixed position-relative'>
                        <Image src={companyData.logos?.theme?.image?.image_path ?? "/media/icons/duotune/art/art005.svg"} alt='logo' width={150} height={150}/>
                        <div
                            className='position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px'></div>
                    </div>
                </div>

                <div className='flex-grow-1'>
                    <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                        <div className='d-flex flex-column'>
                            <div className='d-flex align-items-center mb-2'>
                                            <span className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'>
                                                {companyData.company ?? ""}
                                            </span>
                                <KTSVG
                                    path='/media/icons/duotune/general/gen026.svg'
                                    className='svg-icon-1 svg-icon-primary'
                                />
                            </div>
                            <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                                            <span
                                                className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                                            >
                                                <KTSVG
                                                    path='/media/icons/duotune/general/gen018.svg'
                                                    className='svg-icon-4 me-1'
                                                />
                                                {companyData.address}, {companyData.county}, {companyData.city}, {companyData.state}, {companyData?.country ? companyData?.country_name[companyData?.country]?.country ?? "" : ""}
                                            </span>
                            </div>
                            <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                                            <span
                                                className='d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2'
                                            >
                                                <KTSVG
                                                    path='/media/icons/duotune/general/gen016.svg'
                                                    className='svg-icon-4 me-1'
                                                />
                                                <Link href={process.env.API_DOMAIN + "/shop/" + companyData.seo_name}
                                                      passHref={false}>
                                                    <a target={"_blank"}>{process.env.API_DOMAIN + "/shop/" + companyData.seo_name}</a>
                                                </Link>
                                            </span>

                            </div>
                        </div>
                    </div>

                    <div className='d-flex flex-wrap flex-stack'>
                        <div className='d-flex flex-column flex-grow-1 pe-8'>
                            <div className='d-flex flex-wrap'>
                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTSVG
                                            path='/media/icons/duotune/ecommerce/ecm007.svg'
                                            className='svg-icon-3 svg-icon-success me-2'
                                        />
                                        <div
                                            className='fs-2 fw-bolder'>{companyData.product_count ?? 0}</div>
                                    </div>

                                    <div
                                        className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: "PRODUCT.PRODUCT"})}</div>
                                </div>

                                <div
                                    className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3'>
                                    <div className='d-flex align-items-center'>
                                        <KTSVG
                                            path='/media/icons/duotune/abstract/abs034.svg'
                                            className='svg-icon-3 svg-icon-danger me-2'
                                        />
                                        <div className='fs-2 fw-bolder'>{companyData.plan ?? ""}</div>
                                    </div>

                                    <div
                                        className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: "LANGUAGE.VENDOR_PLAN"})}</div>
                                </div>


                            </div>
                        </div>
                        <div className='d-flex align-items-center w-200px w-sm-300px flex-column mt-3'>
                            <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                                            <span
                                                className='fw-bold fs-6 text-gray-400'>{intl.formatMessage({id: "LANGUAGE.PROFILE_COMPLETION"})}</span>
                                <span className='fw-bolder fs-6'>{completion}%</span>
                            </div>
                            <div className='h-5px mx-3 w-100 bg-light mb-3'>
                                <div
                                    className='bg-success rounded h-5px'
                                    role='progressbar'
                                    style={{width: `${completion}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='d-flex overflow-auto h-55px'>
                <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                    <li className='nav-item'>
                        <Link
                            href='/companies'
                        ><a className={
                            `nav-link text-active-primary me-6 ` +
                            (router.pathname === '/companies' && 'active')
                        }>{intl.formatMessage({id: "LANGUAGE.OVERVIEW"})}</a>

                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link href='/companies/description'>
                            <a className={
                                `nav-link text-active-primary me-6 ` +
                                (router.pathname === '/companies/description' && 'active')
                            }>{intl.formatMessage({id: "LANGUAGE.DESCRIPTION"})}</a>

                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link href='/companies/plan'>
                            <a className={
                                `nav-link text-active-primary me-6 ` +
                                (router.pathname === '/companies/plan' && 'active')
                            }>{intl.formatMessage({id: "LANGUAGE.VENDOR_PLAN"})}</a>

                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>)
}

export default memo(OverviewCompany)