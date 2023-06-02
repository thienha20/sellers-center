import {Button, Modal} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
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
import {fnApiUrl, fnCurrentApiUrl} from "../../utils/url";

type propsPopup = {
    title: string
    showPopup?: boolean
    onChange?: (bol: boolean) => void
}
type EmailField = {
    email: string
    emailOldCode?: string
    emailNewCode?: string
}


const EmailPopup: (props: propsPopup) => JSX.Element = (props: propsPopup) => {
    const intl = useIntl()
    const time = 60 // limit send sms
    const maxSend = 5
    const [loading, setLoading] = useState<boolean>(false)
    const {title, showPopup = false, onChange} = {...props}
    const [show, setShow] = useState(showPopup)
    const timeEmailOldLimiter = useSelector((state: ReducerInterFace) => state.settings.timerEmailOld)
    const timeEmailNewLimiter = useSelector((state: ReducerInterFace) => state.settings.timerEmailNew)
    const codeVerifyOld = useSelector((state: ReducerInterFace) => state.settings.codeEmailOld)
    const codeVerifyNew = useSelector((state: ReducerInterFace) => state.settings.codeEmailNew)
    const [countGetCodeOld, setCountGetCodeOld] = useState<number>(0)
    const [countGetCodeNew, setCountGetCodeNew] = useState<number>(0)
    const [countDownOld, setCountDownOld] = useState<number>(timeEmailOldLimiter || 0)
    const [countDownNew, setCountDownNew] = useState<number>(timeEmailNewLimiter || 0)
    const [codeEmailOld, setCodeEmailOld] = useState<string>("")
    const [codeEmailNew, setCodeEmailNew] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [activeButtonOld, setActiveButtonOld] = useState<boolean>(false)
    const [activeButtonNew, setActiveButtonNew] = useState<boolean>(false)
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const handleClose = () => {
        setShow(false)
        if (onChange) onChange(false)
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"}))
            .email(intl.formatMessage({id: "LANGUAGE.EMAIL_VALID"})),
        emailOldCode: Yup.string().required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"})),
        emailNewCode: Yup.string().required(intl.formatMessage({id: "LANGUAGE.FIELD_REQUIRED"}))
    })

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<EmailField>({
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
        dispatch(allAction.settings.timeEmailLimiter(time, "old"))
        setCountGetCodeOld(countGetCodeOld + 1)
        await axios.post(fnCurrentApiUrl("/api/notification/email"), {})
            .then(function (response) {
                if (!response || response.status != 200) {
                    return false
                }
                setCodeEmailOld(response.data.code)
                dispatch(allAction.settings.codeEmail(response.data.code, "old"))
                alert.show(intl.formatMessage({id: "LANGUAGE.SEND_EMAIL_SUCCESS"}), {type: "success"})
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
        if (countGetCodeNew >= maxSend || email === user.email) {
            return false
        }
        setCountDownNew(time)
        dispatch(allAction.settings.timeEmailLimiter(time, "new"))
        setCountGetCodeNew(countGetCodeNew + 1)
        await axios.post(fnCurrentApiUrl("/api/notification/email"), {
            email: email,
            verify: true
        })
            .then(function (response) {
                if (!response || response.status != 200) {
                    return false
                }
                if (!response.data || response.data === "") {
                    setCountDownNew(0)
                    dispatch(allAction.settings.timeEmailLimiter(0, "new"))
                    setCountGetCodeNew(countGetCodeNew + 1)
                    document.getElementsByName('email')[0].focus()
                    alert.show(intl.formatMessage({id: "LANGUAGE.EMAIL_EXIST"}), {type: "error"})
                } else {
                    setCodeEmailNew(response.data.code)
                    dispatch(allAction.settings.codeEmail(response.data.code, "new"))
                    alert.show(intl.formatMessage({id: "LANGUAGE.SEND_EMAIL_SUCCESS"}), {type: "success"})
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
                dispatch(allAction.settings.timeEmailLimiter(tam, "old"))
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
                dispatch(allAction.settings.timeEmailLimiter(tam, "old"))
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
        if (codeVerifyOld != md5(user?.email + codeEmailOld)) {
            alert.show(intl.formatMessage({id: "LANGUAGE.CODE_FAIL"}), {type: "error"})
            document.getElementsByName("emailOldCode")[0].focus()
            return false
        }
        if (codeVerifyNew != md5(email + codeEmailNew)) {
            alert.show(intl.formatMessage({id: "LANGUAGE.CODE_FAIL"}), {type: "error"})
            document.getElementsByName("emailNewCode")[0].focus()
            return false
        }
        setLoading(true)
        await axios.post(fnCurrentApiUrl("/api/profiles"), {
            email,
            emailOldCode: codeEmailOld,
            emailNewCode: codeEmailNew
        })
            .then(function (response) {
                setLoading(false)
                if (!response || response.status != 200) {
                    return false
                }
                dispatch(allAction.auth.AuthEmail({
                    userData: {
                        email: email
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
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "LANGUAGE.EMAIL_OLD_VERIFICATION"})}</label>

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
                                            className={`form-control phone-verify-left ${errors.emailOldCode ? 'is-invalid' : ''}`}
                                            {...register('emailOldCode')}
                                            placeholder={intl.formatMessage({id: "LANGUAGE.EMAIL_VERIFICATION"})}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setCodeEmailOld(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {errors.emailOldCode && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.emailOldCode?.message}</div>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className='row mb-6'>
                            <label
                                className='col-lg-3 col-form-label required fw-bold fs-6'>{intl.formatMessage({id: "LANGUAGE.NEW_EMAIL"})}</label>

                            <div className='col-lg-9 fv-row'>
                                <div className='row mt-3'>
                                    <div className='d-flex'>
                                        <div className={"col-6 col-xl-8 col-sm-6 col-xxl-8"}>
                                            <input
                                                type={"email"}
                                                defaultValue={""}
                                                className={`form-control phone-verify-right ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder={intl.formatMessage({id: "LANGUAGE.NEW_EMAIL"})}
                                                {...register('email')}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                                    {errors.email && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>{errors.email?.message}</div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type='text'
                                    defaultValue={""}
                                    className={`form-control form-control-lg mt-5 ${errors.emailNewCode ? 'is-invalid' : ''}`}
                                    {...register('emailNewCode')}
                                    placeholder={intl.formatMessage({id: "LANGUAGE.EMAIL_VERIFICATION"})}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCodeEmailNew(e.target.value)}
                                />
                                {errors.emailNewCode && (
                                    <div className='fv-plugins-message-container'>
                                        <div className='fv-help-block'>{errors.emailNewCode?.message}</div>
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

export {EmailPopup}