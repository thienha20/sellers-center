import React, {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import axios from "axios"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../../redux/reducers"
import {useLang} from "../../i18n/Metronici18n"
import {Obj} from "../../../utils/types";
import _ from "lodash";
import TinyEditor from "../../editors/tinyMce";
import OverviewCompany from "./commons/overview"
import {fnCurrentApiUrl} from "../../../utils/url";
/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

// xem example https://www.bezkoder.com/react-hook-form-typescript/


const DescriptionCompanyBlock: FC = () => {
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
                            <h3 className='fw-bolder m-0'>{intl.formatMessage({id: "LANGUAGE.DESCRIPTION"})}</h3>
                        </div>
                    </div>

                    <div className='card-body p-9'>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-2 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.DESCRIPTION"})}</label>

                            <div className='col-lg-10 fv-row'>
                                <TinyEditor data={companyData.company_description}/>
                            </div>
                        </div>

                        <div className='row mb-7'>
                            <label
                                className='col-lg-2 fw-bold text-muted'>{intl.formatMessage({id: "LANGUAGE.TERMS"})}</label>

                            <div className='col-lg-10 fv-row'>
                                <TinyEditor data={companyData.terms}/>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default DescriptionCompanyBlock