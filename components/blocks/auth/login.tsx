import React, {FC, useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import Link from 'next/link'
import {useForm} from "react-hook-form"
import {yupResolver} from '@hookform/resolvers/yup'
import {useIntl} from 'react-intl'
import axios from "axios";
import {useRouter} from "next/router"
import {useAlert} from 'react-alert'
import { useLang } from '../../i18n/Metronici18n'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEyeSlash, faEye} from "@fortawesome/free-solid-svg-icons";
import {fnCurrentApiUrl} from "../../../utils/url";

type loginField = {
    emailOrPhone: string
    password: string
    lang?:string
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

// xem example https://www.bezkoder.com/react-hook-form-typescript/
const validationSchema = Yup.object().shape({
    emailOrPhone: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Field is required'),
    password: Yup.string()
        .min(3, 'Minimum 3 symbols')
        .max(50, 'Maximum 50 symbols')
        .required('Password is required')
})


const LoginBlock: FC = () => {
    const intl = useIntl()
    const [loading, setLoading] = useState<boolean>(false)
    const [loginError, setLoginError] = useState<boolean>(false)
    const router = useRouter()
    const alert = useAlert()
    const lang:string = useLang() ?? "vi"
    // const dispatch = useDispatch()

    /* Show PassWord Or Hide PassWord Start */
    const[eye,setEye]=useState(true);
    const[showpass,setShowpass]=useState("password");
    const showPassword = () =>{
        if(showpass=="password"){
            setShowpass("text")
            setEye(false)
        }
        else{
            setShowpass("password")
            setEye(true)
        }
    }
    /* Show PassWord Or Hide PassWord End */

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<loginField>({
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (data: loginField) => {
        // console.log('data',data);
        data.lang = lang
        // alert.show('Oh look, an alert!')
        // alert.show('Oh look, an alert!',{type: "error"})
        // alert.show('Oh look, an alert!',{type: "success"})
        setLoading(true)
        await axios.post(fnCurrentApiUrl("/api/login"), data)
            .then(function (response) {
                if (!response || response.status != 200) {
                    setLoginError(true)
                    setLoading(false)
                    return false
                }
                const {return_url} = router.query
                if (return_url) {
                    // router.push(return_url as string)
                    window.location.href = return_url as string
                }
                else{
                    // router.push("/")
                    window.location.href = "/"
                }

            })
            .catch(function (error) {
                // handle error

                if(error.response.data.hasOwnProperty('messages') ){
                    error.response.data.messages.forEach( (message : String) => {
                        alert.show(message,{type: "error"})
                    }  )

                }
                setLoading(false)
            });
    }

    return (
        <form
            className='form w-100'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            id='kt_login_signin_form'
        >
            {/* begin::Heading */}
            <div className='text-center mb-10'>
                <h1 className='text-dark mb-3'>{intl.formatMessage({id: 'LOGIN.SIGN_IN_SELLER_CENTER'})}</h1>
                <div className='text-gray-400 fw-bold fs-4'>
                    <span>{intl.formatMessage({id: 'LOGIN.PARTNER'})}</span>
                    <Link passHref href={'https://www.tatmart.com/dang-ky-ban-hang-cung-tatmart/'}>
                        <a className='link-primary fw-bolder'>
                            {intl.formatMessage({id: 'LOGIN.CREATE_ACCOUNT'})}
                        </a>
                    </Link>
                </div>
            </div>
            {/* begin::Heading */}
            {
                loginError && (
                    <div className='mb-lg-15 alert alert-danger'>
                        <div
                            className='alert-text font-weight-bold'>{intl.formatMessage({id: 'LOGIN.ACCOUNT_INVALID'})}</div>
                    </div>
                )
            }

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
                <label
                    className='form-label fs-6 fw-bolder text-dark'> {intl.formatMessage({id: 'LOGIN.EMAIL_PHONE'})}</label>
                <input
                    className={clsx(
                        'form-control form-control-lg form-control-solid',
                        `${Object.keys(errors).length > 0 ? (errors.emailOrPhone ? 'is-invalid' : 'is-valid') : ''}`
                    )}
                    {...register('emailOrPhone')}
                    type='text'
                    name='emailOrPhone'
                    autoComplete='off'
                />
                {errors.emailOrPhone && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                        <span role='alert'>{errors.emailOrPhone?.message}</span>
                    </div>
                )}
            </div>
            {/* end::Form group */}
            {/* begin::Form group */}
            <div className='fv-row mb-10'>
                <div className='d-flex justify-content-between mt-n5'>
                    <div className='d-flex flex-stack mb-2'>
                        {/* begin::Label */}
                        <label
                            className='form-label fw-bolder text-dark fs-6 mb-0'>{intl.formatMessage({id: 'LOGIN.PASSWORD'})}</label>
                        {/* end::Label */}
                    </div>
                </div>
                <div className="input-text">
                    <input
                        type={showpass}
                        autoComplete='off'
                        {...register('password')}
                        className={clsx(
                            'showpass form-control form-control-lg form-control-solid',
                            `${Object.keys(errors).length > 0 ? (errors.password ? 'is-invalid' : 'is-valid') : ''}`
                        )}
                    />
                    <FontAwesomeIcon onClick={showPassword} icon={eye === true ? faEyeSlash : faEye } />
                </div>
                {errors.password && (
                    <div className='fv-plugins-message-container invalid-feedback'>
                        <div className='fv-help-block'>
                            <span role='alert'>{errors.password?.message}</span>
                        </div>
                    </div>
                )}
            </div>
            {/* end::Form group */}
            {/*<TinyEditor companyId={98} userId={10} securityHash={"85297cb266ec9ce6c4e3675552b055ef"}/>*/}
            {/* begin::Action */}
            <div className='text-center'>
                <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-lg btn-primary w-100 mb-5'
                    disabled={Object.keys(errors).length > 0}
                >
                    {!loading &&
                    <span className='indicator-label'>{intl.formatMessage({id: 'LOGIN.CONTINUE'})}</span>}
                    {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                                  {intl.formatMessage({id: 'LOGIN.PLEASE_WAIT'})}...
                                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                    )}
                </button>
            </div>
            {/* end::Action */}

            {/* begin::Link */}
            <Link href='https://www.tatmart.com/phuc-hoi-tai-khoan/' passHref>
                <a target={'_blank'} className='link-primary fs-6 fw-bolder' style={{marginLeft: '5px'}}>
                    {intl.formatMessage({id: 'LOGIN.FORGOT_PASSWORD'})}
                </a>
            </Link>
            {/* end::Link */}
        </form>
    )
}

export default LoginBlock