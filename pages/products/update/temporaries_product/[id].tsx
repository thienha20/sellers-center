import Head from 'next/head'
import styles from '../../../../assets/styles/modules/products.module.scss'
import {fnCurrentApiUrl, fnUrlQueryBuilder, toAbsoluteUrl} from "../../../../utils/url"
import React, {ChangeEvent, ReactElement, ReactNode, useEffect, useState} from "react"
import {MasterLayout} from "../../../../components/layout/MasterLayout"
import {NextPageWithLayout} from "../../../../utils/types"
import axios from "axios";
import {useIntl} from "react-intl";
import {useLang} from "../../../../components/i18n/Metronici18n";
import {useRouter} from "next/router";
import FileUpload from "../../../../components/uploads/FileUpload";
import TinyEditor from "../../../../components/editors/tinyMce";
import {Button, FormControl, InputGroup, Modal} from "react-bootstrap";
import allActions from "../../../../redux/actions";

import {useDispatch, useSelector} from "react-redux";
import {ReducerInterFace} from "../../../../redux/reducers";
import _, {isArray} from "lodash";
import {ProductCategoriesBlock} from "../../../../components/blocks/product/ProductCategoriesBlock";
import {ProductFeatureBlock} from "../../../../components/blocks/product/ProductFeatureBlock";
import {ProductVariantBlock} from "../../../../components/blocks/product/ProductVariantBlock";
import {usePageData} from "../../../../components/layout/core";
import {ProductShippingBlock} from "../../../../components/blocks/product/ProductShippingBlock";

type ProductImagePath = {
    [path: string]: {
        fileName: string,
        image_id: string,
        image_path: string,
        pair_id: string,
    }
}


const Detail: NextPageWithLayout = () => {
    const intl = useIntl()
    const lang: string = useLang() ?? "vi"
    const router = useRouter()
    const dispatch = useDispatch()
    const {id} = router.query

    useEffect(() => {
        dispatch(allActions.products.reset())
    }, [])

    useEffect(() => {
        const getProductInfo = () => {
            return axios.post(fnCurrentApiUrl(`/api/products/temporaries_product`), {
                id: id
            })
        }
        if (!_.isNil(id)) {
            getProductInfo().then(data => {
                // console.log(data)
                dispatch(allActions.products.all_data(data.data))
                getFeatureList(data.data?.category_id)
            })
        }
    }, [lang, id])

    //  : PRODUCT
    const product = useSelector((state: ReducerInterFace) => state.products)
    // const [product, setProduct] = useState(useSelector((state : ReducerInterFace)=> state.products)?? {})

    const {setPageBreadcrumbs} = usePageData()

    useEffect(() => {
        setPageBreadcrumbs([
            {
                title: intl.formatMessage({id: "PRODUCT.PRODUCT_LIST"}),
                path: "/products"
            }, {
                title: lang === "vi" ? product?.name?.vi : product?.name?.en,
                isActive: true
            }
        ])
    }, [product])
    // STATES :  PRODUCT NAME & MODAL
    const [_tmp_prodName_en, set_tmp_prodName_en] = useState('')
    const [showModal, setShowModal] = useState(false);

    // STATES : FILES & FILES UPLOAD
    const [files, setFiles] = useState<Array<string | File>>([]);

    const filePathState: ProductImagePath = useSelector((state: ReducerInterFace) => state.products?.image_path) //TODO: RECHECK
    const fileState = useSelector((state: ReducerInterFace) => state.products?.images) //TODO: RECHECK
    const [defaultFiles, setDefaultFiles] = useState<{ [key: string]: File | string }>({});

    // STATES :
    const [categories, setCategories] = useState([]); // Category List
    const [features, setFeatures] = useState([]); // Feature List

    // STATES : DESCRIPTIONS
    const [showMoreDescription, setShowMoreDescription] = useState(false);
    const [viDescription, setViDescription] = useState('')
    const [enDescription, setEnDescription] = useState('')

    useEffect(() => {
        if (viDescription == '') {
            setViDescription(product?.description?.vi)
        }
        if (enDescription == '') {
            setEnDescription(product?.description?.en)
        }
    }, [product])

    // HANDLERS : PRODUCT DESCRIPTION
    const handeChangeDescription = (e: any, lang: string) => {
        switch (lang) {
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

        if (!_.isEmpty(fileState)) {
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
        } else if (_.isObject(filePathState)) {
            const paths = Object.keys(filePathState)
            if (!_.isEmpty(paths)) {
                let _files: { [key: string]: string } = {}
                paths.forEach((path: string) => {
                    const file = filePathState[path]
                    // {'IMAGE NAME' : '/IMAGE/PATH'}
                    _files[file.fileName] = path
                })
                setDefaultFiles(_files)
            }

        }
    }
    const handleDeleteImage = (e:string) => {
        let _deleted_images = product.deleted_images??[]
        _deleted_images.push({
            pair_id: product.image_path[e].pair_id??'',
            image_path: product.image_path[e].image_path??''
        })
        dispatch(allActions.products.deleted_images(_deleted_images))
    }

    useEffect(() => {
        // Load image from Product state
        handleDefaultImage()
    }, [fileState])

    useEffect(() => {
        // Load image from Product state
        handleDefaultImage()
    }, [filePathState])

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
                        dispatch(allActions.products.images(product_images))
                        resolve(product_images)
                    })
                    .catch(function (response) {
                        //handle error - status code: 400
                        reject(response)
                    });
            } else {
                dispatch(allActions.products.images([]))
                resolve([])
            }
        })

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
            });
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
            setSubmitted(true)
        }).catch(e => {

        })
    }

    const [submit, setSubmit] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (submit) {
            call_api_create_product();
        }
    }, [submit])

    useEffect(() => {
        if (submitted) {
            dispatch(allActions.products.reset(''))
            router.push(fnUrlQueryBuilder('products', {}))
        }
    }, [submitted])

    return (
        <div className={styles.container}>
            <Head>
                <title>Product</title>
                <meta name="description" content="Product"/>
                <link rel="icon" href={toAbsoluteUrl("/favicon.ico")}/>
            </Head>
            {product.product_temporary_id ? <div>
                <div className="card card-flush">
                    <div className="card-body">
                        <h2>{intl.formatMessage({id: 'PRODUCT.PRODUCT_INFO'})}</h2>
                        <div className="row mb-5 mt-10">

                            <label
                                className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.IMAGES'})}
                            </label>
                            <div className="">
                                <FileUpload label={"uploadFile"} multiple={true} updateFilesCb={handleFileChange}
                                            defaultValue={defaultFiles}
                                            handleDeletedPath={handleDeleteImage}

                                />
                            </div>
                        </div>
                        <div className="row mb-5">
                            <label className="fs-6 form-label fw-bolder text-dark"><span
                                className="text-danger">* </span>{intl.formatMessage({id: 'PRODUCT.PRODUCT_NAME'})}
                            </label>

                            <div className={'col col-sm col-lg-9'}>
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
                            <div className={'col col-sm col-lg-3 '}>
                                <Button variant={'light'} onClick={e => {
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
                        <h2>{intl.formatMessage({id: 'PRODUCT.FEATURE'})}</h2>
                        <ProductFeatureBlock featureList={features}/>
                    </div>
                </div>
                <div className="card card-flush mt-5">
                    <div className="card-body">
                        <h2>{intl.formatMessage({id: 'PRODUCT.VARIANT'})}</h2>

                        <ProductVariantBlock defaultVariations={product.variations}
                                             defaultVariationsGroup={product.variation_groups}/>
                    </div>
                </div>
                <div className="card card-flush mt-5">
                    <div className="card-body">
                        <h2>{intl.formatMessage({id: 'PRODUCT.DESCRIPTION'})}</h2>
                        {/*noi dung*/}
                        <TinyEditor
                            data={viDescription}
                            onChange={_.debounce((e) => {
                                handeChangeDescription(e, 'vi')
                            }, 300)
                            }
                        />

                    </div>
                    <div className={`collapse ${showMoreDescription ? 'show' : ''}`} id="kt_advanced_search_form">
                        <div className="separator separator-dashed mt-9 mb-6"></div>
                        <div className="mt-5 card-body">
                            <h4>{intl.formatMessage({id: 'PRODUCT.DESCRIPTION_EN'})}</h4>

                            <TinyEditor
                                data={enDescription}
                                onChange={_.debounce((e) => {
                                    handeChangeDescription(e, 'en')
                                }, 300)
                                }/>
                        </div>
                    </div>
                    <Button id="kt_horizontal_search_advanced_link" variant={'link'} onClick={() => {
                        setShowMoreDescription(!showMoreDescription)
                    }}>{!showMoreDescription ? intl.formatMessage({id: 'LANGUAGE.SHOW_MORE'}) : intl.formatMessage({id: 'LANGUAGE.SHOW_LESS'})}</Button>

                </div>

                <ProductShippingBlock default_shipping={product.shippings}/>
                {product.name.vi && product.category_id && (
                    <div className="card card-flush mt-5">
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
                    </div>
                )}
            </div> : <div className='card card-flush p-4 align-center'>
                        <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...{' '}
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
            </div>}

        </div>
    )
}

// @ts-ignore
Detail.getLayout = (page: ReactElement): ReactNode => {
    return (<MasterLayout>{page}</MasterLayout>)
}

export default Detail
