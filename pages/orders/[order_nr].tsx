import Head from 'next/head'
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from "react"
import { MasterLayout } from "../../components/layout/MasterLayout"
import { fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl } from "../../utils/url"
import { NextPageWithLayout, Obj } from "../../utils/types"
import { useIntl } from "react-intl"
import { useLang } from '../../components/i18n/Metronici18n'
import { useRouter } from "next/router"
import axios from "axios"
import _ from 'lodash'
import { ProductOrderTable } from '../../components/tables/productOrderTable'
import { fnPriceFormat } from "../../utils/price"
import { OrderHistoryTable } from '../../components/tables/orderHistoryTable'
import { TabOrderHistory } from '../../components/tabs/tabOrderHistory'
import { fnFullName } from "../../utils/fullName"
import { useAlert } from 'react-alert'
import Select from 'react-select'
import { usePageData } from "../../components/layout/core"
import { Button, Dropdown, DropdownButton, Modal } from 'react-bootstrap'

type paramType = {
    order_nr?: string,
    tab_order?: string | string[],
}

type paramStatusType = {
    status?: string,
    notify_user?: string | string[],
    order_id?: number | string | string[],
    lang_code?: string | string[],
    cancel_note?: string | string[],
    custom?: string | string[],
    note?: string | string[],
    label_reason?: string | string[],
    cancel_reason_id?: number | string | string[],
}

const Detail: NextPageWithLayout = () => {
    const intl = useIntl()
    const router = useRouter()
    const alert = useAlert()
    const [showPopupCancel, setShowPopupCancel] = useState<boolean>(false);
    const handleClosePopupCancel = () => setShowPopupCancel(false);
    const handleShowPopupCancel = () => setShowPopupCancel(true);

    const [showPopupConfirm, setShowPopupConfirm] = useState<boolean>(false);

    const handleClosePopupConfirm = () => setShowPopupConfirm(false);
    const handleShowPopupConfirm = () => setShowPopupConfirm(true);
    const list_status = useMemo(() => [
        { value: 'P', label: intl.formatMessage({ id: 'LANGUAGE.PAID' }) },
        { value: 'O', label: intl.formatMessage({ id: 'LANGUAGE.WAITING_CONFIRM' }) },
        { value: 'A', label: intl.formatMessage({ id: 'LANGUAGE.CONFIRMED' }) },
        { value: 'E', label: intl.formatMessage({ id: 'LANGUAGE.PACKING' }) },
        { value: 'G', label: intl.formatMessage({ id: 'LANGUAGE.HANDED_OVER_AND_SHIPPED' }) },
        { value: 'H', label: intl.formatMessage({ id: 'LANGUAGE.DELIVERY' }) },
        { value: 'C', label: intl.formatMessage({ id: 'LANGUAGE.DELIVERY_SUCCESSFUL' }) },
        { value: 'F', label: intl.formatMessage({ id: 'LANGUAGE.DELIVERY_FAILED' }) },
        { value: 'D', label: intl.formatMessage({ id: 'LANGUAGE.CANCELLED_BY_SELLER' }) },
        { value: 'I', label: intl.formatMessage({ id: 'LANGUAGE.CANCELLED_BY_CUSTOMER' }) },
        { value: 'B', label: intl.formatMessage({ id: 'LANGUAGE.RETURNS' }) }
    ], [intl])

    const list_color_status = useMemo(() => [
        { value: 'P', label: "#33B44A" },
        { value: 'O', label: "#FAA51A" },
        { value: 'A', label: "#33B44A" },
        { value: 'E', label: "#33B44A" },
        { value: 'G', label: "#33B44A" },
        { value: 'H', label: "#33B44A" },
        { value: 'C', label: "#33B44A" },
        { value: 'F', label: "#EB5757" },
        { value: 'D', label: "#EB5757" },
        { value: 'I', label: "#EB5757" },
        { value: 'B', label: "#33B44A" }
    ], [intl])

    let _list_status: Obj = useMemo(() => {
        let objStatus: Obj = {}
        list_status.forEach(s => {
            objStatus[`${s.value}`] = s.label
        })
        return objStatus
    }, [list_status])

    let _list_color_status: any = {}
    list_color_status.forEach(s => {
        _list_color_status[`${s.value}`] = s.label
    })
    const lang: string = useLang() ?? "vi"
    const [order, setOrder] = useState<Obj>({})
    const [extra, setExtra] = useState<Obj>({})
    const [paymentMethod, setPaymentMethod] = useState<Obj>({})
    const [taxes, setTaxes] = useState<Obj>({})
    const [orderHistories, setOrderHistory] = useState<Obj>([])
    const [params, setParams] = useState<paramType>({})
    const [tabOrder, setTabOrder] = useState<string | string[]>('')
    const [labelStatus, setLabelStatus] = useState<string>('')
    const [cancelNote, setCancelNote] = useState<string>('')
    const [status_order, setStatusOrder] = useState<string>('')
    const [cancelReasonId, setCancelReasonId] = useState('')
    const [orderReason, setOrderReason] = useState<Obj[]>([])
    const [custom, setCustom] = useState<string>('')
    const [labelReason, setLabelReason] = useState<string>('')
    const [note, setNote] = useState<string>('')
    const { order_nr, tab_order } = router.query
    const { setPageBreadcrumbs } = usePageData()
    const [coupons, setCoupons] = useState<Obj>([])
    const [color, setColor] = useState<string>('')
    const [disabled, setDisabled] = useState<boolean>(false)
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({ id: "ORDER.ORDER" }),
                path: "/orders"
            }, {
                title: intl.formatMessage({ id: "ORDER.ORDER" }) + ': ' + order_nr?.toString(),
                isActive: true
            }
        ])
    }, [order_nr])

    useEffect(() => {
        if (router.isReady) {
            const call_api = () => {
                return axios.post(fnCurrentApiUrl(`/api/orders/${order_nr}`))
            }
            call_api().then((res) => {
                if (_.isEmpty(res.data)) {
                    window.location.href = "/404"
                }
                setOrder(res.data)
                setCancelNote(res.data.cancel_note)
                setLabelStatus(_list_status[res.data.status])
                setColor(_list_color_status[res.data.status])
                setStatusOrder(res.data.status)
                if (tab_order) {
                    setTabOrder(tab_order)
                }
            })
        }

    }, [router.isReady, order_nr, tab_order, _list_status])

    useEffect(() => {
        let _order_reasons: Obj[] = []
        const res_order_reason = () => {
            return axios.post(fnCurrentApiUrl("/api/orders/order_reason"), {
                lang_code: lang,
            })
        }
        res_order_reason().then(response => {
            const _order_reason_data = response.data
            if (_order_reason_data) {
                for (let k in _order_reason_data) {
                    _order_reasons.push({
                        value: k,
                        label: _order_reason_data[k]['description'],
                        custom: _order_reason_data[k]['custom']
                    })
                }
            }
            setOrderReason(_order_reasons)
        })
    }, [lang])
    useEffect(() => {
        if (!_.isEmpty(order) && !_.isEmpty(order.payment_online_status?.extra)) {
            setExtra(JSON.parse(order.payment_online_status.extra))
        }
        if (!_.isEmpty(order) && !_.isEmpty(order.payment_method)) {
            setPaymentMethod(order.payment_method)
        }
        if (!_.isEmpty(order) && !_.isEmpty(order.taxes)) {
            for (let tax in order.taxes) {
                setTaxes(order.taxes[tax])
                break
            }
        }
        if (!_.isEmpty(order) && !_.isEmpty(order.coupons)) {
            setCoupons(order.coupons);
        }

    }, [order])


    useEffect(() => {
        if (router.isReady) {
            const res_order_history = (params: paramType) => {
                return axios.post(fnCurrentApiUrl("/api/orders/order_history"), {
                    order_nr: `${order_nr}`,
                })
            }
            res_order_history(params).then(response => {
                setOrderHistory(response.data)
                if (params.tab_order && params.tab_order !== '') {
                    setTabOrder(params.tab_order)
                } else {
                    setTabOrder('')
                }
            })
        }
    }, [params, router.isReady, order_nr])


    useEffect(() => {
        if (tab_order) {
            setTabOrder(tab_order)
        }
    }, [tab_order])

    useEffect(() => {
        if (_.isEmpty(cancelReasonId)) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [disabled])

    const handleOrderHistory = (tab_order: any) => {
        let merged_params = { ...params, ...tab_order }
        setParams(merged_params)
    }
    const tabHistory: () => JSX.Element = () => {
        return (
            <div className={'card card-flush mb-5'}>
                <div className={'card-body'}>
                    <div className="row">
                        <div className="col-xl-12">
                            <OrderHistoryTable orderHistories={orderHistories} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const selectOtherReason: () => JSX.Element = () => {
        return (
            <div>
                <label className="mt-2">{intl.formatMessage({ id: 'ORDER.REASON' })}</label>
                <textarea className="form-control" onChange={
                    (e: any) => {
                        setNote(e.target.value)
                    }
                }></textarea>
            </div>
        )
    }

    const handleUpdateStatus = (status: any, notify_user: any = 'Y', order_id: number) => {
        const new_params: any = []
        new_params.status = status
        new_params.notify_user = notify_user
        new_params.order_id = order_id
        new_params.lang_code = lang
        const update_status = (paramsStatus: paramStatusType) => {
            return axios.post(fnCurrentApiUrl("/api/orders/update/status"), {
                status: paramsStatus.status,
                notify_user: paramsStatus.notify_user,
                order_id: paramsStatus.order_id,
                lang_code: paramsStatus.lang_code
            })
        }
        update_status(new_params).then(response => {
            setShowPopupConfirm(false)
            if (response.data) {
                setLabelStatus(_list_status[response.data.status])
                setCancelNote(response.data.cancel_note)
                setColor(_list_color_status[response.data.status])
                setStatusOrder(response.data.status)
                alert.show(intl.formatMessage({ id: 'ORDER.ORDER_CONFIRMATION_SUCCESSFUL' }), { type: "success" })
            }
        })
    }
    const handleCancelOrder = (params_cancel: paramStatusType) => {
        const new_params: any = []
        if (_.isEmpty(params_cancel.cancel_reason_id)) {
            alert.show(intl.formatMessage({ id: 'ORDER.PLEASE_CHOOSE_A_REASON' }), { type: "error" })
            return false
        }
        new_params.cancel_reason_id = params_cancel.cancel_reason_id
        new_params.lang_code = lang
        new_params.order_id = order.order_id
        new_params.notify_user = 'Y'
        if (params_cancel.custom == 'Y') {
            new_params.cancel_note = params_cancel.note
        } else {
            new_params.cancel_note = params_cancel.label_reason
        }
        const update_status = (paramsStatus: paramStatusType) => {
            return axios.post(fnCurrentApiUrl("/api/orders/update/status"), {
                status: 'D',
                cancel_reason_id: paramsStatus.cancel_reason_id,
                cancel_note: paramsStatus.cancel_note,
                notify_user: paramsStatus.notify_user,
                order_id: paramsStatus.order_id,
                lang_code: paramsStatus.lang_code
            })
        }
        update_status(new_params).then(response => {
            setShowPopupCancel(false)
            if (response.data) {
                setLabelStatus(_list_status[response.data.status])
                setCancelNote(response.data.cancel_note)
                setColor(_list_color_status[response.data.status])
                setStatusOrder(response.data.status)
                alert.show(intl.formatMessage({ id: 'ORDER.ORDER_CONFIRMATION_SUCCESSFUL' }), { type: "success" })
            }
        })
    }
    const tabGeneral: () => JSX.Element = () => {
        return (
            <>
                <div className="card card-flush mb-5">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xl-5">
                                <h4 className={'mb-3'}>{intl.formatMessage({ id: 'ORDER.ORDER_STATUS' })}:</h4>
                                <span style={{ color: color }}>{labelStatus}</span>
                                {_.isEmpty(cancelNote) ? '' : (<p>
                                    <strong>{intl.formatMessage({ id: 'ORDER.REASON' })}: </strong>
                                    {cancelNote}
                                </p>)}

                            </div>
                            <div className="col-xl-7 thong_tin_thanh_toan">
                                <h4 className={'mb-3'}>{intl.formatMessage({ id: 'ORDER.PAYMENT_INFO' })}:</h4>
                                <div className="row">
                                    <div className="col-6 col-xl-5">
                                        <strong>{intl.formatMessage({ id: 'ORDER.METHOD' })}:</strong></div>
                                    <div className="col-6 col-xl-7">
                                        {paymentMethod.payment}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-xl-5">
                                        <strong>{intl.formatMessage({ id: 'ORDER.PAYMENT_STATUS' })}:</strong></div>
                                    <div className="col-6 col-xl-7">
                                        {extra.message}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-xl-5">
                                        <strong>{intl.formatMessage({ id: 'ORDER.PAYMENT_TYPE' })}:</strong>
                                    </div>
                                    <div className="col-6 col-xl-7">
                                        {extra.payment_type}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-xl-5">
                                        <strong>{intl.formatMessage({ id: 'ORDER.REFERENCE_CODE' })}:</strong></div>
                                    <div className="col-6 col-xl-7">
                                        {extra.reference_number}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-xl-5">
                                        <strong>{intl.formatMessage({ id: 'ORDER.NUMBER_OF_TRANSACTIONS' })}:</strong>
                                    </div>
                                    <div className="col-6 col-xl-7">{extra.transaction_ref_no}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card card-flush mb-5">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="table-responsive">
                                    <ProductOrderTable products={order.products as Obj} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card card-flush mb-5">
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.PROVISIONAL' })}:</strong>
                            </div>
                            <div className="col-7">
                                {fnPriceFormat(order.subtotal)}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.SHIPPING_FEE' })}:</strong>
                            </div>
                            <div className="col-7">
                                {fnPriceFormat(order.display_shipping_cost)}
                            </div>
                        </div>
                        {order.subtotal_discount ? (<div className="row mb-3">
                            <div className="col-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.SUBTOTAL_DISCOUNT' })}:</strong>
                            </div>
                            <div className="col-7">
                                {fnPriceFormat(order.subtotal_discount)}
                            </div>
                        </div>) : ""}
                        {couponOrder(coupons)}
                        {taxOrder(taxes)}
                        {!_.isEmpty(order.tax_exempt) && order.tax_exempt == "Y" ? (<div className="row mb-3">
                            <div className="col-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.TAX_EXEMPT' })}:</strong>
                            </div>
                            <div className="col-7">

                            </div>
                        </div>) : ""}
                        {order.payment_surcharge ? (<div className="row mb-3">
                            <div className="col-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.PAYMENT_SURCHARGE' })}:</strong>
                            </div>
                            <div className="col-7">
                                {fnPriceFormat(order.payment_surcharge)}
                            </div>
                        </div>) : ""}

                        <div className="row mb-3">
                            <div className="col-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.WEIGHT' })}:</strong>
                            </div>
                            <div className="col-7">
                                {order.weight} kg
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-5">
                                <h3>{intl.formatMessage({ id: 'ORDER.TOTAL' })}:</h3>
                            </div>
                            <div className="col-7">
                                <h3>{fnPriceFormat(order.total)}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card card-flush mb-5">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-xl-5">
                                <strong>{intl.formatMessage({ id: 'ORDER.CUSTOMER_NOTE' })}:</strong>
                            </div>
                            <div className="col-xl-7">
                                {order.notes}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    const taxOrder = (taxes: Obj) => {
        return _.isEmpty(taxes) ? <></> : <>
            <div className="row mb-3">
                <div className="col-5">
                    <strong>{intl.formatMessage({ id: 'ORDER.TAX' })}:</strong>
                </div>
                <div className="col-7">
                    {Math.floor(taxes.rate_value)}%
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-5">
                    <strong>{taxes.description} {intl.formatMessage({ id: 'ORDER.INCLUDE' })} ({taxes.regnumber}):</strong>
                </div>
                <div className="col-7">
                    {fnPriceFormat(taxes.tax_subtotal)}
                </div>
            </div>
        </>;
    }
    const couponOrder = (coupons: Obj) => {
        let elm: ReactElement[] = []
        if (!_.isEmpty(coupons)) {
            for (let coupon in coupons) {
                elm.push(<div className="row mb-3">
                    <div className="col-5">
                        <strong>{intl.formatMessage({ id: 'ORDER.DISCOUNT_COUPON_CODE' })}:</strong>
                    </div>
                    <div className="col-7">
                        {coupon}
                    </div>
                </div>);
            }
        }
        return elm;
    }

    return (
        <>
            <Head>
                <title>{intl.formatMessage({ id: 'ORDER.ORDER' })}: #{order.order_nr} </title>
                <meta name="description" content="Product" />
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")} />
            </Head>
            <div className={"mb-5 mb-xl-10"}>
                <div className="row">
                    <div className="col-xl-9">
                        <div className="card card-flush mb-5">
                            <div className="card-body">
                                <TabOrderHistory submitLinkOrderStatus={handleOrderHistory} tabCurrent={tab_order}
                                    link={fnUrlQueryBuilder(`orders/${order_nr}`, {})} />
                            </div>
                        </div>
                        {tabOrder === '' ? tabGeneral() : tabHistory()}
                    </div>
                    <div className="col-xl-3">
                        <div className={`card card-flush mb-5 ${status_order == 'O' ? '' : 'd-none'}`}>
                            <div className="card-body ">
                                <div className={'mb-5'}>
                                    <h3 className="card-title mb-3"><span
                                        className="card-label fw-bolder fs-3">{intl.formatMessage({ id: 'ORDER.ORDER_PROCESSING' })}</span>
                                    </h3>
                                    <Button className={`btn btn-sm btn-outline-primary mr-4 btn-primary`} style={{ marginRight: 10, marginBottom:10 }} variant="success"
                                        onClick={handleShowPopupConfirm}>{intl.formatMessage({ id: 'AUTH.GENERAL.SUBMIT_BUTTON' })}</Button><br />
                                    <Button className="btn btn-outline-primary btn-sm btn-primary" variant="danger" onClick={handleShowPopupCancel}>
                                        {intl.formatMessage({ id: 'ORDER.CONFIRM_CANCEL_ORDER' })}
                                    </Button >
                                    <Modal show={showPopupCancel} onHide={handleClosePopupCancel}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{intl.formatMessage({ id: 'ORDER.CONFIRM_CANCEL_ORDER' })}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div >
                                                <div>{intl.formatMessage({ id: 'ORDER.PLEASE_SELECT_A_REASON' })} <strong>#{order.order_nr}</strong>:</div><br />
                                                <Select options={orderReason} isClearable name="status" onChange={
                                                    (option: any) => {
                                                        setCancelReasonId(option?.value)
                                                        setCustom(option?.custom)
                                                        setLabelReason(option?.label)
                                                        if (_.isEmpty(option?.value)) {
                                                            setDisabled(true)
                                                        } else {
                                                            setDisabled(false)
                                                        }
                                                    }
                                                } />
                                                {custom == 'Y' ? selectOtherReason() : ''}
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClosePopupCancel}>
                                                {intl.formatMessage({ id: 'LANGUAGE.CLOSE' })}
                                            </Button>
                                            <Button variant="primary" onClick={() => {
                                                // TODO: đổi chỗ này
                                                handleCancelOrder({
                                                    cancel_reason_id: cancelReasonId,
                                                    note: note,
                                                    custom: custom,
                                                    label_reason: labelReason
                                                })
                                            }} disabled={disabled}>
                                                {intl.formatMessage({ id: 'USER.AGREE' })}
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <Modal show={showPopupConfirm} onHide={handleClosePopupConfirm}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>{intl.formatMessage({ id: 'ORDER.ORDER_CONFIRMATION' })}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div >
                                            {intl.formatMessage({ id: 'ORDER.ORDER_CONFIRMATION' })} <strong>#{order.order_nr}</strong>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClosePopupConfirm}>{intl.formatMessage({ id: 'LANGUAGE.CLOSE' })}</Button>
                                            <Button variant="primary" onClick={() => {
                                                handleUpdateStatus('A', 'Y', order.order_id)
                                            }}>{intl.formatMessage({ id: 'USER.AGREE' })}</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                        <div className="card card-flush mb-5">
                            <div className="card-body">
                                <h3 className="card-title mb-3"><span
                                    className="card-label fw-bolder fs-3">{intl.formatMessage({ id: 'ORDER.CUSTOMER_INFORMATION' })}</span>
                                </h3>
                                <span className={'d-block'}>{fnFullName(order.firstname, order.lastname)}</span>
                                <span
                                    className={'d-block'}><strong>{intl.formatMessage({ id: 'ORDER.IP_ADDRESS' })}:</strong> {order.ip_address}</span>
                            </div>
                        </div>
                        <div className="card card-flush mb-5">
                            <div className="card-body">
                                <h3 className="card-title mb-3"><span
                                    className="card-label fw-bolder fs-3">{intl.formatMessage({ id: 'ORDER.DELIVERY_ADDRESS' })}</span>
                                </h3>
                                <span
                                    className={'d-block'}><strong>{fnFullName(order.s_firstname, order.s_lastname)}</strong></span>
                                <span
                                    className={'d-block'}>{order.s_address}, {order.s_county}, {order.s_city}</span>
                            </div>
                        </div>
                        <div className="card card-flush mb-5">
                            <div className="card-body">
                                <h3 className="card-title mb-3"><span
                                    className="card-label fw-bolder fs-3">{intl.formatMessage({ id: 'ORDER.PAYMENT_ADDRESS' })}</span>
                                </h3>
                                <span className={'d-block'}>{fnFullName(order.b_firstname, order.b_lastname)}</span>
                                <span className={'d-block'}>{order.b_city}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
// @ts-ignore
Detail.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}
export default Detail
