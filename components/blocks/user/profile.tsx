import React, {ChangeEvent, FC, useState} from 'react'
import * as Yup from 'yup'
import {useForm} from "react-hook-form"
import {yupResolver} from '@hookform/resolvers/yup'
import {useIntl} from 'react-intl'
import axios from "axios"
import {useRouter} from "next/router"
import {useAlert} from 'react-alert'
import clsx from "clsx"
import {useDispatch, useSelector} from "react-redux";
import {ReducerInterFace} from "../../../redux/reducers";
import allAction from "../../../redux/actions"
import {useLang} from "../../i18n/Metronici18n";
import {EmailPopup} from "../../popup/EmailPopup";
import {PhonePopup} from "../../popup/PhonePopup";
import {fnFirstLast} from "../../../utils/fullName";
import {fnCurrentApiUrl} from "../../../utils/url";

type profileField = {
    name: string
    email?: string
    phone?: string
    lang: string
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

// xem example https://www.bezkoder.com/react-hook-form-typescript/


const ProfileBlock: FC = () => {
    const intl = useIntl()
    const [loading, setLoading] = useState<boolean>(false)
    const [popupEmail, setPopupEmail] = useState<boolean>(false)
    const [popupPhone, setPopupPhone] = useState<boolean>(false)
    const router = useRouter()
    const alert = useAlert()
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const lang: string = useLang() ?? "vi"
    const [formData, setFormData] = useState<profileField>({
        name: lang === "vi" ? `${user?.firstname} ${user?.lastname}` : `${user?.lastname} ${user?.firstname}`,
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        lang
    })
    const dispatch = useDispatch()

    let min_character = intl.formatMessage({id: "LANGUAGE.MIN_CHARACTER"})
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, min_character.replace("[n]", "2"))
            .required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"}))
    })

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<profileField>({
        resolver: yupResolver(validationSchema)
    })


    const onSubmit = async () => {
        // alert.show('Oh look, an alert!')
        // alert.show('Oh look, an alert!',{type: "error"})
        // alert.show('Oh look, an alert!',{type: "success"})

        setLoading(true)
        await axios.post(fnCurrentApiUrl("/api/profiles"), formData)
            .then(function (response) {
                setLoading(false)
                if (!response || response.status != 200) {
                    return false
                }

                dispatch(allAction.auth.AuthName(fnFirstLast(formData.name, lang)))
                alert.show(intl.formatMessage({id: "LANGUAGE.UPDATE_SUCCESS"}), {type: "success"})

            })
            .catch(function (error) {
                setLoading(false)
                // handle error
                if (error.response.data.hasOwnProperty('messages')) {
                    error.response.data.messages.forEach((message: String) => {
                        alert.show(message, {type: "error"})
                    })

                }
                setLoading(false)
            });
    }

    return (
        <div className='card'>
            <div className='card-title m-0 card-header'>
                <ul className="nav nav-tabs nav-line-tabs nav-stretch border-transparent fs-5 fw-bolder"
                    id="kt_security_summary_tabs">
                    <li className="nav-item">
                        <span
                            className={clsx("nav-link text-active-primary cursor-pointer active")}>{intl.formatMessage({id: "AUTH.GENERAL.PROFILE"})}</span>
                    </li>
                    <li className="nav-item">
                        <span onClick={() => router.push("/users/change-pass")}
                              className={clsx("nav-link text-active-primary cursor-pointer")}>{intl.formatMessage({id: "AUTH.GENERAL.CHANGE_PASS"})}</span>
                    </li>

                </ul>
            </div>

            <div id='profile_details' className={clsx("collapse show")}>
                <form onSubmit={handleSubmit(onSubmit)} className='form'>
                    <div className='card-body border-top p-9'>
                        <div className='row mb-6'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "AUTH.INPUT.FULLNAME"})}</label>
                            <div className='col-lg-9 fv-row'>
                                <input
                                    type='text'
                                    defaultValue={formData.name}
                                    className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder={intl.formatMessage({id: "AUTH.INPUT.FULLNAME"})}
                                    {...register('name')}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({
                                        ...formData,
                                        name: e.target.value
                                    })}
                                    required={true}
                                />
                                {errors.name && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.name?.message}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mb-6'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "AUTH.INPUT.EMAIL"})}</label>

                            <div className='col-lg-9 d-flex flex-row'>
                                <div className={"p-2 w-50"}><strong>{user?.email}</strong></div>
                                <div className={"w-50"}><a className={"btn btn-danger"} onClick={() => {
                                    setPopupEmail(true)
                                }}>{intl.formatMessage({id: "LANGUAGE.CHANGE"})}</a></div>
                            </div>

                        </div>

                        <div className='row mb-6'>
                            <label className='col-lg-3 col-form-label fw-bold fs-6'>
                                <span className='required'>{intl.formatMessage({id: "LANGUAGE.PHONE"})}</span>
                            </label>

                            <div className='col-lg-9 d-flex flex-row'>
                                <div className={"p-2 w-50"}><strong>{user?.phone}</strong></div>
                                <div className={"w-50"}><a className={"btn btn-danger"} onClick={() => {
                                    setPopupPhone(true)
                                }}>{intl.formatMessage({id: "LANGUAGE.CHANGE"})}</a></div>
                            </div>

                        </div>

                    </div>

                    <div className='card-footer d-flex justify-content-end py-6 px-9'>
                        <button type='submit' className='btn btn-primary' disabled={loading}>
                            {!loading && intl.formatMessage({id: "LANGUAGE.SAVE_CHANGE"})}
                            {loading && (
                                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </button>
                    </div>
                </form>
                <EmailPopup onChange={setPopupEmail} showPopup={popupEmail}
                            title={intl.formatMessage({id: "LANGUAGE.CHANGE_EMAIL"})}/>
                <PhonePopup onChange={setPopupPhone} showPopup={popupPhone}
                            title={intl.formatMessage({id: "LANGUAGE.CHANGE_PHONE"})}/>
            </div>
        </div>
    )
}

export default ProfileBlock