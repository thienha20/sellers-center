import {Button, Modal} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useState} from "react";
import {useIntl} from "react-intl";
import {useDispatch, useSelector} from "react-redux";
import {ReducerInterFace} from "../../redux/reducers";
import allAction from "../../redux/actions";
import axios from "axios";
import {useAlert} from "react-alert";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import md5 from "md5";
import {fnCurrentApiUrl} from "../../utils/url";

type propsPopup = {
    title: string
    showPopup?: boolean
    onChange?: (bol: boolean) => void
}
type PhoneField = {
    phone: string
    phoneOldCode?: string
    phoneNewCode?: string
}


const PhonePopup: (props: propsPopup) => JSX.Element = (props: propsPopup) => {
    const intl = useIntl()
    const time = 60 // limit send sms
    const maxSend = 5
    const [loading, setLoading] = useState<boolean>(false)
    const {title, showPopup = false, onChange} = {...props}
    const [show, setShow] = useState(showPopup)
    const timePhoneOldLimiter = useSelector((state: ReducerInterFace) => state.settings.timerPhoneOld)
    const timePhoneNewLimiter = useSelector((state: ReducerInterFace) => state.settings.timerPhoneNew)
    const codeVerifyOld = useSelector((state: ReducerInterFace) => state.settings.codePhoneOld)
    const codeVerifyNew = useSelector((state: ReducerInterFace) => state.settings.codePhoneNew)
    const [countGetCodeOld, setCountGetCodeOld] = useState<number>(0)
    const [countGetCodeNew, setCountGetCodeNew] = useState<number>(0)
    const [countDownOld, setCountDownOld] = useState<number>(timePhoneOldLimiter || 0)
    const [countDownNew, setCountDownNew] = useState<number>(timePhoneNewLimiter || 0)
    const [codePhoneOld, setCodePhoneOld] = useState<string>("")
    const [codePhoneNew, setCodePhoneNew] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [activeButtonOld, setActiveButtonOld] = useState<boolean>(false)
    const [activeButtonNew, setActiveButtonNew] = useState<boolean>(false)
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const handleClose = () => {
        setShow(false)
        if (onChange) onChange(false)
    }

    const validationSchema = Yup.object().shape({
        phone: Yup.string().required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"})),
        phoneOldCode: Yup.string().required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"})),
        phoneNewCode: Yup.string().required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"}))
    })

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<PhoneField>({
        resolver: yupResolver(validationSchema)
    })
    const handleSave = () => {
        setShow(false)
        if (onChange) onChange(false)
    }
    const alert = useAlert()
    const dispatch = useDispatch()
    const getCodeOld = async () => {
        if (countGetCodeOld >= maxSend) {
            return false
        }
        setCountDownOld(time)
        dispatch(allAction.settings.timePhoneLimiter(time, "old"))
        setCountGetCodeOld(countGetCodeOld + 1)
        await axios.post(fnCurrentApiUrl("/api/notification/phone"), {})
            .then(function (response) {
                if (!response || response.status != 200) {
                    return false
                }
                setCodePhoneOld(response.data.code)
                dispatch(allAction.settings.codePhone(response.data.code, "old"))
                alert.show(intl.formatMessage({id: "LANGUAGE.SEND_PHONE_SUCCESS"}), {type: "success"})
            })
            .catch(function (error) {
                // handle error
                if (error.response.data.hasOwnProperty('messages')) {
                    error.response.data.messages.forEach((message: String) => {
                        alert.show(message, {type: "error"})
                    })

                }
            });
    }
    const getCodeNew = async () => {
        if (countGetCodeNew >= maxSend || phone === user.phone) {
            return false
        }
        setCountDownNew(time)
        dispatch(allAction.settings.timePhoneLimiter(time, "new"))
        setCountGetCodeNew(countGetCodeNew + 1)
        await axios.post(fnCurrentApiUrl("/api/notification/phone"), {
            phone: phone,
            verify: true
        })
            .then(function (response) {
                if (!response || response.status != 200) {
                    return false
                }
                if (!response.data || response.data === "") {
                    setCountDownNew(0)
                    dispatch(allAction.settings.timePhoneLimiter(0, "new"))
                    setCountGetCodeNew(countGetCodeNew + 1)
                    document.getElementsByName('phone')[0].focus()
                    alert.show(intl.formatMessage({id: "LANGUAGE.PHONE_EXIST"}), {type: "error"})
                } else {
                    setCodePhoneNew(response.data.code)
                    dispatch(allAction.settings.codePhone(response.data.code, "new"))
                    alert.show(intl.formatMessage({id: "LANGUAGE.SEND_PHONE_SUCCESS"}), {type: "success"})
                }
            })
            .catch(function (error) {
                // handle error
                if (error.response.data.hasOwnProperty('messages')) {
                    error.response.data.messages.forEach((message: String) => {
                        alert.show(message, {type: "error"})
                    })

                }
            });
    }
    useEffect(() => {
        setShow(showPopup)
    }, [showPopup])

    useEffect(() => {
        let downOld: ReturnType<typeof setTimeout>
        if (countDownOld > 0) {
            downOld = setTimeout(() => {
                let tam = countDownOld - 1
                setCountDownOld(tam)
                dispatch(allAction.settings.timePhoneLimiter(tam, "old"))
                if (tam === 0) {
                    setActiveButtonOld(false)
                    clearTimeout(downOld)
                } else {
                    setActiveButtonOld(true)
                }
            }, 1000);
        }
        return () => {
            if (downOld)
                clearTimeout(downOld)
        }
    }, [countDownOld, dispatch])

    useEffect(() => {
        let downNew: ReturnType<typeof setTimeout>
        if (countDownNew > 0) {
            downNew = setTimeout(() => {
                let tam = countDownNew - 1
                setCountDownNew(tam)
                dispatch(allAction.settings.timePhoneLimiter(tam, "old"))
                if (tam === 0) {
                    setActiveButtonNew(false)
                    clearTimeout(downNew)
                } else {
                    setActiveButtonNew(true)
                }
            }, 1000);
        }
        return () => {
            if (downNew)
                clearTimeout(downNew)
        }
    }, [countDownNew, dispatch])

    const onSubmit = async () => {
        if (codeVerifyOld != md5(user?.phone + codePhoneOld)) {
            alert.show(intl.formatMessage({id: "LANGUAGE.CODE_FAIL"}), {type: "error"})
            document.getElementsByName("phoneOldCode")[0].focus()
            return false
        }
        if (codeVerifyNew != md5(phone + codePhoneNew)) {
            alert.show(intl.formatMessage({id: "LANGUAGE.CODE_FAIL"}), {type: "error"})
            document.getElementsByName("phoneNewCode")[0].focus()
            return false
        }
        setLoading(true)
        await axios.post(fnCurrentApiUrl("/api/profiles"), {
            phone,
            phoneOldCode: codePhoneOld,
            phoneNewCode: codePhoneNew
        })
            .then(function (response) {
                setLoading(false)
                if (!response || response.status != 200) {
                    return false
                }
                dispatch(allAction.auth.AuthPhone({
                    userData: {
                        phone: phone
                    }
                }))
                handleSave()
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
            });
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size={"lg"}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <form className={"form"} onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className={'p-2'}>
                    <div className='card-body'>
                        <div className='row mb-5'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "LANGUAGE.PHONE_OLD_VERIFICATION"})}</label>

                            <div className='col-lg-9 fv-row'>
                                <div className='fv-row d-flex'>
                                    <button type='button'
                                            className='btn btn-primary col-6 col-xl-4 col-sm-6 col-xxl-4 phone-verify-right'
                                            onClick={getCodeOld}
                                            disabled={activeButtonOld}
                                    >
                                        {intl.formatMessage({id: "LANGUAGE.GET_VERIFICATION"})} {countDownOld ? <>({countDownOld})</> : null}
                                    </button>
                                    <div className={"col-6 col-xl-8 col-sm-6 col-xxl-8"}>
                                        <input
                                            defaultValue={""}
                                            className={`form-control phone-verify-left ${errors.phoneOldCode ? 'is-invalid' : ''}`}
                                            {...register('phoneOldCode')}
                                            placeholder={intl.formatMessage({id: "LANGUAGE.PHONE_VERIFICATION"})}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCodePhoneOld(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {errors.phoneOldCode && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.phoneOldCode?.message}</div>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className='row mb-6'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "LANGUAGE.NEW_PHONE"})}</label>

                            <div className='col-lg-9 fv-row'>
                                <div className='row mt-3'>
                                    <div className='d-flex'>
                                        <div className={"col-6 col-xl-8 col-sm-6 col-xxl-8"}>
                                            <input
                                                type={"phone"}
                                                defaultValue={""}
                                                className={`form-control phone-verify-right ${errors.phone ? 'is-invalid' : ''}`}
                                                placeholder={intl.formatMessage({id: "LANGUAGE.NEW_PHONE"})}
                                                {...register('phone')}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                                                required={true}
                                            />

                                        </div>
                                        <button type='button'
                                                className='btn btn-primary col-6 col-xl-4 col-sm-6 col-xxl-4 phone-verify-left'
                                                onClick={getCodeNew}
                                                disabled={activeButtonNew}
                                        >
                                            {intl.formatMessage({id: "LANGUAGE.GET_VERIFICATION"})} {countDownNew ? <>({countDownNew})</> : null}
                                        </button>
                                    </div>
                                    {errors.phone && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>{errors.phone?.message}</div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type='text'
                                    defaultValue={""}
                                    className={`form-control form-control-lg mt-5 ${errors.phoneNewCode ? 'is-invalid' : ''}`}
                                    {...register('phoneNewCode')}
                                    placeholder={intl.formatMessage({id: "LANGUAGE.PHONE_VERIFICATION"})}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCodePhoneNew(e.target.value)}
                                />
                                {errors.phoneNewCode && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.phoneNewCode?.message}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {intl.formatMessage({id: "LANGUAGE.CANCEL"})}
                    </Button>
                    <Button type={"submit"} variant="primary" disabled={loading}>
                        {!loading && intl.formatMessage({id: "LANGUAGE.SAVE_CHANGE"})}
                        {loading && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                                Please wait...{' '}
                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                        )}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export {PhonePopup}