import {Button} from "react-bootstrap"
import React, {MouseEvent, useEffect, useState} from "react"
import {useIntl} from "react-intl"
import Select from 'react-select'
import {SelectProductCategory} from "../selects/SelectProductCategory"
import {SelectProductBrand} from "../selects/SelectProductBrand"
import {Obj} from "../../utils/types"
import _ from "lodash"

type propsMasterProductSearch = {
    found_number: number,
    search_query?: string | null | undefined,
    product_id?: string | null | undefined | string[],
    product_code?: string | null | undefined | string[],
    seller_skus?: string | null | undefined | string[],
    sell_this?: string | null | undefined | string[],
    price_from?: number | null | undefined | string | string[],
    price_to?: number | null | undefined | string | string[],
    category_id?: number | null | undefined | string | string[],
    brand_id?: number | null | undefined | string | string[],
    submitSearchHandler: Function
}

type OptionSelect = {
    label?: string
    value?: string | number
}

const MasterProductSearch: (props: propsMasterProductSearch) => JSX.Element = (props: propsMasterProductSearch) => {
    const intl = useIntl()

    const {
        search_query,
        product_code,
        sell_this,
        category_id,
        brand_id,
        submitSearchHandler
    } = {...props}

    const [show, setShow] = useState(false)

    const [keyword, setKeyword] = useState<string | null | undefined | string[]>(search_query)
    const [productCode, setProductCode] = useState<string | null | undefined | string[]>(product_code ?? '')
    const [sellThis, setSellThis] = useState<Obj>({})
    const [categoryId, setCategoryId] = useState<number | null | undefined | string | string[]>(category_id ?? "")
    const [brandId, setBrandId] = useState<number | null | undefined | string | string[]>(brand_id ?? '')

    // const [cate, setCate] = useState('')
    //
    // const [orderBy, setOrderBy] = useState('asc');
    // const [sortBy, setSortBy] = useState([
    //     'product_code', 'product_id', 'seller_skus'
    // ]);
    const options: OptionSelect[] = [
        {value: 'F', label: intl.formatMessage({id: 'PRODUCT.SALE_FOR'})},
        {value: 'S', label: intl.formatMessage({id: 'PRODUCT.SELL_THIS'})},
    ]
    useEffect(() => {
        setKeyword(search_query)
    }, [search_query])

    useEffect(() => {
        setProductCode(product_code)
    }, [product_code])

    useEffect(() => {
        setSellThis(options.filter((item: OptionSelect) => item.value === sell_this)[0])
    }, [sell_this])

    useEffect(() => {
        setCategoryId(category_id)
    }, [category_id])

    useEffect(() => {
        setBrandId(brand_id)
    }, [brand_id])

    const handleSelectCategory = (e: number | string | null) => {
        if (e == null || e == '') {
            setCategoryId('')
        } else {
            setCategoryId(e)
        }
    }

    const handleSelectBrand = (e: number | string | null) => {
        if (e == null || e == '') {
            setBrandId('')
        } else {
            setBrandId(e)
        }
    }

    /* Use react hook to get width Start */
    const width = window.innerWidth
    useEffect(() => {
        if (width > 992) {
            setShow(true)
        } else {
            setShow(false)
        }
    }, [width])
    /* Use react hook to get width End */

    return (
        <>
            <div className="card mb-7">
                <div className="card-body">
                    <div className="ProductSearch">
                        <div className="position-relative w-100 me-md-2">
                            <span
                                className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                     fill="none">
                                    <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                                          transform="rotate(45 17.0365 15.1223)" fill="black"></rect>
                                    <path
                                        d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                                        fill="black"></path>
                                </svg>
                            </span>
                            <input type="text" className="form-control form-control-solid ps-10 fs-7" name="search"
                                   defaultValue={keyword ? String(keyword) : ''}
                                   placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_SEARCH'})}
                                   onChange={(e: any) => setKeyword(e.target.value)}
                                   onKeyPress={(e) => {
                                       if (e.code == "Enter") {
                                           // TODO: Submit
                                           submitSearchHandler({
                                               search_query: keyword,
                                               product_code: productCode,
                                               sell_this: sellThis?.value,
                                               category_id: categoryId,
                                               brand_id: brandId
                                           })
                                       }
                                   }}
                            />
                        </div>
                        <div className={`collapse ${show ? 'show' : ''}`} id="kt_advanced_search_form">
                            <div className="row">
                                <div className="col-12 mt-3">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.PRODUCT_CODE'})}</label>
                                    <input type="text" className="form-control"
                                           name="product_code"
                                           placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_CODE'})}
                                           defaultValue={productCode ?? ""}
                                           onChange={
                                               (e: any) => {
                                                   setProductCode(e.target.value)
                                               }
                                           }
                                           onKeyPress={(e) => {
                                               if (e.code == "Enter") {
                                                   // TODO: Submit
                                                   submitSearchHandler({
                                                       search_query: keyword,
                                                       product_code: productCode,
                                                       sell_this: sellThis?.value,
                                                       category_id: categoryId,
                                                       brand_id: brandId
                                                   })
                                               }
                                           }}/>
                                </div>
                                <div className="col-12 mt-3">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.SELL'})}</label>
                                    <Select options={options} isClearable name="product_sell"
                                            value={_.isEmpty(sellThis) ? null : sellThis}
                                            onChange={
                                                (option: any) => {
                                                    if(option)
                                                        setSellThis(option)
                                                    else setSellThis({})
                                                }
                                            }
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mt-3">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.CATEGORY'})}</label>
                                    <SelectProductCategory defaultValue={categoryId}
                                                           handleSelect={handleSelectCategory}/>
                                </div>
                                <div className="col-12 mt-3">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.BRAND'})}</label>
                                    <SelectProductBrand defaultValue={brandId} handleSelect={handleSelectBrand}/>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-sm btn-primary me-5 w-100 mt-3 fs-7" onClick={() => {
                            submitSearchHandler({
                                search_query: keyword,
                                product_code: productCode,
                                sell_this: sellThis?.value,
                                category_id: categoryId,
                                brand_id: brandId
                            })
                        }}>{intl.formatMessage({id: 'ECOMMERCE.COMMON.SEARCH'})}</button>
                        <Button variant={"link"} className={"fs-7 d-lg-none"}
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                    if (show) {
                                        e.currentTarget.innerHTML = intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})
                                    } else {
                                        e.currentTarget.innerHTML = intl.formatMessage({id: 'LANGUAGE.CLOSE_ADVANCED_SEARCH'})
                                    }
                                    setShow(!show)
                                }}>{intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export {MasterProductSearch}
