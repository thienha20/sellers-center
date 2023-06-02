import React, {ChangeEvent, useEffect, useMemo, useState} from "react"
import {useIntl} from "react-intl"
import {fnFullName} from "../../utils/fullName"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faCircleCheck, faCircleXmark} from '@fortawesome/free-regular-svg-icons'
import {Button, FormCheck, Modal, Spinner} from "react-bootstrap"
import _ from "lodash"
import axios from "axios"
import {fnCurrentApiUrl, fnUrlQueryBuilder} from "../../utils/url"
import {useAlert} from "react-alert"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../redux/reducers"
import Link from "next/link"
import CryptoJS from "crypto-js"
import {KTSVG} from "../images/KTSVG"
import {useRouter} from "next/router"
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons"
import {isMobileDevice} from "../../utils/metronic/_utils"
import {TableLoading} from "./tableLoading";
import {BlankRow} from "./blankRow";
import {TableNoData} from "./tableNoData";

library.add(faCircleXmark, faCircleCheck)
type propsTable = {
    users: any, //TODO: declare this
    loading?: boolean,
    paramsUser: any,
    submitHandleSort: Function
}
const UserTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const {users, loading, paramsUser, submitHandleSort} = {...props}
    const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice())
    const alert = useAlert()
    const router = useRouter()
    const [vendorRoot, setVendorRoot] = useState<boolean>(true)
    const [userIdDelete, setUserIdDelete] = useState<number>(0)
    const [userNameDelete, setUserNameDelete] = useState<string>("")
    const userLogin = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const [userIdLogin, setUserIdLogin] = useState<Number>(userLogin?.user_id)
    let confirm_delete_user = intl.formatMessage({id: "USER.CONFIRM_DELETE_USER"})
    const header = [
        {id: '', label: intl.formatMessage({id: 'LANGUAGE.NUMBER'})},
        {id: 'name', label: intl.formatMessage({id: 'LANGUAGE.FULL_NAME'})},
        {id: 'email', label: intl.formatMessage({id: 'LANGUAGE.EMAIL'})},
        {id: '', label: intl.formatMessage({id: 'USER.ROLE'})},
        {id: '', label: intl.formatMessage({id: 'USER.ACCOUNT_HOLDER'})},
        {id: '', label: intl.formatMessage({id: 'LANGUAGE.STATUS'})}]
    const [show, setShow] = useState<boolean>(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleChangeVendorStatus = (user_id: number, status: string) => {
        setShow(false)
        setUserIdDelete(0)
        setUserNameDelete("")
        axios.post(fnCurrentApiUrl('/api/users/update/update_vendor_statuses'), {
            user_id: user_id,
            vendor_status: status
        }).then((response) => {
            if (response.statusText == 'OK') {
                alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_SUCCESS'}), {type: "success"})
            } else {
                alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_FAILED'}), {type: "error"})
            }
            router.push(fnUrlQueryBuilder('users', paramsUser))
        }).catch((error) => {
            alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_FAILED'}), {type: "error"})
        })
    }
    const list_status: { value: string, label: string }[] = useMemo(() => [
        {value: 'A', label: intl.formatMessage({id: 'LANGUAGE.ACTIVE'})},
        {value: 'H', label: intl.formatMessage({id: 'LANGUAGE.HIDDEN'})},
    ], [intl])
    let _list_status: any = {}
    list_status.forEach(s => {
        _list_status[`${s.value}`] = s.label
    })
    useEffect(() => {
        setVendorRoot(true)
        if (!_.isEmpty(userLogin)) {
            if (userLogin.vendor_root == 'N') {
                if (!_.isEmpty(userLogin.permission)) {
                    let per: string = CryptoJS.AES.decrypt(userLogin.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
                    let json_per = JSON.parse(per)
                    for (let k in json_per) {
                        if (json_per[k] == "/users") {
                            setVendorRoot(false)
                            break
                        }
                    }
                } else {
                    setVendorRoot(false)
                }
            } else {
                setVendorRoot(false)
            }
        }
    }, [])
    /* 20220511 Function Sort Table Head Start */
    const [sortUserName, setSortUserName] = useState('any')
    const [sortUserEmail, setSortUserEmail] = useState('any')
    useEffect(() => {
        if (router.isReady) {
            let {
                sort_by,
                sort_order
            } = router.query
            /* Check Url Browser Set Active for SortBy And SortOrder Start */
            if (sort_by == 'name') {
                setSortUserEmail('any')
                if (sort_order === 'desc') setSortUserName('false')
                if (sort_order === 'asc') setSortUserName('true')
            }
            if (sort_by == 'email') {
                setSortUserName('any')
                if (sort_order === 'desc') setSortUserEmail('false')
                if (sort_order === 'asc') setSortUserEmail('true')
            }
            /* Check Url Browser Set Active for SortBy And SortOrder End */
        }
    }, [router.isReady, router.query])
    const onsubmitHandleSort = (sort_by?: string, sort_order?: string) => {
        if (sort_by == 'name') {
            setSortUserEmail('any')
            if (sort_order === 'desc') setSortUserName('false')
            if (sort_order === 'asc') setSortUserName('true')
        }
        if (sort_by == 'email') {
            setSortUserName('any')
            if (sort_order === 'desc') setSortUserEmail('false')
            if (sort_order === 'asc') setSortUserEmail('true')
        }
        submitHandleSort(
            {
                sort_by: sort_by,
                sort_order: sort_order
            }
        )
    }
    const tableHeader = header.map(user_props => {
        return (
            <th key={`th-${user_props}`} scope="col">
                {/* Sort Name Start  */}
                {user_props.id === 'name' ? <div style={{display: "flex", alignItems: "center"}}>{user_props.label}
                    <div className="ms-1 icon-sort"><FontAwesomeIcon
                        className={`icon1 ${sortUserName == "true" || sortUserName == "any" ? "active" : ""}`}
                        onClick={() => onsubmitHandleSort(
                            user_props.id,
                            'desc'
                        )} icon={faArrowUp}/> <FontAwesomeIcon
                        className={`icon2 ${sortUserName == "false" || sortUserName == "any" ? "active" : ""}`}
                        onClick={() => onsubmitHandleSort(
                            user_props.id,
                            'asc'
                        )} icon={faArrowDown}/>
                    </div>
                </div> : user_props.id === 'email' ? '' : user_props.label}
                {/* Sort Name End */}

                {/* Sort Email Start  */}
                {user_props.id === 'email' ? <div style={{display: "flex", alignItems: "center"}}>{user_props.label}
                    <div className="ms-1 icon-sort"><FontAwesomeIcon
                        className={`icon1 ${sortUserEmail == "true" || sortUserEmail == "any" ? "active" : ""}`}
                        onClick={() => onsubmitHandleSort(
                            user_props.id,
                            'desc'
                        )} icon={faArrowUp}/> <FontAwesomeIcon
                        className={`icon2 ${sortUserEmail == "false" || sortUserEmail == "any" ? "active" : ""}`}
                        onClick={() => onsubmitHandleSort(
                            user_props.id,
                            'asc'
                        )} icon={faArrowDown}/>
                    </div>
                </div> : ''}
                {/* Sort Email End */}

            </th>)
    })
    const tableHeaderMobile = useMemo(() => header.map(user_props => {
        return (
            <th key={`th-${user_props.label}`} scope="col" className="min-w-150px">
                {user_props.label}
            </th>)
    }), [header])
    /* 20220511 Function Sort Table Head End */

    const data = users.map((user: any, index: number) => {
        return (
            <tr key={`tr-${user.user_id}`}>
                <td>{paramsUser?.page ? 10 * (paramsUser.page - 1) + index + 1 : index + 1}</td>
                <td>
                    {(userIdLogin == user.user_id || vendorRoot || user.vendor_root == 'Y') ? (
                        <span>{fnFullName(user.firstname, user.lastname)}</span>) : (
                        <Link href={`/users/update/${user.user_id}`}>
                            <a className="text-dark fw-bold text-hover-primary fs-6">
                                {fnFullName(user.firstname, user.lastname)}
                            </a>
                        </Link>)}
                </td>
                <td>
                    {user.email}
                </td>
                <td>
                    <div dangerouslySetInnerHTML={{__html: user.permission_name}}/>
                </td>
                <td style={{'textAlign': "center"}}>
                    {(user.vendor_root == 'Y') ? (<FontAwesomeIcon color={'green'} icon={faCircleCheck}/>) : (
                        <FontAwesomeIcon color={'red'} icon={faCircleXmark}/>)}
                </td>
                <td>
                    <FormCheck type={'switch'}
                               disabled={(userIdLogin != user.user_id && user.vendor_root != 'Y') ? vendorRoot : true}
                               defaultChecked={user.vendor_status != "H"}
                               onChange={_.debounce(
                                   (e: ChangeEvent<HTMLInputElement>) => {
                                       const checked = e.target.checked ? 'A' : 'H'
                                       handleChangeVendorStatus(user.user_id, checked)
                                   }, 300)
                               }/>
                </td>
                <td>

                    {(userIdLogin == user.user_id || vendorRoot || user.vendor_root == 'Y') ? "" : (
                        <div className="d-flex justify-content-end flex-shrink-0">
                            <Link href={`/users/update/${user.user_id}`}>
                                <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                    <KTSVG
                                        path="/media/icons/duotune/art/art005.svg"
                                        className="svg-icon-1"
                                    />
                                </a>
                            </Link>
                            <Button className="btn btn-bg-light btn-icon btn-sm me-1" onClick={() => {
                                setUserIdDelete(user.user_id)
                                setUserNameDelete(fnFullName(user.firstname, user.lastname))
                                handleShow()
                            }} variant={'light'}>
                                <KTSVG
                                    path="/media/icons/duotune/general/gen027.svg"
                                    className="svg-icon-1"
                                />
                            </Button>

                        </div>
                    )}
                </td>
            </tr>
        )
    })
    return (
        <>
            <div className="table-responsive table-loading">
                {loading && (
                    <TableLoading/>
                )}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title> {intl.formatMessage({id: 'USER.DELETE_USER'})}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div
                            dangerouslySetInnerHTML={{__html: confirm_delete_user.replace("[user]", userNameDelete)}}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            {intl.formatMessage({id: 'LANGUAGE.CLOSE'})}
                        </Button>
                        <Button variant="primary" onClick={
                            () => {
                                handleChangeVendorStatus(userIdDelete, "D")
                            }}>
                            {intl.formatMessage({id: 'USER.AGREE'})}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <table className="table table-row-dashed table-row-gray-300 align-middle fw-bolder dataTable4">
                    <thead className={"fs-7 text-gray-400"}>
                    <tr>
                        {!isMobile ? tableHeader : tableHeaderMobile}
                    </tr>
                    </thead>
                    <tbody className={"fs-7 border-top-0"}>
                    {(!loading && data.length > 0) ? data : (loading) ?
                        <BlankRow colSpan={header.length}/> : <TableNoData colSpan={header.length}/>  }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export {UserTable}
