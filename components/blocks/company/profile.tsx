import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import axios from "axios"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../../redux/reducers"
import {useLang} from "../../i18n/Metronici18n"
import Link from "next/link"
import {Obj} from "../../../utils/types";
import _ from "lodash";
import OverviewCompany from "./commons/overview";
import {fnCurrentApiUrl} from "../../../utils/url";

const ProfileCompanyBlock: FC = () => {
    const intl = useIntl()
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const lang: string = useLang() ?? "vi"
    const [companyData, setCompanyData] = useState<Obj>({})

    useEffect(() => {
        const call_api = () => {
            return axios.post(fnCurrentApiUrl(`/api/companies/${user.company_id}`), {
                lang_code: lang
            })
        }
        call_api().then((res) => {
            if (_.isEmpty(res.data)) {
                window.location.href = "/404"
            }
            setCompanyData(res.data)
        })
    }, [])


    return (
        <div className="post d-flex flex-column-fluid" id="kt_post">
            <div className="container-xxl p-0">
                <OverviewCompany companyData={companyData}/>
                <div className="card">
                    <div className='card-header cursor-pointer'>
                        <div className='card-title m-0'>
                            <h3 className='fw-bolder m-0'>{intl.formatMessage({id: "LANGUAGE.OVERVIEW"})}</h3>
                        </div>

                        {/*<Link href={'/crafted/account/settings'}>*/}
                        {/*    <a className='btn btn-primary align-self-center'>{intl.formatMessage({id: "LANGUAGE.EDIT_COMPANY"})}</a>*/}
                        {/*</Link>*/}
                    </div>

                    <div className='card-body p-9'>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.COMPANY"})}</label>

                            <div className='col-lg-8 fv-row'>
                                <span className='fw-bold fs-6'>{companyData.company ?? ""}</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.REPRESENTATIVE"})}</label>

                            <div className='col-lg-8 fv-row'>
                                <span
                                    className='fw-bold fs-6'>{lang === "vi" ? `${companyData.firstname} ${companyData.lastname}` : `${companyData.lastname} ${companyData.firstname}`}</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.PHONE"})}
                            </label>

                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>{companyData.phone ?? ""}</span>

                                <span className='badge badge-success'>Verified</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.EMAIL"})}
                            </label>

                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>{companyData.email ?? ""}</span>

                                <span className='badge badge-success'>Verified</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.TAX_CODE"})}
                            </label>

                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>{companyData.tax_code ?? ""}</span>

                                <span className='badge badge-success'>Verified</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.WEBSITE"})}</label>

                            <div className='col-lg-8'>
                                <Link href={companyData.url ?? "#"} passHref={true}>
                                    <a target={"_blank"} className='fw-bold fs-6 text-dark text-hover-primary'>
                                        {companyData.url ?? ""}
                                    </a>
                                </Link>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.COUNTRY"})}
                                <i
                                    className='fas fa-exclamation-circle ms-1 fs-7'
                                    data-bs-toggle='tooltip'
                                    title='Country of origination'
                                ></i>
                            </label>

                            <div className='col-lg-8'>
                                <span
                                    className='fw-bolder fs-6 text-dark'> {companyData?.country ? companyData?.country_name[companyData?.country]?.country ?? "" : ""}</span>
                            </div>
                        </div>
                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.STATE"})}
                                <i
                                    className='fas fa-exclamation-circle ms-1 fs-7'
                                    data-bs-toggle='tooltip'
                                    title='Country of origination'
                                ></i>
                            </label>

                            <div className='col-lg-8'>
                                <span
                                    className='fw-bolder fs-6 text-dark'> {companyData.state ?? ""}</span>
                            </div>
                        </div>
                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.DISTRICT"})}
                                <i
                                    className='fas fa-exclamation-circle ms-1 fs-7'
                                    data-bs-toggle='tooltip'
                                    title='Country of origination'
                                ></i>
                            </label>

                            <div className='col-lg-8'>
                                <span
                                    className='fw-bolder fs-6 text-dark'> {companyData.city ?? ""}</span>
                            </div>
                        </div>
                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.WARD"})}
                                <i
                                    className='fas fa-exclamation-circle ms-1 fs-7'
                                    data-bs-toggle='tooltip'
                                    title='Country of origination'
                                ></i>
                            </label>

                            <div className='col-lg-8'>
                                <span
                                    className='fw-bolder fs-6 text-dark'> {companyData.county ?? ""}</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.ADDRESS"})}
                                <i
                                    className='fas fa-exclamation-circle ms-1 fs-7'
                                    data-bs-toggle='tooltip'
                                    title='Country of origination'
                                ></i>
                            </label>

                            <div className='col-lg-8'>
                                <span
                                    className='fw-bolder fs-6 text-dark'> {companyData.address ?? ""}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCompanyBlock