import Head from 'next/head'
import React, {ReactElement, ReactNode, useEffect, useState} from "react"
import {MasterLayout} from "../../../components/layout/MasterLayout"
import {fnCurrentApiUrl, toAbsoluteUrl} from "../../../utils/url"
import {NextPageWithLayout, Obj} from "../../../utils/types"
import {useIntl} from "react-intl"
import {useRouter} from "next/router"
import axios from "axios"
import Select from 'react-select'
import {usePageData} from "../../../components/layout/core"
import {fnFullName} from "../../../utils/fullName"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../../redux/reducers"
import {useAlert} from 'react-alert'
import _ from "lodash"
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useForm} from "react-hook-form"
import CryptoJS from "crypto-js"
import {OverlayTrigger, Tooltip} from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'

library.add(fas)
type paramUser = {
    input_name?: string,
    group_id: Obj[]
}

const Detail: NextPageWithLayout = () => {
    const intl = useIntl()
    const alert = useAlert()
    const router = useRouter()
    const {id} = router.query
    const [user, setUser] = useState<Obj>({})
    const userLogin = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const [groupId, setGroupId] = useState<Obj[]>([])
    const [groupIdDefault, setGroupIdDefault] = useState<Obj[]>([])
    const [vendorGroupPermissions, setVendorGroupPermissions] = useState<Obj[]>([])
    const [disabledSelect, setDisabledSelect] = useState<boolean>(true)
    const [disabledName, setDisabledName] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [inputName, setInputName] = useState<string>('')
    const validationSchema = Yup.object().shape({
        input_name: Yup.string()
            .min(3, intl.formatMessage({id: "VALIDATE.MIN_3_SYMBOLS"}))
            .max(255, intl.formatMessage({id: "VALIDATE.MAX_255_SYMBOLS"}))
            .required(intl.formatMessage({id: "VALIDATE.FIELD_IS_REQUIRED"}))
            .default(fnFullName(user.firstname, user.lastname))
    })
    const {setPageBreadcrumbs} = usePageData()

    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "LANGUAGE.USER_MANAGE"}),
                path: "/users"
            }, {
                title: intl.formatMessage({id: "USER.EDIT_USER"}),
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
    useEffect(() => {
        if (router.isReady) {
            const call_api = () => {
                return axios.post(fnCurrentApiUrl(`/api/users/${id}`))
            }
            call_api().then((res) => {
                const _user_data = res.data
                if (_.isEmpty(_user_data)) {
                    window.location.href = "/404"
                }
                setUser(_user_data)
                setInputName(fnFullName(_user_data.firstname, _user_data.lastname))
                let _vendor_group_permissions: Obj[] = []
                const _vendor_group_permission_data = _user_data.vendor_group_permissions
                if (_vendor_group_permission_data) {
                    for (let k in _vendor_group_permission_data) {
                        _vendor_group_permissions.push({
                            value: _vendor_group_permission_data[k]['group_id'],
                            label: _vendor_group_permission_data[k]['name']
                        })
                    }
                    setGroupIdDefault(_vendor_group_permissions)
                }
                if ((!_.isEmpty(userLogin) && (userLogin.vendor_root == 'Y' || userLogin.vendor_root == undefined)) ||
                    (!_.isEmpty(userLogin) && !_.isEmpty(_user_data) && userLogin.user_id == _user_data.user_id)) {
                    setDisabledName(false)
                }
            })
        }

    }, [router.isReady, id, groupId, vendorGroupPermissions])
    useEffect(() => {
        let _vendor_group_permissions: Obj[] = []
        const res_vendor_group_permissions = () => {
            return axios.post(fnCurrentApiUrl("/api/users/vendor_group_permissions"), {
                status: "A"
            })
        }
        res_vendor_group_permissions().then(response => {
            const _vendor_group_permission_data = response.data.data
            if (_vendor_group_permission_data) {
                for (let k in _vendor_group_permission_data) {
                    _vendor_group_permissions.push({
                        value: _vendor_group_permission_data[k]['group_id'],
                        label: _vendor_group_permission_data[k]['name']
                    })
                }
            }
            setVendorGroupPermissions(_vendor_group_permissions)
        })
    }, [])
    useEffect(() => {
        let bol: boolean = false
        if (userLogin.permission) {
            let rs = CryptoJS.AES.decrypt(userLogin.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            const permission: string[] | null | undefined = JSON.parse(rs)
            if (permission && permission.length > 0) {
                for (let elm of permission) {
                    if (router.pathname === elm) {
                        bol = true
                        break
                    }
                }
                if (!bol) {
                    router.push("/404")
                }
            }
        }

        if (!_.isEmpty(userLogin)) {
            if (userLogin.vendor_root == 'Y' || (userLogin.vendor_root == 'N' && _.isEmpty(userLogin.permission)) || bol) {
                setDisabledSelect(false)
                setDisabledName(false)
            }
        }
    }, [])
    const onSubmit = async (params_user_data: paramUser) => {
        setLoading(true)
        params_user_data.group_id = groupIdDefault
        const update_user = (params_user: paramUser) => {
            return axios.post(fnCurrentApiUrl("/api/users/update/update_user"), {
                user_id: `${id}`,
                input_name: params_user.input_name,
                group_id: params_user.group_id
            })
        }
        update_user(params_user_data).then(response => {
            if (response.data) {
                if (response.data == "LANGUAGE.USER_NOT_EXISTS") {
                    alert.show(intl.formatMessage({id: 'LANGUAGE.USER_NOT_EXISTS'}), {type: "error"})
                } else {
                    alert.show(intl.formatMessage({id: 'USER.EDIT_USER_SUCCESS'}), {type: "success"})
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
            setLoading(false)
        })
    }
    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            {intl.formatMessage({id: 'USER.ROLE_EMPTY_NOTE'})}
        </Tooltip>
    )
    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: "USER.EDIT_USER"})}</title>
                <meta name="description" content="User Management"/>
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

                        <div className="row mb-6">
                            <label className="col-lg-2 col-form-label fw-bold fs-6">
                                    <span>
                                        {intl.formatMessage({id: 'USER.ROLE'})}
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{show: 250, hide: 400}}
                                            overlay={renderTooltip}
                                        >
                                            <span>
                                                <FontAwesomeIcon className={'m-1'} icon={['fas', 'circle-info']}
                                                                 size={"sm"}/>
                                            </span>
                                        </OverlayTrigger>
                                    </span>
                            </label>

                            <div className="col-lg-10 fv-row">
                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{show: 250, hide: 400}}
                                    overlay={renderTooltip}
                                >
                                    <Select options={vendorGroupPermissions} isDisabled={disabledSelect}
                                            value={groupIdDefault}
                                            isMulti isClearable name="group_id" onChange={
                                        (option: any) => {
                                            setGroupIdDefault(option)
                                        }
                                    }/>
                                </OverlayTrigger>

                            </div>
                        </div>
                        <div className="row mb-6">
                            <label className="col-lg-2 col-form-label required fw-bold fs-6">
                                {intl.formatMessage({id: "AUTH.INPUT.FULLNAME"})}
                            </label>
                            <div className="col-lg-10 fv-row">
                                <input type="text"
                                       className={`form-control ${Object.keys(errors).length > 0 ? (errors.input_name ? 'is-invalid' : 'is-valid') : ''}`}
                                       disabled={disabledName}
                                       placeholder={intl.formatMessage({id: "AUTH.INPUT.FULLNAME"})}
                                       {...register('input_name')}
                                       name="input_name"
                                       defaultValue={fnFullName(user.firstname, user.lastname)}
                                />
                                {errors.input_name && (
                                    <div className="fv-plugins-message-container invalid-feedback">
                                        <span role="alert">{errors.input_name?.message}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button type="submit"
                                id="kt_sign_in_submit"
                                className="btn btn-sm btn-primary mb-5"
                                disabled={Object.keys(errors).length > 0}>{intl.formatMessage({id: "LANGUAGE.SAVE_CHANGE"})}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

Detail.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Detail
