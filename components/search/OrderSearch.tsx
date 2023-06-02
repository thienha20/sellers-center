import React, {MouseEvent, useCallback, useEffect, useMemo, useRef, useState} from "react"
import axios from "axios"
import DateRangePicker from 'react-bootstrap-daterangepicker'
import Select from 'react-select'
import {useLang} from "../../components/i18n/Metronici18n"
import {Obj} from "../../utils/types"
import {useIntl} from "react-intl"
import {Button} from "react-bootstrap"
import {fnCurrentApiUrl} from "../../utils/url"
import _ from "lodash"

type propsOrderSearch = {
    found_number?: number | string | string[],
    total_items?: number | null | undefined | string[] | string,
    search_query?: string | null | undefined | string[],
    order_nr?: string | null | undefined | string[],
    search_customer_name?: string | null | string[] | undefined,
    status?: string | null | string[] | undefined,
    order_status?: string | null | string[] | undefined,
    payment_ids?: number | null | string[] | undefined | string,
    date_from?: string | null | undefined | string[],
    date_to?: string | null | undefined | string[],
    lang_code?: string | null | undefined | string[]
    submitSearchHandler: Function
}

const OrderSearch: (props: propsOrderSearch) => JSX.Element = (props: propsOrderSearch) => {
    const intl = useIntl()
    const {
        order_nr, search_customer_name, payment_ids, date_from, date_to, status,
        submitSearchHandler
    } = {...props}
    const list_status = useMemo(() => [
        {value: 'P', label: intl.formatMessage({id: 'LANGUAGE.PAID'})},
        {value: 'O', label: intl.formatMessage({id: 'LANGUAGE.WAITING_CONFIRM'})},
        {value: 'A', label: intl.formatMessage({id: 'LANGUAGE.CONFIRMED'})},
        {value: 'E', label: intl.formatMessage({id: 'LANGUAGE.PACKING'})},
        {value: 'G', label: intl.formatMessage({id: 'LANGUAGE.HANDED_OVER_AND_SHIPPED'})},
        {value: 'H', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY'})},
        {value: 'C', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY_SUCCESSFUL'})},
        {value: 'F', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY_FAILED'})},
        {value: 'D', label: intl.formatMessage({id: 'LANGUAGE.CANCELLED_BY_SELLER'})},
        {value: 'I', label: intl.formatMessage({id: 'LANGUAGE.CANCELLED_BY_CUSTOMER'})},
        {value: 'B', label: intl.formatMessage({id: 'LANGUAGE.RETURNS'})}
    ], [intl])
    const [show, setShow] = useState<boolean>(false)

    const lang: string = useLang() ?? "vi"
    const [orderNr, setOrderNr] = useState<string | string[] | null | undefined>(order_nr ?? "")
    const [searchCustomerName, setSearchCustomerName] = useState<string | string[] | null | undefined>(search_customer_name ?? "")
    const [dateFrom, setDateFrom] = useState<string | string[] | null | undefined>(date_from ?? "")
    const [dateTo, setDateTo] = useState<string | string[] | null | undefined>(date_to ?? "")
    const [payments, setPayments] = useState<Obj[]>([])
    const [calendar, setCalendar] = useState<string>("")
    const [paymentIds, setPaymentIds] = useState<Obj | null>(payments.filter(i => i.value === payment_ids)[0])
    const [_status, setStatus] = useState<Obj | null>(list_status.filter(i => i.value === status)[0])
    const refer = useRef<DateRangePicker>(null)
    const format = useMemo(() => {
        return lang == "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"
    }, [lang])
   
    useEffect(() => {
        setOrderNr(order_nr)
    }, [order_nr])

    useEffect(() => {
        setSearchCustomerName(search_customer_name)
    }, [search_customer_name])

    useEffect(() => {
        let str:string = ""
        if(!dateTo && !dateFrom) setCalendar("")
        else{

            if(dateFrom){
                str += dateFrom + " - "
            }else{
                str += "null - "
            }
            if(dateTo){
                str += dateTo
            }else{
                str += "null"
            }
            setCalendar(str)
        }
    }, [dateTo, dateFrom])
    useEffect(() => {
        if (!status) {
            setStatus(null)
        } else {
            setStatus(list_status.filter(i => i.value === status)[0])
        }
    }, [status])
    useEffect(() => {
        if (!payment_ids) {
            setPaymentIds(null)
        } else {
            setPaymentIds(payments.filter(i => i.value === payment_ids)[0])
        }
    }, [payment_ids, payments])

    useEffect(() => {
        if (date_from != dateFrom) {
            setDateFrom(date_from)
            if (!date_from) {
                refer.current?.setStartDate(new Date())
            } else {
                refer.current?.setStartDate(date_from)
            }
        }
    }, [date_from])

    useEffect(() => {
        if (date_to != dateTo) {
            setDateTo(date_to)
            if (!date_to) {
                refer.current?.setEndDate(new Date())
            } else {
                refer.current?.setEndDate(date_to)
            }
        }
    }, [date_to])

    const res_payments = useCallback(() => {
        return axios.post(fnCurrentApiUrl("/api/payments"), {
            lang_code: lang,
        })
    }, [lang])

    //API payments
    useEffect(() => {
        let _payments: Obj[] = []
        res_payments().then(response => {
            const _payment_data = response.data.data
            if (_payment_data) {
                for (let k in _payment_data) {
                    _payments.push({value: k, label: _payment_data[k]['payment']})
                }
            }
            setPayments(_payments)
        })
    }, [res_payments])

    /* Use react hook to get width Start */
    const width = window.innerWidth
    useEffect(() => {
        if (width > 992) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [width])
    /* Use react hook to get width End */
    return (
        <>
            <div className="card mb-7">
                <div className="card-body">
                    <div className="position-relative w-100 me-md-2">
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
                        <input type="text" className="form-control ps-10" name="search_order_nr"
                               value={orderNr ?? ''}
                               placeholder={intl.formatMessage({id: 'LANGUAGE.SEARCH_ORDER_NUMBER'})}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderNr(e.target.value)}
                               onKeyPress={(e) => {
                                   if (e.code == "Enter") {
                                       // TODO: Submit
                                       submitSearchHandler({
                                           order_nr: orderNr,
                                           search_customer_name: searchCustomerName,
                                           payment_ids: paymentIds?.value,
                                           date_from: dateFrom,
                                           date_to: dateTo,
                                           status: _status?.value
                                       })
                                   }
                               }}/>
                    </div>
                    <div className={`collapse ${show ? 'show' : ''}`} id="kt_advanced_search_form">
                        <div className="row">
                            <div className="col-12 mt-3">
                                <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.CUSTOMER_NAME'})}</label>
                                <input type="text" className="form-control form-control"
                                       name="search_customer_name"
                                       placeholder={intl.formatMessage({id: 'LANGUAGE.CUSTOMER_NAME'})}
                                       onChange={
                                           (e: React.ChangeEvent<HTMLInputElement>) => {
                                               setSearchCustomerName(e.target.value)
                                           }
                                       }
                                       value={searchCustomerName ?? ""}
                                       onKeyPress={(e) => {
                                           if (e.code == "Enter") {
                                               // TODO: Submit
                                               submitSearchHandler({
                                                   order_nr: orderNr,
                                                   search_customer_name: searchCustomerName,
                                                   payment_ids: paymentIds?.value,
                                                   date_from: dateFrom,
                                                   date_to: dateTo,
                                                   status: _status?.value
                                               })
                                           }
                                       }}
                                />
                            </div>
                            <div className="col-12 mt-3">
                               <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.STATUS'})}</label>
                               <Select options={list_status} isClearable name="status"
                                       onChange={
                                          (option: any) => {
                                            setStatus(option)
                                           }
                                        }
                                        value={_status}
                               />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 mt-3 DateRangePicker">
                                <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.ORDER_DATE'})}</label>
                                <DateRangePicker
                                    initialSettings={{
                                        autoUpdateInput: false,
                                        locale: {
                                            format: format,
                                            cancelLabel: 'Clear'
                                        },
                                    }}
                                    ref={refer}
                                    onApply={(event: any, picker: DateRangePicker) => {
                                        // @ts-ignore
                                        setDateFrom(picker?.startDate?.format(format))
                                        // @ts-ignore
                                        setDateTo(picker?.endDate?.format(format))
                                    }}
                                    onCancel={(event: any, picker: DateRangePicker) => {
                                        setDateFrom(null)
                                        setDateTo(null)
                                        picker.setStartDate(new Date())
                                        picker.setEndDate(new Date())
                                    }}
                                >
                                    <input className="form-control"
                                           name="date_time"
                                           placeholder={intl.formatMessage({id: 'LANGUAGE.SELECT_DATE'})}
                                           id="kt_datepicker_1"
                                           autoComplete={"off"}
                                           defaultValue={calendar}
                                    />
                                </DateRangePicker>
                            </div>
                            <div className="col-12 mt-3">
                                <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.PAYMENT_METHODS'})}</label>
                                <Select options={payments} isClearable name="paymentIds"
                                        onChange={
                                            (option: any) => {
                                                setPaymentIds(option)
                                            }
                                        }
                                        value={paymentIds}
                                />
                            </div>
                        </div>
                    </div>
                    <button className="btn w-100 btn-sm btn-primary me-5 fs-7 mt-3" onClick={() => {
                        // TODO: đổi chỗ này
                        submitSearchHandler({
                            order_nr: orderNr,
                            search_customer_name: searchCustomerName,
                            payment_ids: paymentIds?.value,
                            date_from: dateFrom,
                            date_to: dateTo,
                            status: _status?.value
                        })
                    }}>{intl.formatMessage({id: 'LANGUAGE.SEARCH'})}</button>
                    <Button className="fs-7 d-lg-none" variant={"link"} onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        if (show) {
                            e.currentTarget.innerHTML = intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})
                        } else {
                            e.currentTarget.innerHTML = intl.formatMessage({id: 'LANGUAGE.CLOSE_ADVANCED_SEARCH'})
                        }
                        setShow(!show)
                    }}>{intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})}</Button>
                </div>
            </div>
        </>
    )
}

export {OrderSearch}
