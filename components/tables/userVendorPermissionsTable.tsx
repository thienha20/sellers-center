import React, {ChangeEvent} from "react"
import {useIntl} from "react-intl"
import {KTSVG} from "../images/KTSVG"
import _ from "lodash"
import {Button, FormCheck, Spinner} from "react-bootstrap"
import axios from "axios"
import {fnCurrentApiUrl} from "../../utils/url"
import {useAlert} from "react-alert"
import Link from "next/link"
import {Obj} from "../../utils/types"
import {BlankRow} from "./blankRow";
import {TableNoData} from "./tableNoData";
import {TableLoading} from "./tableLoading";

type propsTable = {
    permissions: any, //TODO: declare this
    loading?: boolean,
    allowViewDetail?: boolean,
    allowUpdate?: boolean,
    permissionParams: Obj
}

const UserVendorPermissionsTable: (props: propsTable) => JSX.Element = (props: propsTable) => {
    const intl = useIntl()
    const {permissions, loading, allowViewDetail, allowUpdate, permissionParams} = {...props}
    const alert = useAlert()

    const handleChangePermissionStatus = (group_id: number, status: string) => {
        axios.post(fnCurrentApiUrl('/api/users/create_vendor_group_permissions'), {
            group_id: group_id,
            status: status
        }).then((response) => {
            if (response.statusText == 'OK') {
                alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_SUCCESS'}), {type: "success"})
            } else {
                alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_FAILED'}), {type: "error"})
            }
        }).catch((error) => {
            alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_FAILED'}), {type: "error"})
        })
    }

    const header = [
        intl.formatMessage({id: 'LANGUAGE.NUMBER'}),
        intl.formatMessage({id: 'USER.VENDOR_GROUP_PERMISSION_NAME'}),
        intl.formatMessage({id: 'LANGUAGE.STATUS'}),
        "",
    ]

    const list_status = [
        {value: 'A', label: intl.formatMessage({id: 'LANGUAGE.ACTIVE'})},
        {value: 'D', label: intl.formatMessage({id: 'LANGUAGE.DISABLE'})},
    ]

    let _list_status: any = {}

    list_status.forEach(s => {
        _list_status[`${s.value}`] = s.label
    })

    const tableHeader = header.map(permission_props => {
        return (
            <th key={`th-${permission_props}`} scope="col">
                {permission_props}
            </th>)
    })
    const data = permissions.map((permission: any, index: number) => {
        return (
            <tr key={`tr-${permission.group_id}`}>
                <td>
                    {permissionParams?.page ? 10 * (permissionParams.page - 1) + index + 1 : index + 1}
                </td>
                <td>
                    <Link href={`/users/vendor_group_permission/edit/${permission.group_id}`}>
                        <a className="text-dark fw-bold text-hover-primary fs-6">
                            {permission.name}
                        </a>
                    </Link>
                </td>
                <td>
                    <FormCheck type={'switch'}
                               defaultChecked={permission.status == 'A'}
                               disabled={!allowUpdate}
                               onChange={_.debounce(
                                   (e: ChangeEvent<HTMLInputElement>) => {
                                       const checked = e.target.checked ? 'A' : 'D'
                                       handleChangePermissionStatus(permission.group_id, checked)
                                   }, 300)
                               }/>
                </td>
                <td>
                    <div className="d-flex justify-content-end flex-shrink-0">
                        {allowViewDetail && (
                            <Link href={`/users/vendor_group_permission/${permission.group_id}`}>
                                <a
                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                                    <KTSVG
                                        path="/media/icons/duotune/general/gen004.svg"
                                        className="svg-icon svg-icon-3"
                                    />
                                </a>
                            </Link>
                        )}
                        {allowUpdate && (

                            <Link href={`/users/vendor_group_permission/edit/${permission.group_id}`}>
                                <a
                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                            <span className="svg-icon svg-icon-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className="mh-50px">
                                    <path opacity="0.3"
                                          d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z"
                                          fill="black"></path>
                                    <path
                                        d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z"
                                        fill="black"></path>
                                </svg>
                            </span>
                                </a>
                            </Link>
                        )}

                    </div>
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
                <table className="table table-row-dashed table-row-gray-300 align-middle fw-bolder dataTable4">
                    <thead className={"fs-7 text-gray-400"}>
                    <tr>
                        {tableHeader}
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

export {UserVendorPermissionsTable}
