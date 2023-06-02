import React, {ChangeEvent, FC, useState} from 'react'
import * as Yup from 'yup'
import {useForm} from "react-hook-form"
import {yupResolver} from '@hookform/resolvers/yup'
import {useIntl} from 'react-intl'
import axios from "axios";
import {useRouter} from "next/router"
import {useAlert} from 'react-alert'
import clsx from "clsx";
import {fnCurrentApiUrl} from "../../../utils/url";
// import {useLang} from '../../i18n/Metronici18n'

type PasswordField = {
    passwordOld: string
    password1: string
    password2: string
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

// xem example https://www.bezkoder.com/react-hook-form-typescript/


const ChangePassBlock: FC = () => {
    const intl = useIntl()
    const [loading, setLoading] = useState<boolean>(false)
    const [passwordOld, setPasswordOld] = useState<string>("")
    const [password1, setPassword1] = useState<string>("")
    const [password2, setPassword2] = useState<string>("")
    const router = useRouter()
    const alert = useAlert()
    // const dispatch = useDispatch()
    let min_character = intl.formatMessage({id: "LANGUAGE.MIN_CHARACTER"})
    const validationSchema = Yup.object().shape({
        password1: Yup.string()
            .min(6, min_character.replace("[n]", "6"))
            .required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"})),
        password2: Yup.string()
            .min(6, min_character.replace("[n]", "6"))
            .required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"}))
            .oneOf([Yup.ref('password1')], 'Passwords does not match'),
        passwordOld: Yup.string()
            .min(6, min_character.replace("[n]", "6"))
            .required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"})),
    })

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<PasswordField>({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async () => {
        // alert.show('Oh look, an alert!')
        // alert.show('Oh look, an alert!',{type: "error"})
        // alert.show('Oh look, an alert!',{type: "success"})
        setLoading(true)
        await axios.post(fnCurrentApiUrl("/api/profiles"), {
            passwordOld,
            password1,
            password2
        })
            .then(function (response) {
                setLoading(false)
                if (!response || response.status != 200) {
                    return false
                }
                alert.show(intl.formatMessage({id: "LANGUAGE.UPDATE_SUCCESS"}), {type: "success"})
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            })
            .catch(function (error) {
                setLoading(false)
                // handle error
                if (error.response.status === 401 && error.response.data === "error_oldPassword") {
                    document.getElementsByName('passwordOld')[0].focus()
                    alert.show(intl.formatMessage({id: "LANGUAGE.PASSWORD_OLD_MATCH"}), {type: "error"})
                } else {
                    if (error.response.data.hasOwnProperty('messages')) {
                        error.response.data.messages.forEach((message: String) => {
                            alert.show(message, {type: "error"})
                        })
                    }
                }
            });
    }

    return (
        <div className='card'>
            <div className='card-title m-0 card-header'>
                <ul className="nav nav-tabs nav-line-tabs nav-stretch border-transparent fs-5 fw-bolder"
                    id="kt_security_summary_tabs">
                    <li className="nav-item">
                        <span onClick={() => router.push("/users/profile")}
                              className={clsx("nav-link text-active-primary cursor-pointer")}>{intl.formatMessage({id: "AUTH.GENERAL.PROFILE"})}</span>
                    </li>
                    <li className="nav-item">
                        <span
                            className={clsx("nav-link text-active-primary cursor-pointer active")}>{intl.formatMessage({id: "AUTH.GENERAL.CHANGE_PASS"})}</span>
                    </li>

                </ul>
            </div>
            <div id='change_pass' className={clsx("collapse show")}>
                <form onSubmit={handleSubmit(onSubmit)} className='form'>
                    <div className='card-body border-top p-9'>
                        <div className='row mb-6'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "AUTH.INPUT.OLD_PASSWORD"})}</label>
                            <div className='col-lg-9 fv-row'>
                                <input
                                    type='password'
                                    className={`form-control form-control-lg ${errors.passwordOld ? 'is-invalid' : ''}`}
                                    placeholder={intl.formatMessage({id: "AUTH.INPUT.OLD_PASSWORD"})}
                                    {...register('passwordOld')}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordOld(e.target.value)}
                                />
                                {errors.passwordOld && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.passwordOld?.message}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mb-6'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "AUTH.INPUT.PASSWORD"})}</label>

                            <div className='col-lg-9 fv-row'>
                                <input
                                    type='password'
                                    className={`form-control form-control-lg ${errors.password1 ? 'is-invalid' : ''}`}
                                    placeholder={intl.formatMessage({id: "AUTH.INPUT.PASSWORD"})}
                                    {...register('password1')}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword1(e.target.value)}
                                />
                                {errors.password1 && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.password1?.message}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='row mb-6'>
                            <label className='col-lg-3 col-form-label fw-bold fs-6'>
                                <span
                                    className='required'>{intl.formatMessage({id: "AUTH.INPUT.CONFIRM_PASSWORD"})}</span>
                            </label>

                            <div className='col-lg-9 fv-row'>
                                <input
                                    type='password'
                                    className={`form-control form-control-lg ${errors.password2 ? 'is-invalid' : ''}`}
                                    placeholder={intl.formatMessage({id: "AUTH.INPUT.CONFIRM_PASSWORD"})}
                                    {...register('password2')}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)}
                                />
                                {errors.password2 && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.password2?.message}</div>
                                    </div>
                                )}
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
            </div>
        </div>
    )
}

export default ChangePassBlock