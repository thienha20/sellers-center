import React, {useEffect, useRef, useState} from "react";
import {
    DragDropText,
    FileMetaData,
    FilePreviewContainer,
    FileUploadContainer,
    FormField,
    ImagePreview,
    PreviewContainer,
    PreviewList,
    RemoveFileIcon,
    PreviewFileIcon
} from "./file-upload.styles";
import {PopupMediaFile} from "../popup/MediaFileManage";
import {Button} from "react-bootstrap";
import {useIntl} from "react-intl";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas, faTrashAlt,faEye} from '@fortawesome/free-solid-svg-icons';
import {fnCurrentApiUrl} from "../../utils/url";
library.add(fas, faTrashAlt,faEye)


const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 2097152; // 2mb

const convertNestedObjectToArray = (nestedObj: { [key: string]: File | string }) =>
    Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes: number) => Math.round(bytes / KILO_BYTES_PER_BYTE);
const FileUpload = ({
                        label,
                        updateFilesCb,
                        handleDeletedPath,
                        maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
                        defaultValue,
                        ...otherProps
                    }: {
    label: string,
    updateFilesCb?: (filesAsArray: any) => void | undefined,
    handleDeletedPath?: Function,
    maxFileSizeInBytes?: number,
    defaultValue?: any,
    multiple: boolean
}) => {
    const fileInputField: React.MutableRefObject<any> = useRef(null)
    const [files, setFiles] = useState<{ [key: string]: File | string }>({})
    const intl = useIntl()

    useEffect(() => {
        if (defaultValue) {
            setFiles(defaultValue)
        }
    }, [defaultValue])


    const handleUploadBtnClick = () => {
        fileInputField.current.click();
    };

    const addNewFiles = (newFiles: any | null | undefined) => {
        if (!newFiles) return {}
        for (let file of newFiles) {
            if (file.size <= maxFileSizeInBytes) {
                if (!otherProps.multiple) {
                    return {file};
                }
                files[file.name] = file;
            }
        }
        return {...files};
    };

    const callUpdateFilesCb = (files: { [key: string]: File | string }) => {
        const filesAsArray = convertNestedObjectToArray(files);
        if (updateFilesCb) {
            updateFilesCb(filesAsArray);
        }
    };

    useEffect(()=>{
        callUpdateFilesCb(files);
    }, [files])

    const handleNewFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files: newFiles} = e.target
        if (newFiles?.length) {
            let updatedFiles = addNewFiles(newFiles);
            setFiles(updatedFiles);
        }
    };

    const removeFile = (fileName: string) => {

        // TODO: delete if url detailed
        if (typeof files[fileName] == "string") {
            const path: string = String(files[fileName])
            const isDetailed = path.search("/images/detailed/")
            if (isDetailed > -1 ) {
                handleDeletedPath ? handleDeletedPath(path):''
            }
        }
        delete files[fileName];
        setFiles({...files});
    };

    const handleDrop = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            let updatedFiles = addNewFiles(e.dataTransfer.files);
            setFiles(updatedFiles);
        }
    }
    return (
        <>
            <FileUploadContainer onDrop={handleDrop}>
                <DragDropText>{intl.formatMessage({id: 'DROPZONE.DRAG'})}</DragDropText>
                <FormField
                    type="file"
                    ref={fileInputField}
                    onChange={handleNewFileUpload}
                    title=""
                    value=""
                    {...otherProps}
                />
            </FileUploadContainer>
            <Button variant="primary" onClick={handleUploadBtnClick} className={'me-4 btn-sm'}>
                <span> Upload {otherProps.multiple ? "files" : "a file"}</span>
            </Button>
            <PopupMediaFile cb={(data) => {
                let merge = {...files, ...data}
                setFiles(merge)
            }}/>
            <FilePreviewContainer>
                <label className='my-2'>{intl.formatMessage({id: 'UPLOAD.PREVIEW'})}</label>
                <PreviewList>
                    {Object.keys(files).map((fileName: string, index: number) => {
                        let file: File | string = files[fileName];
                        let isImageFile = (typeof file !== "string" && file?.type?.split("/")[0] === "image") || typeof file === "string";
                        let imagePreview = typeof file !== "string" ? URL.createObjectURL(file) : '';
                        return (
                            <PreviewContainer key={fileName}>
                                {typeof file !== "string" ?
                                    <div>
                                        {/*Thêm hình ảnh sản phẩm*/}
                                        {isImageFile && (
                                            <ImagePreview
                                                src={imagePreview}
                                                alt={`file preview ${index}`}
                                            />
                                        )}
                                        <FileMetaData data-is-image={isImageFile}>
                                            <span>{file?.name}</span>
                                            <aside>
                                                {/*<span>{convertBytesToKB(file?.size)} kb</span>*/}
                                                <RemoveFileIcon
                                                    onClick={() => removeFile(fileName)}
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                </RemoveFileIcon>
                                                <PreviewFileIcon onClick={()=>window.open(`${imagePreview}`,'_blank')}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </PreviewFileIcon>
                                            </aside>
                                        </FileMetaData>
                                    </div> :
                                    <div>
                                        {/*Update hình ảnh sản phẩm*/}
                                        {isImageFile && (
                                            <ImagePreview
                                                src={file}
                                                alt={`file preview ${index}`}
                                            />
                                        )}
                                        <FileMetaData data-is-image={isImageFile}>
                                            <span>{fileName}</span>
                                            <aside>
                                                <RemoveFileIcon
                                                    onClick={() => removeFile(fileName)}
                                                >
                                                    <FontAwesomeIcon icon={faTrashAlt}/>

                                                </RemoveFileIcon>
                                                <PreviewFileIcon onClick={()=>window.open(`${file}`,'_blank')}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </PreviewFileIcon>
                                            </aside>
                                        </FileMetaData>
                                    </div>
                                }
                            </PreviewContainer>
                        );
                    })}
                </PreviewList>
            </FilePreviewContainer>
        </>
    );
};

export default FileUpload;
