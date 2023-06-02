import Head from 'next/head'
import React, {ChangeEvent, ReactElement, ReactNode, useEffect, useState} from "react"
import {MasterLayout} from "../../components/layout/MasterLayout"
import {NextPageWithLayout} from "../../utils/types"
import FileUpload from "../../components/uploads/FileUpload"
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../utils/url"
import TinyEditor from "../../components/editors/tinyMce"
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap"
import {useIntl} from "react-intl"
import axios from "axios"
import {useLang} from "../../components/i18n/Metronici18n"
import {useDispatch, useSelector} from "react-redux"
import {ReducerInterFace} from "../../redux/reducers"
import allActions from "../../redux/actions"
import _, {isArray} from "lodash"
import {ProductFeatureBlock} from "../../components/blocks/product/ProductFeatureBlock"
import {ProductVariantBlock} from "../../components/blocks/product/ProductVariantBlock"
import {ProductCategoriesBlock} from "../../components/blocks/product/ProductCategoriesBlock"
import {usePageData} from "../../components/layout/core"
import {useRouter} from "next/router"
import {ProductShippingBlock} from "../../components/blocks/product/ProductShippingBlock";

const Index: NextPageWithLayout = () => {

    const intl = useIntl()
    const lang: string = useLang() ?? "vi"
    const dispatch = useDispatch()
    const router = useRouter()

    const {setPageBreadcrumbs} = usePageData()
    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "PRODUCT.PRODUCT_ADD"}),
                isActive: true
            }
        ])
        dispatch(allActions.products.reset())
    }, [])

    //  : PRODUCT
    const product = useSelector((state: ReducerInterFace) => state.products)

    // STATES :  PRODUCT NAME & MODAL
    const [_tmp_prodName_en, set_tmp_prodName_en] = useState('')
    const [showModal, setShowModal] = useState(false)

    // STATES : FILES & FILES UPLOAD
    const [files, setFiles] = useState<Array<string | File>>([])
    const fileState = useSelector((state: ReducerInterFace) => state.products?.images) //TODO: RECHECK
    const [defaultFiles, setDefaultFiles] = useState<{ [key: string]: File | string }>({})

    // STATES :
    const [categories, setCategories] = useState([]) // Category List
    const [features, setFeatures] = useState([]) // Feature List

    // STATES : DESCRIPTIONS
    const [showMoreDescription, setShowMoreDescription] = useState(false)
    const [viDescription, setViDescription] = useState('')
    const [enDescription, setEnDescription] = useState('')

    useEffect(()=>{
        if(viDescription == ''){
            setViDescription(product?.description?.vi)
        }
        if(enDescription == ''){
            setEnDescription(product?.description?.en)
        }
    }, [product])

    // HANDLERS : PRODUCT DESCRIPTION
    const handeChangeDescription = (e:any, lang:string) => {
        switch(lang){
            case 'vi':
                dispatch(allActions.products.description_vi(typeof e == 'string' ? e : e.target.getContent()))
                break;
            case 'en':
                dispatch(allActions.products.description_en(typeof e == 'string' ? e : e.target.getContent()))
                break;
            default:
                break;
        }
    }

    // HANDLERS : PRODUCT NAME MODAL
    const handleCloseModal = () => {
        set_tmp_prodName_en('')
        setShowModal(false)
    }

    const handleChangeNameEN = () => {
        dispatch(allActions.products.name_en(_tmp_prodName_en ?? ''))
        set_tmp_prodName_en('')
        handleCloseModal()
    }

    // HANDLERS : FILES & FILES UPLOAD
    const handleFileChange = (filesAsArray: any) => {
        setFiles(filesAsArray)
    }

    const handleDefaultImage = () => {
        let _files: { [key: string]: string } = {}
        if (isArray(fileState)) {
            for (const file of fileState) {
                const file_data = file.split('/')
                // {'IMAGE NAME' : '/IMAGE/PATH'}
                const fileName: string = file_data[file_data.length - 1]
                _files[fileName] = file
            }
            setDefaultFiles(_files)
        }
    }

    const handleImageUpload = async () => {
        let formData = new FormData()
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const type: string = typeof files[i]
                let fileName: string = ''
                switch (type) {
                    case 'string':
                        const file_data = String(files[i]).split('/')
                        fileName = file_data[file_data.length - 1]
                        formData.append(`product_images[${String(i)}][[${String(i)}.${fileName}]`, files[i])
                        break
                    default:
                        // @ts-ignore
                        fileName = files[i].name
                        formData.append(`product_images[${i}][${fileName}]`, files[i])
                        break
                }
            }
            await axios({
                method: "POST",
                url: fnCurrentApiUrl("/api/products/imageUpload"),
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
                .then(function (response) {
                    //handle success - status code: 200
                    let images = response.data.images
                    let product_images = []
                    for (const image of images) {
                        for (const name of Object.keys(image)) {
                            product_images.push(image[name])
                        }
                    }
                    dispatch(allActions.products.images(product_images))
                    setSubmit(true)

                })
                .catch(function (response) {
                    //handle error - status code: 400
                });
        } else {
            setSubmit(true)
        }
    }

    useEffect(() => {
        // Load image from Product state
        handleDefaultImage()
    }, [fileState])

    // HANDLERS : CATEGORIES
    useEffect(() => {
        // Loading Categories list
        const cate = () => {
            return axios.post(fnCurrentApiUrl("/api/categories"), {
                lang_code: lang,
            })
        }

        cate().then(response => {
            const _cate = response.data.data
            setCategories(_cate)
        })
    }, [])

    const handlerSelectCategories = (selected: string | number) => {
        if (!_.isEmpty(selected)) {
            dispatch(allActions.products.category_id(selected))
            getFeatureList(selected)
        }
    }


    // FEATURE SECTION
    const getFeatureList = (selectedCateId: any) => {
        if (selectedCateId) {
            axios.post(fnCurrentApiUrl(`/api/feature`),
                {
                    id: selectedCateId,
                    variants: true
                }).then(response => {
                setFeatures(response.data.data)
            })
        }
    }


    // HANDLERS : SUBMIT & SAVE DRAFT BUTTONS
    const handleProductSubmit = async () => {
        const handleImageUpload = new Promise((resolve, reject) => {

            let formData = new FormData()
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const type = typeof files[i]
                    let fileName = ''

                    switch (type) {
                        case 'string':
                            const file_data = String(files[i]).split('/')
                            fileName = file_data[file_data.length - 1]
                            formData.append(`product_images[${String(i)}][[${String(i)}.${fileName}]`, files[i])
                            break;
                        case 'object':
                            // @ts-ignore
                            // fileName  = files[i][name] ?? String(i)
                            fileName = files[i]?.name
                            formData.append(`product_images[${i}][${fileName}]`, files[i])

                            break;
                        default:
                            break;

                    }
                }
                axios({
                    method: "POST",
                    url: fnCurrentApiUrl("/api/products/imageUpload"),
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                    .then(function (response) {
                        //handle success - status code: 200
                        // let dir = response.data.dir
                        let images = response.data.images
                        let product_images = []
                        for (const image of images) {
                            for (const name of Object.keys(image)) {
                                product_images.push(image[name])
                            }
                        }
                        resolve(dispatch(allActions.products.images(product_images)))
                    })
                    .catch(function (response) {
                        //handle error - status code: 400
                        reject(response)
                    });
            } else {
                resolve(dispatch(allActions.products.images([])))
            }
        })

        handleImageUpload.then(() => {
            dispatch(allActions.products.product_temporary_status('W'))
            setSubmit(true)

        })
    }

    const handleProductSaveDraft = async () => {
        const handleImageUpload = new Promise((resolve, reject) => {

            let formData = new FormData()
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const type = typeof files[i]
                    let fileName = ''

                    switch (type) {
                        case 'string':
                            const file_data = String(files[i]).split('/')
                            fileName = file_data[file_data.length - 1]
                            formData.append(`product_images[${String(i)}][[${String(i)}.${fileName}]`, files[i])
                            break;
                        case 'object':
                            // @ts-ignore
                            // fileName  = files[i][name] ?? String(i)
                            fileName = files[i]?.name
                            formData.append(`product_images[${i}][${fileName}]`, files[i])

                            break;
                        default:
                            break;

                    }
                }
                axios({
                    method: "POST",
                    url: fnCurrentApiUrl("/api/products/imageUpload"),
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })
                    .then(function (response) {
                        //handle success - status code: 200
                        // let dir = response.data.dir
                        let images = response.data.images
                        let product_images = []
                        for (const image of images) {
                            for (const name of Object.keys(image)) {
                                product_images.push(image[name])
                            }
                        }

                        resolve(dispatch(allActions.products.images(product_images)))
                    })
                    .catch(function (response) {
                        //handle error - status code: 400
                        reject(response)
                    });
            } else {

                resolve(dispatch(allActions.products.images([])))
            }
        })

        handleImageUpload.then(() => {
            dispatch(allActions.products.product_temporary_status('F'))
            setSubmit(true)
        })
    }

    const call_api_create_product = () => {
        axios.post(fnCurrentApiUrl('/api/products/create'), product).then(result => {
            setSubmited(true)
        }).catch(e => {

        })
    }

    const [submit, setSubmit] = useState<boolean>(false)
    const [submited, setSubmited] = useState<boolean>(false)

    useEffect(() => {
        if (submit) {
            call_api_create_product()
        }
    }, [submit])

    useEffect(() => {
        if (submited) {
            dispatch(allActions.products.reset())
            router.push(fnUrlQueryBuilder('products', {}))
        }
    }, [submited])


    const [loading, setLoading] = useState<boolean>(true)
    // LOAD SOURCE_PRODUCT_ID for sell this
    useEffect(() => {
            if (router.isReady) {
                if(!_.isNil(router.query.source_product_id)){
                    const getProductInfo = () => {
                        return axios.post(fnCurrentApiUrl(`/api/products/${router.query.source_product_id}`))
                    }

                    getProductInfo().then(data => {
                        const _data = {
                            name: {
                                vi: data.data.name.vi,
                                en: data.data.name.en
                            },
                            category_id: data.data.category_id,
                            source_product_id: router.query.source_product_id,
                            product_temporary_status: 'W'
                        }
                        dispatch(allActions.products.all_data(_data))

                        console.log(data.data)
                        getFeatureList(data.data?.category_id)
                        setLoading(false)
                    }).catch((e)=>{
                        setLoading(false)
                    })
                    console.log('source_product_id', router.query.source_product_id)
                } else {
                    setLoading(false)
                }
            }
        },
        [router])

    return (
        <>
            <Head>
                <title>{intl.formatMessage({id: 'PRODUCT.PRODUCT_ADD'})}</title>
                <meta name="description" content={intl.formatMessage({id: 'PRODUCT.PRODUCT_ADD'})}/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            {!loading ?
                <div className="">
                    <div className="card card-flush">
                        <div className="card-body">
                            <h2>1. {intl.formatMessage({id: 'PRODUCT.PRODUCT_INFO'})}</h2>
                            <div className="row mt-10">
                                <label
                                    className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.IMAGES'})}
                                </label>
                                <div>
                                    <FileUpload label={"uploadFile"} multiple={true} updateFilesCb={handleFileChange}
                                                defaultValue={defaultFiles}
                                                handleDeletedPath={(e:string)=>{}}
                                    />
                                </div>
                            </div>
                            <div className="row mb-5">
                                <label className="fs-6 form-label fw-bolder text-dark"><span
                                    className="text-danger">* </span>{intl.formatMessage({id: 'PRODUCT.PRODUCT_NAME'})}
                                </label>

                                <div className={'col-12 col-sm col-lg-9'}>
                                    <input type="text" required={true} className="form-control form-control"
                                           name="product_name"
                                           placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_NAME'})}
                                           defaultValue={product?.name?.vi ?? ''}
                                           onChange={_.debounce(
                                               (e) => {
                                                   dispatch(allActions.products.name_vi(e.target.value))
                                               }, 300
                                           )}
                                    />
                                </div>
                                <div className={'col-12 col-sm col-lg-3 product_info'}>
                                    <Button className={'btn-sm w-100 w-sm-auto '} variant={'light'} onClick={e => {
                                        setShowModal(true)
                                    }}>
                                        {intl.formatMessage({id: 'PRODUCT.ADD_MULTI_LANG'})}
                                    </Button>
                                </div>
                            </div>
                            <Modal show={showModal} onHide={handleCloseModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{intl.formatMessage({id: 'PRODUCT.ADD_MULTI_LANG_FOR_PRODUCT_NAME'})}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <label className="fs-6 form-label fw-bolder text-dark"><span
                                        className="text-danger"></span>{intl.formatMessage({id: 'PRODUCT.PRODUCT_NAME_EN'})}
                                    </label>
                                    <input type="text" required={true} className="form-control form-control"
                                           name="product_name"
                                           placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_NAME_EN'})}
                                           defaultValue={product?.name?.en ?? ''}
                                           onChange={_.debounce(
                                               (e) => {
                                                   set_tmp_prodName_en(e.target.value)
                                               }, 300
                                           )}
                                    />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseModal}>
                                        {intl.formatMessage({id: 'LANGUAGE.CLOSE'})}
                                    </Button>
                                    <Button variant="primary" onClick={handleChangeNameEN}>
                                        {intl.formatMessage({id: 'LANGUAGE.SAVE_CHANGE'})}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <ProductCategoriesBlock
                                selectedCate={product.category_id}
                                categoriesList={categories} selectedHandler={handlerSelectCategories}/>
                        </div>
                    </div>
                    <div className="card card-flush mt-5">
                        <div className="card-body">
                            <h2>2. {intl.formatMessage({id: 'PRODUCT.FEATURE'})}</h2>
                            <ProductFeatureBlock featureList={features}/>
                        </div>
                    </div>
                    <div className="card card-flush mt-5">
                        <div className="card-body">
                            <h2>3. {intl.formatMessage({id: 'PRODUCT.VARIANT'})}</h2>
                            <ProductVariantBlock/>
                        </div>
                    </div>
                    <div className="card card-flush mt-5">
                        <div className="card-body">
                            <h2>4. {intl.formatMessage({id: 'PRODUCT.DESCRIPTION'})}</h2>
                            {/*noi dung*/}
                            <TinyEditor
                                data={viDescription}
                                onChange={_.debounce((e) => {
                                    handeChangeDescription(e,'vi')
                                }, 500)
                                }/>

                        </div>
                        <div className={`collapse ${showMoreDescription ? 'show' : ''}`} id="kt_advanced_search_form">
                            <div className="separator separator-dashed mt-9 mb-6"></div>
                            <div className="mt-5 card-body">
                                <h4>{intl.formatMessage({id: 'PRODUCT.DESCRIPTION_EN'})}</h4>

                                <TinyEditor
                                    data={enDescription}
                                    onChange={_.debounce((e) => {
                                        handeChangeDescription(e,'en')
                                    }, 500)
                                    }/>
                            </div>
                        </div>
                        <Button id="kt_horizontal_search_advanced_link" variant={'link'} onClick={() => {
                            setShowMoreDescription(!showMoreDescription)
                        }}>{!showMoreDescription ? intl.formatMessage({id: 'LANGUAGE.SHOW_MORE'}) : intl.formatMessage({id: 'LANGUAGE.SHOW_LESS'})}</Button>

                    </div>
                    <ProductShippingBlock/>
                    {product.name.vi && product.category_id && (<div className="card card-flush mt-5">
                        <div className="card-body">
                            <div className={' d-flex justify-content-end'}>
                                <Button className={'me-4 btn-sm'} variant={'light'} disabled={submit}
                                        onClick={handleProductSaveDraft}
                                >{intl.formatMessage({id: 'LANGUAGE.SAVE_DRAFT'})}</Button>
                                <Button className={'btn btn-primary btn-sm'} disabled={submit}
                                        onClick={handleProductSubmit}
                                >{intl.formatMessage({id: 'LANGUAGE.SAVE'})}</Button>
                            </div>
                        </div>
                    </div>)}
                </div>
                : <div className='card card-flush p-4 align-center'>
                        <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...{' '}
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                </div>
            }
        </>
    )
}

Index.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Index
