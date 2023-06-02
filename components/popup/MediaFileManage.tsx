import React, {useEffect, useRef, useState} from "react"
import Image from 'next/image'
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../redux/reducers"
import md5 from "md5"
import axios from "axios"
import {fnUrl} from "../../utils/url"
import {Button, Modal, Container, Row, Col} from "react-bootstrap"
import style from '../../assets/styles/modules/multimedia.module.scss'
import _ from "lodash"

type TreeViewParams = {
    hash: string
    name: string
}

const MediaFileManage = (props: { callback?: (p: { [key: string]: File | string }) => void }): JSX.Element => {
    const {callback} = {...props}
    const hash: string = "l1_RGnhu4Vu"
    const user: { [key: string]: any } = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const securityHash: string = useSelector((state: ReducerInterFace) => state.settings?.securityHash)
    const tk: string = md5(`${user.company_id}--${securityHash}`)
    const [folders, setFolders] = useState<{ [key: string]: any }[]>([])
    const [files, setFiles] = useState<{ [key: string]: any }[]>([])
    const [thumbPath, setThumbPath] = useState<string>('')
    const [fullPath, setFullPath] = useState<string>('')
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: string }>({})
    const [treeView, setTreeView] = useState<TreeViewParams[]>([{name: "root", hash: hash}])
    const Ref = useRef<HTMLInputElement>(null)

    const handleShowFolder = (params: TreeViewParams) => {
        const form = new FormData()
        form.append("cmd", "open")
        form.append("target", params.hash)
        form.append("init", "1")
        form.append("tree", "0")
        form.append("reqid", (+new Date()).toString(16) + Math.floor(1000 * Math.random()).toString(16))
        axios({
            method: 'post',
            url: `${fnUrl("elf_connector.images")}&security_hash=${securityHash}&company_id=${user.company_id}&user_id=${user.user_id}&tk=${tk}`,
            data: form,
            headers: {
                'Content-Type': `multipart/form-data;`,
            },
        }).then((rs: { [key: string]: any }) => {
            const data = rs.data
            let folderArr: { [fo: string]: any }[] = []
            let fileArr: { [fi: string]: any }[] = []
            data?.files?.map((file: any) => {
                if (file.mime === "directory") {
                    folderArr.push(file)
                } else {
                    fileArr.push(file)
                }
            })
            setThumbPath(data.options?.tmbUrl || "")
            let paths = '';
            let paths_arr:string[] = [];
            if (!_.isEmpty(data.options.path)) {
                if (data.options.path.indexOf('/') > -1) {
                    // linux
                    paths_arr = data.options.path.split("/")
                    paths = paths_arr.slice(1).join('/')

                } else if(data.options.path.indexOf('\\') > -1) {
                    // windows
                    paths_arr = data.options.path.split("\\")
                    paths = paths_arr.slice(1).join('/')

                }
                // else : no sub directories
                setFullPath(data.options?.url + paths + "/")
            } else {
                setFullPath(data.options?.url || "")
            }
            setFolders(folderArr)
            setFiles(fileArr)
            let bol: boolean = false
            let x: number
            let tw = [...treeView]
            let len: number = tw.length
            for (x = 0; x < len; x++) {
                if (tw[x]?.hash === params.hash) {
                    bol = true
                    break
                }
            }
            if (!bol) {
                tw.push(params)
            } else {
                tw.splice(x + 1, len - x - 1)
            }
            setTreeView(tw)
        })
    }

    useEffect(() => {
        if(hash){
            let init: TreeViewParams = {name: "root", hash: hash}
            handleShowFolder(init)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash])

    const handleSearchFolder = (keyword: string) => {
        if (keyword === "" || !keyword) {
            handleShowFolder({name: "root", hash: hash})
            return false
        }
        const form = new FormData()
        form.append("cmd", "search")
        form.append("q", keyword)
        form.append("target", "l1_Lw")
        form.append("tree", "0")
        form.append("reqid", (+new Date()).toString(16) + Math.floor(1000 * Math.random()).toString(16))
        axios({
            method: 'post',
            url: `${fnUrl("elf_connector.images")}&security_hash=${securityHash}&company_id=${user.company_id}&user_id=${user.user_id}&tk=${tk}`,
            data: form,
            headers: {
                'Content-Type': `multipart/form-data;`,
            },
        }).then((rs: { [key: string]: any }) => {
            const data = rs.data
            let folderArr: { [fo: string]: any }[] = []
            let fileArr: { [fi: string]: any }[] = []
            data?.files?.map((file: any) => {
                if (file.mime === "directory") {
                    folderArr.push(file)
                } else {
                    fileArr.push(file)
                }
            })
            setFolders(folderArr)
            setFiles(fileArr)
        })
    }

    const handleSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = {...selectedFiles}
        let name: string = e.target.value
        let arr: string[] = name.split("/")
        name = arr.pop() || ""
        if (e.target.checked) {
            val[name] = e.target.value
        } else {
            delete val[name]
        }
        setSelectedFiles(val)
        if (callback) {
            callback(val)
        }
    }

    return (<div className="card card-flush">
            <Container className={`p-2`}>
                <Row className={`d-flex align-items-center card-header p-0`}>
                    <Col xs={12} md={8}>
                        <div className="d-flex flex-stack">
                            {/* begin::Folder path */}
                            <div className="badge badge-lg badge-light-primary">
                                <div className="d-flex align-items-center flex-wrap">
                                    {/* begin::Svg Icon | path: icons/duotune/abstract/abs039.svg */}
                                    {treeView.map((it: TreeViewParams, idx: number) => {
                                        if (idx === 0) return (
                                            <React.Fragment key={`br${idx}`}>
                                        <span className="svg-icon svg-icon-2 svg-icon-primary me-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none">
                                                <path opacity="0.3"
                                                      d="M14.1 15.013C14.6 16.313 14.5 17.813 13.7 19.113C12.3 21.513 9.29999 22.313 6.89999 20.913C5.29999 20.013 4.39999 18.313 4.39999 16.613C5.09999 17.013 5.99999 17.313 6.89999 17.313C8.39999 17.313 9.69998 16.613 10.7 15.613C11.1 15.713 11.5 15.813 11.9 15.813C12.7 15.813 13.5 15.513 14.1 15.013ZM8.5 12.913C8.5 12.713 8.39999 12.513 8.39999 12.313C8.39999 11.213 8.89998 10.213 9.69998 9.613C9.19998 8.313 9.30001 6.813 10.1 5.513C10.6 4.713 11.2 4.11299 11.9 3.71299C10.4 2.81299 8.49999 2.71299 6.89999 3.71299C4.49999 5.11299 3.70001 8.113 5.10001 10.513C5.80001 11.813 7.1 12.613 8.5 12.913ZM16.9 7.313C15.4 7.313 14.1 8.013 13.1 9.013C14.3 9.413 15.1 10.513 15.3 11.713C16.7 12.013 17.9 12.813 18.7 14.113C19.2 14.913 19.3 15.713 19.3 16.613C20.8 15.713 21.8 14.113 21.8 12.313C21.9 9.513 19.7 7.313 16.9 7.313Z"
                                                      fill="black"/>
                                                <path
                                                    d="M9.69998 9.61307C9.19998 8.31307 9.30001 6.81306 10.1 5.51306C11.5 3.11306 14.5 2.31306 16.9 3.71306C18.5 4.61306 19.4 6.31306 19.4 8.01306C18.7 7.61306 17.8 7.31306 16.9 7.31306C15.4 7.31306 14.1 8.01306 13.1 9.01306C12.7 8.91306 12.3 8.81306 11.9 8.81306C11.1 8.81306 10.3 9.11307 9.69998 9.61307ZM8.5 12.9131C7.1 12.6131 5.90001 11.8131 5.10001 10.5131C4.60001 9.71306 4.5 8.91306 4.5 8.01306C3 8.91306 2 10.5131 2 12.3131C2 15.1131 4.2 17.3131 7 17.3131C8.5 17.3131 9.79999 16.6131 10.8 15.6131C9.49999 15.1131 8.7 14.1131 8.5 12.9131ZM18.7 14.1131C17.9 12.8131 16.7 12.0131 15.3 11.7131C15.3 11.9131 15.4 12.1131 15.4 12.3131C15.4 13.4131 14.9 14.4131 14.1 15.0131C14.6 16.3131 14.5 17.8131 13.7 19.1131C13.2 19.9131 12.6 20.5131 11.9 20.9131C13.4 21.8131 15.3 21.9131 16.9 20.9131C19.3 19.6131 20.1 16.5131 18.7 14.1131Z"
                                                    fill="black"/>
                                            </svg>
                                        </span>
                                                <a className={'cursor-pointer'}
                                                   onClick={() => handleShowFolder(it)}>{it.name}</a>
                                            </React.Fragment>
                                        )
                                        else {
                                            if (idx < treeView.length - 1) {
                                                return (<React.Fragment key={`br${idx}`}>
                                                    <span className="svg-icon svg-icon-2 svg-icon-primary mx-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12.6343 12.5657L8.45001 16.75C8.0358 17.1642 8.0358 17.8358 8.45001 18.25C8.86423 18.6642 9.5358 18.6642 9.95001 18.25L15.4929 12.7071C15.8834 12.3166 15.8834 11.6834 15.4929 11.2929L9.95001 5.75C9.5358 5.33579 8.86423 5.33579 8.45001 5.75C8.0358 6.16421 8.0358 6.83579 8.45001 7.25L12.6343 11.4343C12.9467 11.7467 12.9467 12.2533 12.6343 12.5657Z"
                                                                fill="black"/>
                                                        </svg>
                                                    </span>
                                                    <a className={'cursor-pointer'}
                                                       onClick={() => handleShowFolder(it)}>{it.name}</a>
                                                </React.Fragment>)
                                            } else {
                                                return (<React.Fragment key={`br${idx}`}>
                                                    <span className="svg-icon svg-icon-2 svg-icon-primary mx-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24" fill="none">
                                                            <path
                                                                d="M12.6343 12.5657L8.45001 16.75C8.0358 17.1642 8.0358 17.8358 8.45001 18.25C8.86423 18.6642 9.5358 18.6642 9.95001 18.25L15.4929 12.7071C15.8834 12.3166 15.8834 11.6834 15.4929 11.2929L9.95001 5.75C9.5358 5.33579 8.86423 5.33579 8.45001 5.75C8.0358 6.16421 8.0358 6.83579 8.45001 7.25L12.6343 11.4343C12.9467 11.7467 12.9467 12.2533 12.6343 12.5657Z"
                                                                fill="black"/>
                                                        </svg>
                                                    </span>
                                                    {it.name}
                                                </React.Fragment>)
                                            }
                                        }
                                    })}
                                </div>
                            </div>
                            {/* end::Folder path */}
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        {/* begin::Card header */}
                        <div className="card-header p-2">
                            <div className="card-title">
                                {/* begin::Search */}
                                <div className="d-flex align-items-center position-relative my-1">
                                    {/* begin::Svg Icon | path: icons/duotune/general/gen021.svg */}
                                    <span className="svg-icon svg-icon-1 position-absolute ms-6 cursor-pointer"
                                          onClick={() => handleSearchFolder(Ref?.current?.value || "")}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24" fill="none">
                                                            <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546"
                                                                  height="2" rx="1"
                                                                  transform="rotate(45 17.0365 15.1223)"
                                                                  fill="black"/>
                                                            <path
                                                                d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                                                                fill="black"/>
                                                        </svg>
                                                    </span>
                                    {/* end::Svg Icon */}
                                    <input ref={Ref} type="text" data-kt-filemanager-table-filter="search"
                                           onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                               if (e.key == 'Enter')
                                                   handleSearchFolder(Ref?.current?.value || "")
                                           }}
                                           className="form-control form-control-solid ps-15"
                                           placeholder="Search Files &amp; Folders"/>
                                </div>
                                {/* end::Search */}
                            </div>
                        </div>
                        {/* end::Card header */}
                    </Col>
                </Row>
            </Container>


            {/* begin::Card body */}
            <div className="card-body p-2">
                {/* begin::Table header */}
                {/* end::Table header */}
                {/* begin::Table */}
                <h2>Folders</h2>
                <div className={`d-flex flex-row ${style.folderItemsWrap}`}>
                    {folders && folders.map((f, i) => (
                        <div key={`folder${i}`} className={`d-flex flex-column-auto w-80px h-50px ${style.folderItemWrap}`}>
                            <a className={'text-gray-800 text-hover-primary cursor-pointer'} id={f.hash}
                               onDoubleClick={() => handleShowFolder({hash: f.hash, name: f.name})}>
                                <span className="svg-icon svg-icon-2x svg-icon-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"
                                             height="24" viewBox="0 0 24 24" fill="none">
                                            <path opacity="0.3"
                                                  d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z"
                                                  fill="black"></path>
                                            <path
                                                d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z"
                                                fill="black"></path>
                                        </svg>
                                    </span>
                                <div className={`mw-80px ${style.folderItemName}`}>{f.name}</div>
                            </a>
                        </div>))}
                </div>
                <h2 className="mt-4">Files</h2>
                <div className={`d-flex flex-row ${style.fileItemsWrap}`}>
                    {files && files.map((f, i) => (
                        <div key={`file${i}`} className={`d-flex flex-column-auto mw-80px h-50px ${style.fileItemWrap}`}>
                            <label className={`text-gray-800 text-hover-primary cursor-pointer ${style.fileItemLabel}`} htmlFor={f.hash}>
                                <input className={`form-check-input ${style.fileItemInput}`} type="checkbox" value={fullPath + f.name}
                                       id={f.hash} onChange={e => handleSelected(e)}/>
                                <Image src={`${thumbPath}${f.tmb}`} alt={f.name} width={50} height={50}/>
                                <div className={`mw-80px ${style.fileItemName}`}>{f.name}</div>
                            </label>
                        </div>
                    ))}
                </div>
                {/* end::Table */}
            </div>
            {/* end::Card body */}
        </div>
    )
}

const PopupMediaFile = (props: { cb?: (p: { [key: string]: File | string }) => void }): JSX.Element => {
    const {cb} = {...props}
    const [show, setShow] = useState(false);
    const [fileSelected, setFileSelected] = useState<{[key: string]: File | string}>({})

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary btn-sm" onClick={handleShow}>
                File Management
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size={"lg"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>File Management</Modal.Title>
                </Modal.Header>
                <Modal.Body className={'p-2 mw-900px'}>
                    <MediaFileManage callback={setFileSelected}/>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary btn-sm" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary btn-sm" onClick={() => {
                        handleClose()
                        if (cb) {
                            cb(fileSelected)
                        }
                    }}>
                        Submit
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    )
}

export {MediaFileManage, PopupMediaFile}
