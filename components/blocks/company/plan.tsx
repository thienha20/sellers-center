import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import axios from "axios"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../../redux/reducers"
import {useLang} from "../../i18n/Metronici18n"
import {Obj} from "../../../utils/types";
import _ from "lodash";
import OverviewCompany from "./commons/overview";
import {fnPriceFormat} from "../../../utils/price";
import {fnCurrentApiUrl} from "../../../utils/url";


/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

// xem example https://www.bezkoder.com/react-hook-form-typescript/


const PlanCompanyBlock: FC = () => {
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

    const getPlan: (vl: string | null) => String = (str: string | null) => {
        if (!str) return ""
        switch (str) {
            case "month":
                return intl.formatMessage({id: "LANGUAGE.MONTH"})
            case "year":
                return intl.formatMessage({id: "LANGUAGE.YEAR"})
            case "onetime":
                return intl.formatMessage({id: "LANGUAGE.ONETIME"})
        }
        return ""
    }
    return (
        <div className="post d-flex flex-column-fluid" id="kt_post">
            <div className="container-xxl p-0">
                <OverviewCompany companyData={companyData}/>
                <div className="card">
                    <div className='card-header cursor-pointer'>
                        <div className='card-title m-0'>
                            <h3 className='fw-bolder m-0'>{intl.formatMessage({id: "LANGUAGE.VENDOR_PLAN"})}</h3>
                        </div>

                    </div>

                    <div className='card-body p-9'>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.VENDOR_PLAN"})}</label>

                            <div className='col-lg-8 fv-row'>
                                <span className='fw-bold fs-6'>{companyData.vendor_plans?.plan ?? ""}</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-4 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.PLAN_FEE"})}</label>

                            <div className='col-lg-8 fv-row'>
                                <span
                                    className='fw-bold fs-6'>{companyData.vendor_plans?.price > 0 ? <>{fnPriceFormat(companyData.vendor_plans?.price)} / {getPlan(companyData.vendor_plans?.periodicity)}</>
                                                                    : <>{intl.formatMessage({id: "LANGUAGE.FREE"})}</>}</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.TRANSACTION_FEE"})}
                            </label>

                            <div className='col-lg-8 d-flex align-items-center'>
                                <span
                                    className='fw-bolder fs-6 me-2'>{companyData.vendor_plans?.commission ?? 0}%</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.PRODUCT_LIMIT"})}
                            </label>

                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>{companyData.vendor_plan?.products_limit > 0 ? companyData.vendor_plan?.products_limit: intl.formatMessage({id: "LANGUAGE.UNLIMITED"})}</span>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label className='col-lg-4 fw-bold text-muted'>
                                {intl.formatMessage({id: "LANGUAGE.REVENUE_LIMIT"})}
                            </label>

                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>{companyData.vendor_plan?.revenue_limit > 0 ? fnPriceFormat(companyData.vendor_plan?.revenue_limit): intl.formatMessage({id: "LANGUAGE.UNLIMITED"})}</span>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanCompanyBlock