import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect, useState} from "react"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {NextPageWithLayout, Obj} from "../../utils/types"
import {fnCurrentApiUrl, toAbsoluteUrl} from "../../utils/url"
import {useIntl} from "react-intl"
import {usePageData} from "../../components/layout/core"
import Select from 'react-select'
import axios from "axios"
import {useAlert} from 'react-alert'
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from "react-hook-form"
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';

library.add(fas)

type paramUser = {
    input_name?: string,
    input_email?: string,
    input_password?: string,
    group_id: Obj[]
}


const Index: NextPageWithLayout = () => {
    const intl = useIntl()
    const alert = useAlert()
    const [groupId, setGroupId] = useState<Obj[]>([])
    const {setPageBreadcrumbs} = usePageData()
    const [vendorGroupPermissions, setVendorGroupPermissions] = useState<Obj[]>([])
    // const [createError, setCreateError] = useState<boolean>(false)
    // const [loading, setLoading] = useState<boolean>(false)
    // const [checkEmail, setCheckEmail] = useState<boolean>(false)


    const validationSchema =
        Yup.object().shape({
            input_name: Yup.string()
                .min(3, intl.formatMessage({id: "VALIDATE.MIN_3_SYMBOLS"}))
                .max(255, intl.formatMessage({id: "VALIDATE.MAX_255_SYMBOLS"}))
                .required(intl.formatMessage({id: "VALIDATE.FIELD_IS_REQUIRED"})),
            input_email: Yup.string()
                .email(intl.formatMessage({id: "VALIDATE.EMAIL_IS_INVALID"}))
                .required(intl.formatMessage({id: "VALIDATE.EMAIL_IS_REQUIRED"}))
                .test('Unique Email', intl.formatMessage({id: "LANGUAGE.EMAIL_EXIST"}), // <- key, message
                    function (value) {
                        return new Promise((resolve, reject) => {
                            const call_api = (email: string | undefined) => {
                                return axios.post(fnCurrentApiUrl("/api/users/check_email"), {
                                    email: email ?? undefined
                                })
                            }
                            call_api(value)
                                .then((res) => {
                                    if (res.data == true) {
                                        resolve(false)
                                    } else {
                                        resolve(true)
                                    }

                                })
                                .catch((error) => {
                                    if (error.response.data.content === "The email has already been taken.") {
                                        resolve(false)
                                    }
                                })

                        })
                    }
                ),
            input_password: Yup.string()
                .min(6, intl.formatMessage({id: "VALIDATE.PASSWORD_MUST_AT_LEAST_6_CHARACTERS"}))
                .max(40, intl.formatMessage({id: "VALIDATE.PASSWORD_MUST_NOT_EXCEED_40_CHARACTERS"}))
                .required(intl.formatMessage({id: "VALIDATE.PASSWORD_IS_REQUIRED"}))
        })

    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "LANGUAGE.USER_MANAGE"}),
                path: "/users"
            }, {
                title: intl.formatMessage({id: "USER.ADD_USER"}),
                isActive: true
            }
        ])
    }, [])

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<paramUser>({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (params_user_data: paramUser) => {
        // setLoading(true)
        params_user_data.group_id = groupId
        const create_user = (params_user: paramUser) => {
            return axios.post(fnCurrentApiUrl("/api/users/create"), {
                input_name: params_user.input_name,
                input_email: params_user.input_email,
                input_password: params_user.input_password,
                group_id: params_user.group_id
            })
        }
        create_user(params_user_data).then(response => {
            if (response.data) {
                if (response.data == "LANGUAGE.EMAIL_EXISTS") {
                    alert.show(intl.formatMessage({id: 'LANGUAGE.EMAIL_EXISTS'}), {type: "error"})
                } else {
                    alert.show(intl.formatMessage({id: 'USER.ADD_USER_SUCCESS'}), {type: "success"})
                    window.location.href = "/users"
                }

            } else {
                alert.show(intl.formatMessage({id: 'LANGUAGE.DATA_INVALID'}), {type: "error"})
            }
        }).catch(function (error) {
            if (error.response.data.hasOwnProperty('messages')) {
                error.response.data.messages.forEach((message: String) => {
                    alert.show(message, {type: "error"})
                })

            }
            // setLoading(false)
        })
    }
    //API payments
    useEffect(() => {
        let _vendor_group_permissions: Obj[] = []
        const res_vendor_group_permissions = () => {
            return axios.post(fnCurrentApiUrl("/api/users/vendor_group_permissions"), {
                status: "A"
            })
        }
        res_vendor_group_permissions().then(response => {
            const _vendor_group_permission_data = response.data.data
            // console.log(_vendor_group_permission_data);
            if (_vendor_group_permission_data) {
                for (let k in _vendor_group_permission_data) {
                    _vendor_group_permissions.push({value:_vendor_group_permission_data[k]['group_id'], label: _vendor_group_permission_data[k]['name']})
                }
            }
            setVendorGroupPermissions(_vendor_group_permissions)
        })
    }, [])

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            {intl.formatMessage({id: 'USER.ROLE_EMPTY_NOTE'})}
        </Tooltip>
    );

    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'USER.ADD_USER'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'USER.ADD_USER'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            <div className="card card-flush">
                <form
                    className="form w-100"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    id="kt_login_signin_form"
                >
                    <div className="card-body">
                        <div className="row mb-6 align-items-center">
                            <label className='col-lg-2 mb-4 mb-lg-0 fw-bold fs-6'>
                                    <span>
                                        {intl.formatMessage({id: 'USER.ROLE'})}
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{show: 250, hide: 400}}
                                            overlay={renderTooltip}
                                        >
                                            <span>
                                                <FontAwesomeIcon className={'m-1'} icon={['fas', 'circle-info']} size={"sm"}/>
                                            </span>
                                        </OverlayTrigger>
                                    </span>
                            </label>
                            <div className="col-lg-10 fv-row">
                                <Select options={vendorGroupPermissions} isMulti isClearable  {...register('group_id')}
                                        name="group_id" onChange={
                                    (option: any) => {
                                        setGroupId(option)
                                    }
                                }/>
                            </div>
                        </div>
                        <div className="row mb-6 align-items-center">
                            <label className="col-lg-2 mb-4 mb-lg-0 required fw-bold fs-6">
                                {intl.formatMessage({id: "AUTH.INPUT.FULLNAME"})}
                            </label>
                            <div className="col-lg-10 fv-row">
                                <input type="text"
                                       className={`form-control ${Object.keys(errors).length > 0 ? (errors.input_name ? 'is-invalid' : 'is-valid') : ''}`}  {...register('input_name')}
                                       name="input_name"
                                       placeholder={intl.formatMessage({id: "AUTH.INPUT.FULLNAME"})}
                                />
                                {errors.input_name && (
                                    <div className="fv-plugins-message-container invalid-feedback">
                                        <span role="alert">{errors.input_name?.message}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row mb-6 align-items-center">
                            <label className="col-lg-2 mb-4 mb-lg-0 required fw-bold fs-6">
                                {intl.formatMessage({id: "AUTH.INPUT.EMAIL"})}
                            </label>
                            <div className="col-lg-10 fv-row">
                                <input type="text"
                                       className={`form-control ${Object.keys(errors).length > 0 ? (errors.input_email ? 'is-invalid' : 'is-valid') : ''}`}
                                       placeholder={intl.formatMessage({id: "AUTH.INPUT.EMAIL"})} {...register('input_email')}
                                       name="input_email" onBlur={(e) => {

                                }
                                }/>
                                {errors.input_email && (
                                    <div className="fv-plugins-message-container invalid-feedback">
                                        <span role="alert">{errors.input_email?.message}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row mb-6 align-items-center">
                            <label className="col-lg-2 mb-4 mb-lg-0 required fw-bold fs-6">
                                {intl.formatMessage({id: "AUTH.INPUT.PASSWORD"})}
                            </label>
                            <div className="col-lg-10 fv-row">
                                <input type="password"
                                       className={`form-control ${Object.keys(errors).length > 0 ? (errors.input_password ? 'is-invalid' : 'is-valid') : ''}`}
                                       placeholder={intl.formatMessage({id: "AUTH.INPUT.PASSWORD"})} {...register('input_password')}
                                       name="input_password"/>
                                {errors.input_password && (
                                    <div className="fv-plugins-message-container invalid-feedback">
                                        <span role="alert">{errors.input_password?.message}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button type="submit"
                                id="kt_sign_in_submit"
                                className="btn btn-sm btn-primary mb-5"
                                disabled={Object.keys(errors).length > 0}>
                            {intl.formatMessage({id: "LANGUAGE.SAVE_CHANGE"})}</button>
                    </div>
                </form>
            </div>
        </>
    )
}


Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
