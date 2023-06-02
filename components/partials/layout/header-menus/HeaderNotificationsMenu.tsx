import clsx from 'clsx'
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react'
import {fnCurrentApiUrl, fnUrlMain, toAbsoluteUrl} from "../../../../utils/url"
import {KTSVG} from "../../../images/KTSVG"
import {useIntl} from "react-intl"
import axios from "axios"
import _ from "lodash"
import {Obj} from "../../../../utils/types"
import Link from "next/link"
import {useLang} from "../../../i18n/Metronici18n"
import moment from "../../../../utils/time"
import {useDispatch, useSelector} from "react-redux"
import {ReducerInterFace} from "../../../../redux/reducers"
import allActions from "../../../../redux/actions"

type NotificationProp = {
    setDot?: (bol: boolean) => void
}

const HeaderNotificationsMenu: (p: NotificationProp) => JSX.Element = (props: NotificationProp) => {
    const {setDot} = props
    const intl = useIntl()
    const lang = useLang() ?? "vi"
    const [reports, setReports] = useState<Obj[]>([])
    const [total, setTotal] = useState<number>(0)
    const [readReport, setReadReport] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const stopScrollNav = useSelector((state: ReducerInterFace) => state.settings.stopScrollNav)
    const dispatch = useDispatch()
    const heightItem = 70
    const state: Obj = useMemo(() => {
        return {
            "I": "info",
            "E": "error",
            "W": "warning",
            "N": "success"
        }
    }, [])

    const call_api = useCallback((customPage?: number) => {
        return axios.post(fnCurrentApiUrl("/api/notification"), {
            page: customPage ?? page
        })
    }, [page])

    const evenListener = useCallback((e: any) => {
        let childLength: number = e.target?.childNodes?.length ?? 0
        if (stopScrollNav && e.target.scrollTop > heightItem * (childLength - 1)) {
            dispatch(allActions.settings.stopScrollNav(false))
        }
    }, [dispatch])

    const setRead = useCallback((id: number) => {
        return axios.post(fnCurrentApiUrl("/api/notification/read"), {
            notification_id: id
        }).then(rs => {
            if (rs.data) {
                let elm: HTMLElement | null = document.getElementById(`alertTitle${id}`)
                elm?.classList.remove("text-gray-800")
                elm?.classList.add("text-gray-400")
                setReadReport(readReport-1)
            }
        })
    }, [])

    const setDismiss = useCallback((id: number) => {
        return axios.post(fnCurrentApiUrl("/api/notification/remove"), {
            notification_id: id
        }).then(rs => {
            if (rs.data) {
                let newReports: Obj[] = reports.filter((item: Obj) => item.notification_id != id)
                setReports(newReports)
                setTotal(total - 1)
            }
        })
    }, [reports])

    useEffect(() => {
        let scroll: HTMLElement | null = document.getElementById("elm-notify")
        dispatch(allActions.settings.stopScrollNav(true))
        scroll?.addEventListener("scroll", evenListener)
        let interval = setInterval(() => {
            let pop: HTMLElement | null = document.getElementById("popup-notification")
            if (!pop?.classList.contains("show")) {
                scroll?.addEventListener("scroll", evenListener)
                setReports([])
                call_api(1).then(rs => {
                    if (!_.isEmpty(rs.data)) {
                        setReports([...rs.data.data])
                        setTotal(rs.data.total)
                        setPage(2)
                        if (scroll) scroll.scrollTop = 0
                        if (rs.data.data.length === 0) {
                            let scroll: HTMLElement | null = document.getElementById("elm-notify")
                            scroll?.removeEventListener("scroll", evenListener, false)
                        }
                    }
                })
            }
        }, 60000)
        if (page === 1) {
            call_api().then(rs => {
                if (!_.isEmpty(rs.data)) {
                    setReports([...reports, ...rs.data.data])
                    setTotal(rs.data.total)
                    setPage(page + 1)
                    if (rs.data.data.length === 0) {
                        let scroll: HTMLElement | null = document.getElementById("elm-notify")
                        scroll?.removeEventListener("scroll", evenListener, false)
                    }
                    setReadReport(rs.data.read)
                }
            })
        }
        return () => {
            setReports([])
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        if (!stopScrollNav && page > 1) {
            call_api().then(rs => {
                if (!_.isEmpty(rs.data)) {
                    dispatch(allActions.settings.stopScrollNav(true))
                    setReports([...reports, ...rs.data.data])
                    setTotal(rs.data.total)
                    setPage(page + 1)
                    if (rs.data.data.length === 0) {
                        let scroll: HTMLElement | null = document.getElementById("elm-notify")
                        scroll?.removeEventListener("scroll", evenListener, false)
                    }
                    setReadReport(rs.data.read)
                }
            })
        }
    }, [stopScrollNav, call_api, page])

    useEffect(()=>{
        if(setDot){
            if(readReport === 0){
                setDot(false)
            }else{
                setDot(true)
            }
        }
    },[readReport])


    return (
        <div
            className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-400px'
            data-kt-menu='true'
            id={"popup-notification"}
        >
            <div
                className='d-flex flex-column bgi-no-repeat rounded-top'
                style={{
                    backgroundImage: `url('${toAbsoluteUrl('/media/misc/pattern-1.jpg')}')`,
                    backgroundRepeat: "repeat-x"
                }}
            >
                <h3 className='text-white fw-bold px-9 mt-5 mb-4'>
                    {intl.formatMessage({id: 'LANGUAGE.NOTIFICATION'})} <span
                    className='fs-8 opacity-75 ps-3'>{total} {intl.formatMessage({id: 'LANGUAGE.REPORTS'})}</span>
                </h3>
            </div>

            <div className='card'>
                <div className='scroll-y mh-325px my-5 px-2' id={"elm-notify"}>
                    {reports && reports.map((alert, index) => (
                        <div key={`alert${index}`} id={`alertNav${alert.notification_id}`}
                             className='d-flex flex-stack py-4 position-relative'>
                            <div className='d-flex align-items-center'>
                                <div className='symbol symbol-35px me-4'>
                                  <span
                                      className={clsx('symbol-label cursor-pointer', `bg-light-${state[alert.severity]}`)}
                                      onClick={() => {
                                          setRead(alert.notification_id).then(rs => console.log("Read!"))
                                      }}>
                                    {' '}
                                      <KTSVG
                                          path={`/media/icons/duotune/art/art002.svg`}
                                          className={`svg-icon-2 svg-icon-${state[alert.severity]}`}
                                      />
                                  </span>
                                </div>

                                <div className='mb-0 me-2'>
                                    {alert.section === 'products' && <Link
                                        href={alert.action_url?.replace("products.manage?pid=", fnUrlMain(`products/update/`))}>
                                        <a id={`alertTitle${alert.notification_id}`}
                                           className={`fs-6 text-gray-${alert.is_read === 0 ? "800" : "400"} text-hover-primary fw-bolder`}
                                           onClick={() => {
                                               setRead(alert.notification_id).then(rs => console.log("Read!"))
                                           }}>
                                            {alert.title}
                                        </a>
                                    </Link>}
                                    {alert.section === 'products' ?
                                        <div className='text-gray-400 fs-7'>{alert.message}</div> :
                                        <div className='text-gray-400 fs-7'
                                             onMouseMove={() => setRead(alert.notification_id).then(rs => console.log("Read!"))}>{alert.message}</div>
                                    }
                                </div>
                            </div>
                            <div onClick={() => {
                                setDismiss(alert.notification_id).then(rs => console.log("Removed!"))
                            }} className={"btn position-absolute btn-sm btn-icon btn-active-color-primary"}
                                 style={{right: 0, top: 0}}>
                                <KTSVG
                                    path='/media/icons/duotune/arrows/arr061.svg'
                                    className={"svg-icon svg-icon-1"}
                                />
                            </div>
                            <span
                                className='badge badge-light fs-8'>{moment.unix(alert.timestamp).format(lang === "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY")}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default memo(HeaderNotificationsMenu)
