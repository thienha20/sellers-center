import React, {useEffect, useRef, useState} from "react"
import {Editor} from "@tinymce/tinymce-react"
import {Editor as TinyMCEEditor} from 'tinymce'
import Head from 'next/head'
import Script from 'next/script'
import md5 from 'md5'
import {fnUrl} from "../../utils/url"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../redux/reducers"

type tinyProps = {
    id?: string
    data?: string
    onBlur?: (editor: any) => void
    onChange?: (value: string) => void
}

type optsProps = {
    url: string
    nodeId?: string
    uploadTargetHash?: string
    lang: string
    baseUrl: string
    cssAutoLoad?: string[]
}
type elfProps = {
    browser?: (callback: (url: string, obj?: any) => void, value: string, meta: any) => any,
    uploadHandler?: (blobInfo: any, success: (url: unknown | string | null) => void, failure: (err: string) => void) => void
}

const tinymceElfinder = (opts: optsProps): elfProps => {
    if (typeof $ === "undefined") {
        return {}
    }

    let elfNode: any = $("<div/>");
    if (opts.nodeId) {
        elfNode.attr('id', opts.nodeId);
        delete opts.nodeId;
    }

    // upload target folder hash
    const uploadTargetHash: string = opts.uploadTargetHash || 'L1_Lw';
    delete opts.uploadTargetHash;

    // get elFinder insrance
    const getFm: any = (open: boolean | null) => {
        // CSS class name of TinyMCE conntainer
        // @ts-ignore
        const cls = (typeof tinymce !== "undefined" && tinymce.majorVersion < 5) ? 'mce-container' : 'tox';
        return new Promise((resolve: any, reject: any) => {
            // elFinder instance
            let elf: any;

            // Execute when the elFinder instance is created
            const done = () => {
                if (open) {
                    // request to open folder specify
                    if (!Object.keys(elf.files()).length) {
                        // when initial request
                        elf.one('open', () => {
                            elf.file(open) ? resolve(elf) : reject(elf, 'errFolderNotFound');
                        });
                    } else {
                        // elFinder has already been initialized
                        // @ts-ignore
                        new Promise<void>((res: (value: unknown | null) => void, rej: (reason: any | null) => void) => {
                            if (elf.file(open)) {
                                // @ts-ignore
                                res();
                            } else {
                                // To acquire target folder information
                                elf.request({cmd: 'parents', target: open}).done((e: any) => {
                                    // @ts-ignore
                                    elf.file(open) ? res() : rej();
                                }).fail(() => {
                                    // @ts-ignore
                                    rej();
                                });
                            }
                        }).then(() => {
                            if (elf.cwd().hash == open) {
                                resolve(elf);
                            } else {
                                // Open folder after folder information is acquired
                                elf.exec('open', open).done(() => {
                                    resolve(elf);
                                }).fail((err: string) => {
                                    // @ts-ignore
                                    reject(elf, err ?? 'errFolderNotFound');
                                });
                            }
                        }).catch((err) => {
                            // @ts-ignore
                            reject(elf, err ?? 'errFolderNotFound');
                        });
                    }
                } else {
                    // show elFinder manager only
                    resolve(elf);
                }
            };
            //Check elFinder instance
            if (elf = elfNode?.elfinder('instance')) {
                // elFinder instance has already been created
                done();
            } else {
                // To create elFinder instance
                elf = elfNode?.dialogelfinder(Object.assign({
                    // dialog title
                    title: 'File Manager',
                    // start folder setting
                    startPathHash: open ? open : void (0),
                    // Set to do not use browser history to un-use location.hash
                    useBrowserHistory: false,
                    // Disable auto open
                    autoOpen: false,
                    // elFinder dialog width
                    width: '90%',
                    // elFinder dialog height
                    height: '90%',
                    // set getfile command options
                    commandsOptions: {
                        getfile: {
                            oncomplete: 'close'
                        }
                    },
                    bootCallback: (fm: any) => {
                        // set z-index
                        fm.getUI().css('z-index', parseInt($('body>.' + cls + ':last').css('z-index')) + 100);
                    },
                    getFileCallback: (files: any, fm: any) => {
                    }
                }, opts)).elfinder('instance');
                done();
            }
        });
    };

    let elm: elfProps = {}

    elm.browser = function (callback: (url: string, obj: any) => void, value, meta) {
        getFm().then((fm: any) => {
            let cgf = fm.getCommand('getfile');
            const regist = () => {
                fm.options.getFileCallback = cgf.callback = (file: any, fm: any) => {
                    var url, reg, info;

                    // URL normalization
                    url = fm.convAbsUrl(file.url);

                    // Make file info
                    info = file.name + ' (' + fm.formatSize(file.size) + ')';

                    // Provide file and text for the link dialog
                    if (meta.filetype == 'file') {
                        callback(url, {text: info, title: info});
                    }

                    // Provide image and alt text for the image dialog
                    if (meta.filetype == 'image') {
                        callback(url, {alt: info});
                    }

                    // Provide alternative source and posted for the media dialog
                    if (meta.filetype == 'media') {
                        // @ts-ignore
                        callback(url);
                    }
                };
                fm.getUI().dialogelfinder('open');
            };
            if (cgf) {
                // elFinder booted
                regist();
            } else {
                // elFinder booting now
                fm.bind('init', () => {
                    cgf = fm.getCommand('getfile');
                    regist();
                });
            }
        });

        return false;
    };

    elm.uploadHandler = function (blobInfo, success, failure) {
        new Promise(function (resolve, reject) {
            getFm(uploadTargetHash).then((fm: any) => {
                let fmNode = fm.getUI(),
                    file = blobInfo.blob(),
                    clipdata: boolean = true;
                const err = (e: any) => {
                        var dlg = e.data.dialog || {};
                        if (dlg.hasClass('elfinder-dialog-error') || dlg.hasClass('elfinder-confirm-upload')) {
                            fmNode.dialogelfinder('open');
                            fm.unbind('dialogopened', err);
                        }
                    },
                    closeDlg = () => {
                        if (!fm.getUI().find('.elfinder-dialog-error:visible,.elfinder-confirm-upload:visible').length) {
                            fmNode.dialogelfinder('close');
                        }
                    };

                // check file object
                if (file.name) {
                    // file blob of client side file object
                    // @ts-ignore
                    clipdata = void (0);
                }
                // Bind err function and exec upload
                fm.bind('dialogopened', err).exec('upload', {
                    files: [file],
                    target: uploadTargetHash,
                    clipdata: clipdata, // to get unique name on connector
                    dropEvt: {altKey: true, ctrlKey: true} // diable watermark on demo site
                }, void (0), uploadTargetHash)
                    .done((data: any) => {
                        if (data.added && data.added.length) {
                            fm.url(data.added[0].hash, {async: true}).done(function (url: string) {
                                // prevent to use browser cache
                                url += (url.match(/\?/) ? '&' : '?') + '_t=' + data.added[0].ts;
                                resolve(fm.convAbsUrl(url));
                            }).fail(function () {
                                reject(fm.i18n('errFileNotFound'));
                            });
                        } else {
                            reject(fm.i18n(data.error ? data.error : 'errUpload'));
                        }
                    })
                    .fail((err: string) => {
                        const error = fm.parseError(err);
                        reject(fm.i18n(error ? (error === 'userabort' ? 'errAbort' : error) : 'errUploadNoFiles'));
                    })
                    .always(() => {
                        fm.unbind('dialogopened', err);
                        closeDlg();
                    });
            }).catch((fm: any, err: string) => {
                const error = fm.parseError(err);
                reject(fm.i18n(error ? (error === 'userabort' ? 'errAbort' : error) : 'errUploadNoFiles'));
            });
        }).then((url) => {
            return success(url)
        }).catch((err) => {
            failure(err);
        });
    };

    return elm
}

const TinyEditor: React.FC<tinyProps> = (props: tinyProps) => {
    const {id, data, onBlur, onChange} = {...props}
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const securityHash = useSelector((state: ReducerInterFace) => state.settings?.securityHash)
    const [mceElf, setMceElf] = useState<elfProps | null>(null)
    const editorRef = useRef<TinyMCEEditor | null>(null)

    useEffect(() => {
        if(user && securityHash){
            let head: HTMLHeadElement = document.head;
            let link: HTMLLinkElement = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = process.env.PUBLIC_URL + "/css/jquery-ui/jquery-ui.min.css";
            head.appendChild(link);

            let tk: string = md5(`${user.company_id}--${securityHash}`)
            let options: optsProps = {
                url: `${fnUrl("elf_connector.images")}&security_hash=${securityHash}&company_id=${user.company_id}&user_id=${user.user_id}&tk=${tk}`,
                uploadTargetHash: 'l1_lw',
                nodeId: 'elfinder',
                lang: 'vi',
                baseUrl: process.env.PUBLIC_URL +"/js/elfinder/",
                // @ts-ignore
                contextmenu: {
                    navbar: ['open', 'opennew', 'download', '|', 'upload', 'mkdir', '|', 'copy', 'cut', 'paste', 'duplicate', '|', 'rm', 'empty', 'hide', '|', 'rename', '|', 'places', 'info', 'chmod', 'netunmount'],
                    cwd: ['undo', 'redo', '|', 'back', 'up', 'reload', '|', 'upload', 'mkdir', 'mkfile', 'paste', '|', 'empty', 'hide', '|', 'view', 'sort', 'selectall', 'colwidth', '|', 'places', 'info', 'chmod', 'netunmount', '|', 'fullscreen', '|', 'preference'],
                    files: ['getfile', '|', 'open', 'opennew', 'download', 'opendir', 'quicklook', '|', 'upload', 'mkdir', '|', 'copy', 'cut', 'paste', 'duplicate', '|', 'rm', 'empty', 'hide', '|', 'rename', 'edit', '|', 'selectall', 'selectinvert', '|', 'places', 'info', 'chmod', 'netunmount']
                },
                uiOptions: {
                    toolbar: [
                        ['home', 'back', 'forward', 'up', 'reload'],
                        ['netmount'],
                        ['mkdir', 'mkfile', 'upload'],
                        ['open', 'download', 'getfile'],
                        ['undo', 'redo'],
                        ['copy', 'cut', 'paste', 'rm', 'empty', 'hide'],
                        ['duplicate', 'rename', 'edit', 'resize', 'chmod'],
                        ['selectall', 'selectnone', 'selectinvert'],
                        ['quicklook', 'info'],
                        ['search'],
                        ['view', 'sort'],
                        ['preference', 'help'],
                        ['fullscreen']
                    ]
                }
                // cssAutoLoad : ['Material/css/theme-light.css'],
            }
            setMceElf(tinymceElfinder(options));
        }
    }, [user, securityHash])

    return (
        <>
            {typeof $ === "undefined" && user ?
                <>
                    <Script id={"jquery"} strategy="afterInteractive" dangerouslySetInnerHTML={{"__html": process.env.JQUERY ?? ""}}/>
                    <Script id={"jqueryui"} strategy="afterInteractive" dangerouslySetInnerHTML={{"__html": process.env.JQUERYUI ?? ""}}/>
                    <Script id={"elfinder"} strategy="afterInteractive" dangerouslySetInnerHTML={{"__html": process.env.ELFINDER ?? ""}}/>
                </> : null
            }
            <Editor
                apiKey={process.env.TINYMCE}
                onInit={(evt, editor) => {
                    editorRef.current = editor
                }}
                initialValue={data}
                id={id}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter | ' +
                        'image upload| ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat fullscreen',
                    // @ts-ignore
                    file_picker_callback: mceElf?.browser,
                    // @ts-ignore
                    images_upload_handler: mceElf?.uploadHandler
                }}
                onBlur={(editor: any) => {
                    if (onBlur) onBlur(editor)
                }}
                onEditorChange={(value: string) => {
                    if (onChange) onChange(value ?? "")
                }}
            />
        </>
    )
}

export default TinyEditor
