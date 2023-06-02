import React, {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import axios from "axios"
import {useRouter} from "next/router"
import {useAlert} from 'react-alert'
import {fnCurrentApiUrl, fnUrlQueryBuilder} from "../../../utils/url"
import {useLang} from "../../i18n/Metronici18n"
import _ from "lodash"
import {Permission} from "../../../utils/permission"
import CheckboxTree from "react-checkbox-tree"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Button} from "react-bootstrap"
import {library} from "@fortawesome/fontawesome-svg-core"
import {faChevronRight, fas} from "@fortawesome/free-solid-svg-icons"
import {faCheckSquare, faSquareMinus} from "@fortawesome/free-regular-svg-icons"
import {Obj} from "../../../utils/types"

library.add(fas, faCheckSquare, faChevronRight, faSquareMinus)


type Node = {
    label: React.ReactNode;
    value: string;
    children?: Array<Node>;
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    showCheckbox?: boolean;
    title?: string;
}

type propsVendorGroupPermission = {
    viewOnly?: boolean,
}
const VendorGroupPermission: (props: propsVendorGroupPermission) => JSX.Element = (props: propsVendorGroupPermission) => {
    const intl = useIntl()
    const {viewOnly} = {...props}

    const alert = useAlert()

    const router = useRouter()
    const lang: string = useLang() ?? "vi"
    const [groupId, setGroupId] = useState<string>()
    const [permissionName, setPermissionName] = useState<string>('')
    const [nodes, setNodes] = useState<Node[]>([])
    const [checked, setChecked] = useState<string[]>([])
    const [expanded, setExpanded] = useState<string[]>([])
    const [disabled, setDisabled] = useState<boolean>(true)
    const [errors, setErrors] = useState<Obj>({})
    const {id} = router.query

    useEffect(() => {
        const fetchData = () => {
            axios.post('/api/users/vendor_group_permissions_detail', {
                group_id: id
            }).then(response => {
                if (_.isEmpty(response.data)) {
                    router.push(fnUrlQueryBuilder('users/vendor_group_permission', {})).then(()=>{
                        console.log('ok')
                    })
                } else {
                    setGroupId((response.data.data?.group_id) ?? null)
                    setChecked(JSON.parse(response.data.data?.rules) ?? [])
                    setPermissionName((response.data.data?.name) ?? '')
                }
            })
        }
        if (!_.isNil(id)) {
            fetchData()
        }
    }, [id])


    const permissionNode = () => {
        // console.log(Permission)
        let _nodes: Node[] = []
        let _expandList: string[] = []
        Object.keys(Permission).map(permission => {
            let children: Node[] = []
            if (!_.isNil(Permission[permission][`data`])) {
                Object.keys(Permission[permission][`data`])
                    .map(child => {
                        // console.log(Permission[permission][`data`][child])
                        children.push({
                                label: Permission[permission][`data`][child]['title'][`${lang}`],
                                value: Permission[permission][`data`][child]['link'],
                                disabled: viewOnly ?? false,
                            }
                        )
                    })
            }
            _nodes.push({
                label: Permission[permission][`title`][`${lang}`],
                value: Permission[permission][`link`] ?? Permission[permission][`title`][`${lang}`],
                disabled: viewOnly ?? false,
                children: !_.isEmpty(children) ? [...children] : undefined
            })
            _expandList.push(Permission[permission][`link`] ?? Permission[permission][`title`][`${lang}`])
            // console.info(_nodes)
        })
        setExpanded(_expandList)
        setNodes(_nodes)
        // console.log('_nodes', _nodes)
    }

    useEffect(() => {
        permissionNode()
    }, [])

    useEffect(() => {
        permissionNode()
    }, [lang])


    useEffect(() => {
        if (!_.isEmpty(permissionName) && !_.isEmpty(checked)) {
            setDisabled(false)
        } else {
            if (!disabled) {
                setDisabled(true)
            }
        }
    }, [permissionName, checked])


    const submit = async () => {
        if(!_.isEmpty(errors)){
            return
        }
        await axios.post(fnCurrentApiUrl('/api/users/create_vendor_group_permissions'), {
            name: permissionName,
            rules: checked,
            group_id: groupId
        }).then(() => {
            alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_SUCCESS'}), {type: "success"})
            router.push(fnUrlQueryBuilder('users/vendor_group_permission', {}))
        }).catch(() => {
            alert.show(intl.formatMessage({id: 'LANGUAGE.UPDATE_FAILED'}), {type: "error"})
        })
    }
    // @ts-ignore
    return (
        <>
            <div className="card card-flush mt-5">
                <div className="card-body">
                    {viewOnly && (
                        <h2 className="mb-5">{intl.formatMessage({id: 'USER.PERMISSION_VIEW'})}</h2>
                    )}
                    {groupId && !viewOnly && (
                        <h2 className="mb-5">{intl.formatMessage({id: 'USER.PERMISSION_EDIT'})}</h2>
                    )}
                    {!groupId && !viewOnly &&(
                        <h2 className="mb-5">{intl.formatMessage({id: 'USER.PERMISSION_ADD'})}</h2>
                    )}

                    <div className="row mb-5 mt-5">
                        <label className="fs-6 form-label fw-bolder text-dark"><span
                            className="text-danger">* </span>{intl.formatMessage({id: 'USER.PERMISSION_NAME'})}
                        </label>

                        <div className={'col col-sm col-lg-9'}>
                            <input type="text" required={true} className={`form-control form-control ${errors.permission_name?.message ? 'is-invalid':''}`}
                                   name="permission_name"
                                   disabled={viewOnly}
                                   placeholder={intl.formatMessage({id: 'USER.PERMISSION_NAME'})}
                                   defaultValue={permissionName}
                                   onChange={_.debounce(
                                       (e) => {
                                           if(e.target.value.length == 0){
                                               setErrors({...errors,
                                                   permission_name : {
                                                       message: 'required'
                                                   }})
                                           } else {
                                               let _errs = errors
                                               delete _errs.permission_name
                                               setErrors(_errs)
                                           }
                                           setPermissionName(e.target.value)
                                       }, 300
                                   )}
                            />
                            {errors.permission_name && (
                                <div className='fv-plugins-message-container invalid-feedback'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{errors.permission_name?.message}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <label className="fs-6 form-label fw-bolder text-dark"><span
                        className="text-danger">* </span>{intl.formatMessage({id: 'USER.PERMISSION'})}
                    </label>
                    <div className={"scroll-y"} style={{"maxHeight": 480}}>
                        <CheckboxTree
                            nodes={nodes}
                            checked={checked}
                            expanded={expanded}
                            onCheck={(checked: React.SetStateAction<string[]>) => {
                                // console.log(checked)
                                setChecked(checked)
                            }}
                            onExpand={(expanded: React.SetStateAction<string[]>) => {
                                // console.log(expanded)
                                setExpanded(expanded)
                            }}
                            showNodeIcon={false}
                            showExpandAll={true}
                            nativeCheckboxes={true}
                            icons={{
                                check: <FontAwesomeIcon icon="check-square"/>,
                                uncheck: <FontAwesomeIcon icon={['fas', 'square']}/>,
                                halfCheck: <FontAwesomeIcon icon="square-minus"/>,
                                expandClose: <FontAwesomeIcon icon={['fas', 'chevron-right']}/>,
                                expandOpen: <FontAwesomeIcon icon="chevron-down"/>,
                                expandAll: <FontAwesomeIcon icon="plus-square"/>,
                                collapseAll: <FontAwesomeIcon icon="minus-square"/>,
                                parentClose: <FontAwesomeIcon icon="folder"/>,
                                parentOpen: <FontAwesomeIcon icon="folder-open"/>,
                                leaf: <FontAwesomeIcon icon="file"/>
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className={' d-flex justify-content-end'}>
                    <Button className={'btn-sm m-1'} variant={'light'}
                            onClick={() => {
                                router.push(fnUrlQueryBuilder('users/vendor_group_permission', {}))
                            }}
                    >{intl.formatMessage({id: 'LANGUAGE.BACK'})}</Button>
                    <Button className={'btn btn-sm btn-primary m-1'}
                            disabled={disabled || viewOnly}
                            onClick={submit}
                    >{intl.formatMessage({id: 'LANGUAGE.SAVE'})}</Button>
                </div>
            </div>
        </>
    )
}

export default VendorGroupPermission
