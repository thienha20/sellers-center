import {Button} from "react-bootstrap";
import React, {MouseEvent, useEffect, createRef, useState, useMemo, useRef} from "react";
import {useIntl} from "react-intl";
import {SelectProductCategory} from "../selects/SelectProductCategory";
import {SelectProductBrand} from "../selects/SelectProductBrand";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {useLang} from "../../components/i18n/Metronici18n"

type propsProductSearch = {
    simple ?: boolean,
    isSearchTemporaries ?: boolean,
    found_number : number,
    search_query?: string | null | undefined,
    product_id?: string | null | undefined | string[],
    product_code?:string | null | undefined | string[],
    seller_skus?:string | null | undefined | string[],
    price_from?:number| null | undefined | string | string[],
    price_to?:number| null | undefined | string | string[],
    category_id?:number| null | undefined | string | string[],
    brand_id?:number| null | undefined | string | string[],
    date_from?: string | null | undefined | string[],
    date_to?: string | null | undefined | string[],
    submitSearchHandler: Function
}

const ProductSearch: (props:  propsProductSearch) => JSX.Element = (props: propsProductSearch) => {
    const intl = useIntl()
    const lang: string = useLang() ?? "vi"

    const {search_query, product_id, product_code, seller_skus, price_from,price_to , category_id, brand_id,
        date_from, date_to,
        isSearchTemporaries,
         submitSearchHandler, simple} = {...props}

    const [show, setShow] = useState(false);

    const [keyword, setKeyword] = useState(search_query);
    // const [foundNumber, setFoundNumber] = useState(found_number);
    const [productCode,setProductCode] = useState(product_code??'')
    const [productId,setProductId] = useState(product_id?? '')
    const [sellerSkus, setSellerSkus] = useState(seller_skus??'')
    const [priceFrom, setPriceFrom] = useState(price_from??'')
    const [priceTo, setPriceTo] = useState(price_to??'')
    const [category, setCategory] = useState(category_id??'')
    const [brand, setBrand] = useState(brand_id??'')
    const [dateFrom, setDateFrom] = useState<string | string[] | null | undefined>(date_from ?? "")
    const [dateTo, setDateTo] = useState<string | string[] | null | undefined>(date_to ?? "")
    const [calendar, setCalendar] = useState<string>("")
    const refer = useRef<DateRangePicker>(null)

    const [ orderBy, setOrderBy] = useState('asc');
    const [sortBy, setSortBy] = useState([
        'product_code', 'product_id', 'seller_skus'
    ]);

    useEffect(()=>{
        if(search_query){
            setKeyword(search_query)
        }
        // if(found_number){
        //     setFoundNumber(found_number)
        // }
        if(product_code){
            setProductCode(product_code)
        }
        if(product_id){
            setProductId(product_id)
        }
        if(seller_skus){
            setSellerSkus(seller_skus)
        }
        if(price_from){
            setPriceFrom(price_from)
        }
        if(price_to){
            setPriceTo(price_to)
        }
        if(category_id){
            setCategory(category_id)
        }
        if(brand_id){
            setBrand(brand_id)
        }

    },[search_query, product_id, product_code, seller_skus, price_from, price_to ])

    // const handleSelectBrand = (e:number|string)=>{
    // }

    const handleSelectCategory = (e: number | string | null) => {
        if (e == null || e == '') {
            setCategory('');
        } else {
            setCategory(e);
        }
    }

    const handleSelectBrand = (e: number | string | null) => {
        if (e == null || e == '') {
            setBrand('');
        } else {
            setBrand(e);
        }
    }
    /* Use react hook to get width Start */
    const width = window.innerWidth
    useEffect( () => {
        if(width > 992)
        {
            setShow(true)
        }
        else {
            setShow(false)
        }
    }, [width]);
    /* Use react hook to get width End */

    useEffect(() => {
        if (date_from != dateFrom) {
            setDateFrom(date_from)
            if (!date_from) {
                refer.current?.setStartDate(new Date())
            } else {
                refer.current?.setStartDate(date_from)
            }
        }
    }, [date_from])

    useEffect(() => {
        if (date_to != dateTo) {
            setDateTo(date_to)
            if (!date_to) {
                refer.current?.setEndDate(new Date())
            } else {
                refer.current?.setEndDate(date_to)
            }
        }
    }, [date_to])

    useEffect(() => {
        let str:string = ""
        if(!dateTo && !dateFrom) setCalendar("")
        else{

            if(dateFrom){
                str += dateFrom + " - "
            }else{
                str += "null - "
            }
            if(dateTo){
                str += dateTo
            }else{
                str += "null"
            }
            setCalendar(str)
        }
    }, [dateTo, dateFrom])

    const format = useMemo(() => {
        return lang == "vi" ? "DD/MM/YYYY" : "MM/DD/YYYY"
    }, [lang])
    return (
        <>
            <div className="card mb-7">
                <div className="card-body">
                    <div className="position-relative w-100 me-md-2">
                        <span className="svg-icon svg-icon-3 svg-icon-gray-500 position-absolute top-50 translate-middle ms-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="black"></rect>
                                <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="black"></path>
                            </svg>
                        </span>
                        <input type="text" className="form-control ps-10" name="search" defaultValue={keyword?String(keyword):''} placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_SEARCH'})} onChange={(e:any) => setKeyword(e.target.value)} onKeyPress={(e) => {
                            if(e.code == "Enter"){
                                // TODO: Submit
                                submitSearchHandler({
                                    search_query: keyword,
                                    product_code: productCode,
                                    product_id: productId,
                                    seller_skus: sellerSkus,
                                    price_from: priceFrom,
                                    price_to: priceTo,
                                    category_id: category,
                                    brand_id: brand,
                                    date_from: date_from,
                                    date_to: date_to,
                                });
                            }
                        }}/>
                    </div>
                    <div className={`collapse ${show? 'show' : ''}`} id="kt_advanced_search_form">
                        <div className="row ">
                            {/*<div className="col-12 mt-3">*/}
                            {/*    <label className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.PRODUCT_CODE'})}</label>*/}
                            {/*    <input type="text" className="form-control form-control " name="product_code" placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_CODE'})} onChange={*/}
                            {/*        (e:any) => {*/}
                            {/*            setProductCode(e.target.value)*/}
                            {/*        }*/}
                            {/*    }/>*/}
                            {/*</div>*/}
                            {/*<div className="col-xl-4">*/}
                            {/*    <label className="fs-6 form-label fw-bolder text-dark">Product ID</label>*/}
                            {/*        <input type="text" className="form-control form-control " name="product_id" placeholder={intl.formatMessage({id: 'PRODUCT.PRODUCT_ID'})} onChange={*/}
                            {/*            (e:any) => {*/}
                            {/*                setProductId(e.target.value)*/}
                            {/*            }*/}
                            {/*        }/>*/}
                            {/*</div>*/}
                            {
                                !isSearchTemporaries &&
                                <div className="col-12 mt-3 ">

                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}</label>
                                    <input type="text"
                                           className="form-control form-control "
                                           name="seller_skus"
                                           defaultValue={sellerSkus}
                                           placeholder={intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}
                                           onChange={
                                               (e: any) => {
                                                   setSellerSkus(e.target.value)
                                               }
                                           } onKeyPress={(e) => {
                                        if (e.code == "Enter") {
                                            // TODO: Submit
                                            submitSearchHandler({
                                                search_query: keyword,
                                                product_code: productCode,
                                                product_id: productId,
                                                seller_skus: sellerSkus,
                                                price_from: priceFrom,
                                                price_to: priceTo,
                                                category_id: category,
                                                brand_id: brand
                                            });
                                        }
                                    }}/>
                                </div>
                            }
                        </div>
                        <div className="row ">
                            {
                                !isSearchTemporaries &&
                            <div className="col-12 mt-3">
                                <label className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.CATEGORY'})}</label>
                                <SelectProductCategory defaultValue={category} handleSelect={handleSelectCategory}/>
                            </div>
                            }
                            {
                                !isSearchTemporaries &&
                                <div className="col-12 mt-3">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.BRAND'})}</label>
                                    <SelectProductBrand defaultValue={brand} handleSelect={handleSelectBrand}/>
                                </div>
                            }
                            {
                                !isSearchTemporaries &&
                                <div className="col-12 mt-3">
                                <label className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.PRICE_FROM'})}</label>
                                <input type="text" className="form-control form-control " name="price_from" placeholder={intl.formatMessage({id: 'PRODUCT.PRICE_FROM'})} onChange={
                                    (e:any) => {
                                        setPriceFrom(e.target.value)
                                    }
                                }
                                       defaultValue={isNaN(priceFrom as number)?'':priceFrom}
                                       onKeyPress={(e) => {
                                           if(e.code == "Enter"){
                                               // TODO: Submit
                                               submitSearchHandler({
                                                   search_query: keyword,
                                                   product_code: productCode,
                                                   product_id: productId,
                                                   seller_skus: sellerSkus,
                                                   price_from: priceFrom,
                                                   price_to: priceTo,
                                                   category_id: category,
                                                   brand_id: brand
                                               });
                                           }
                                       }}
                                />
                            </div>
                            }
                            {
                                !isSearchTemporaries &&
                                <div className="col-12 mt-3">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.PRICE_TO'})}</label>
                                    <input type="text" className="form-control form-control" name="price_to"
                                           placeholder={intl.formatMessage({id: 'PRODUCT.PRICE_TO'})} onChange={
                                        (e: any) => {
                                            setPriceTo(e.target.value)
                                        }
                                    }
                                           defaultValue={isNaN(priceTo as number) ? '' : priceTo}
                                           onKeyPress={(e) => {
                                               if (e.code == "Enter") {
                                                   // TODO: Submit
                                                   submitSearchHandler({
                                                       search_query: keyword,
                                                       product_code: productCode,
                                                       product_id: productId,
                                                       seller_skus: sellerSkus,
                                                       price_from: priceFrom,
                                                       price_to: priceTo,
                                                       category_id: category,
                                                       brand_id: brand
                                                   });
                                               }
                                           }}
                                    />
                                </div>
                            }
                            {
                                isSearchTemporaries &&
                                <div className="col-12 mt-3 DateRangePicker">
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'LANGUAGE.DATE_SUBMITTED'})}</label>
                                    <DateRangePicker
                                        initialSettings={{
                                            autoUpdateInput: false,
                                            locale: {
                                                format: format,
                                                cancelLabel: 'Clear'
                                            },
                                        }}
                                        ref={refer}
                                        onApply={(event: any, picker: DateRangePicker) => {
                                            // @ts-ignore
                                            setDateFrom(picker?.startDate?.format(format))
                                            // @ts-ignore
                                            setDateTo(picker?.endDate?.format(format))
                                        }}
                                        onCancel={(event: any, picker: DateRangePicker) => {
                                            setDateFrom(null)
                                            setDateTo(null)
                                            picker.setStartDate(new Date())
                                            picker.setEndDate(new Date())
                                        }}
                                    >
                                        <input className="form-control"
                                               name="date_time"
                                               placeholder={intl.formatMessage({id: 'LANGUAGE.SELECT_DATE'})}
                                               id="kt_datepicker_1"
                                               autoComplete={"off"}
                                               defaultValue={calendar}
                                        />
                                    </DateRangePicker>
                                </div>

                            }

                        </div>
                    </div>
                    <button className="btn btn-sm btn-primary me-5 fs-7 w-100 mt-3" onClick={()=> {
                        submitSearchHandler({
                            search_query: keyword,
                            product_code: productCode,
                            product_id: productId,
                            seller_skus: sellerSkus,
                            price_from: priceFrom,
                            price_to: priceTo,
                            category_id: category,
                            brand_id: brand,
                            date_from: date_from,
                            date_to: date_to,
                        });
                    }}>{intl.formatMessage({id: 'ECOMMERCE.COMMON.SEARCH'})}</button>
                    {!simple && <Button className='fs-7 d-lg-none' variant={"link"} onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        if(show){
                            e.currentTarget.innerHTML = intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})
                        }else{
                            e.currentTarget.innerHTML = intl.formatMessage({id: 'LANGUAGE.CLOSE_ADVANCED_SEARCH'})
                        }
                        setShow(!show)
                    }}>{intl.formatMessage({id: 'LANGUAGE.ADVANCED_SEARCH'})}</Button>}
                </div>
            </div>
        </>
    );
}

export {ProductSearch}
