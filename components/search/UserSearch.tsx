import React, {useEffect, useMemo, useState} from "react"
import Select from 'react-select'
import {useIntl} from "react-intl"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

type propsOrderSearch = {
    found_number?: number | string | string[],
    search_name?: string | null | undefined | string[],
    search_email?: string | null | undefined | string[],
    search_status?: string | null | undefined | string[],
    // search_phone?: string | null | undefined | string[],
    submitSearchHandler: Function
}

const UserSearch: (props: propsOrderSearch) => JSX.Element = (props: propsOrderSearch) => {
    const intl = useIntl()
    const {search_name, search_email, search_status, submitSearchHandler} = {...props}
    const [show, setShow] = useState(false)

    const [searchName, setSearchName] = useState(search_name)
    // const [searchPhone, setSearchPhone] = useState(search_phone);
    const [searchEmail, setSearchEmail] = useState(search_email)
    const [searchStatus, setSearchStatus] = useState(search_status)
    const options: { value: string, label: string }[] = useMemo(() => [
        {value: 'A', label: intl.formatMessage({id: 'LANGUAGE.ACTIVE'}) ?? ""},
        {value: 'H', label: intl.formatMessage({id: 'LANGUAGE.HIDDEN'}) ?? ""},
    ], [])

    useEffect(() => {
        setSearchName(search_name)
    }, [search_name])
    useEffect(() => {
        setSearchEmail(search_email)
    }, [search_email])
    useEffect(() => {
        setSearchStatus(search_status)
    }, [search_status])

    return (
        <>
            <div className="card mb-7">
                <div className="card-body">
                    <div className="d-block d-md-flex align-items-center">
                        <div className="position-relative w-md-400px me-md-2">
                            <span
                                className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none">
                                    <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                                          transform="rotate(45 17.0365 15.1223)" fill="black"></rect>
                                    <path
                                        d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                                        fill="black"></path>
                                </svg>
                            </span>
                            <input type="text"
                                   className="form-control ps-10" name="search_name"
                                   value={searchName ?? ""}
                                   placeholder={intl.formatMessage({id: 'LANGUAGE.FULL_NAME'})}
                                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                                   onKeyPress={(e) => {
                                       if (e.code == "Enter") {
                                           submitSearchHandler({
                                               search_name: searchName,
                                               search_status: searchStatus,
                                               search_email: searchEmail
                                           })
                                       }
                                   }}
                            />
                        </div>
                        <div className="d-block d-md-flex align-items-center">
                            <button type="button"  className="btn btn-primary me-5 fs-7 w-100 w-sm-auto mt-3 mt-sm-0" onClick={() => {
                                submitSearchHandler({
                                    search_name: searchName,
                                    search_status: searchStatus,
                                    search_email: searchEmail
                                })
                            }}>{intl.formatMessage({id: 'LANGUAGE.SEARCH'})}</button>
                            <button type="button" className="fs-7 btn btn-link" onClick={() => {
                                setShow(!show)
                            }}>{intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})}
                                {show ? <FontAwesomeIcon className='ms-2' icon={faArrowUp} />:<FontAwesomeIcon className='ms-2' icon={faArrowDown} />}
                            </button>
                        </div>
                    </div>
                    <div className={`collapse ${show ? 'show' : ''}`} id="kt_advanced_search_form">
                        <div className="separator separator-dashed mt-9 mb-6"></div>
                        <div className="row g-8 mb-8">
                            <div className="col-xl-6">
                                <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.EMAIL'})}</label>
                                <input type="text" className="form-control"
                                       value={searchEmail ?? ""}
                                       name="search_email"
                                       placeholder={intl.formatMessage({id: 'LANGUAGE.EMAIL'})}
                                       onChange={
                                           (e: React.ChangeEvent<HTMLInputElement>) => {
                                               setSearchEmail(e.target.value)
                                           }
                                       }
                                       onKeyPress={(e) => {
                                            if (e.code == "Enter") {
                                                submitSearchHandler({
                                                    search_name: searchName,
                                                    search_status: searchStatus,
                                                    search_email: searchEmail
                                                })
                                            }
                                       }}
                                />
                            </div>
                            <div className="col-xl-6">
                                <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.STATUS'})}</label>
                                <Select options={options} isClearable name="status"
                                        value={options.filter(item => item.value === searchStatus)}
                                        onChange={
                                            (option: any) => {
                                                if (option)
                                                    setSearchStatus(option.value)
                                                else setSearchStatus("")
                                            }
                                        }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export {UserSearch}
