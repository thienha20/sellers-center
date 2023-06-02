import React, {ChangeEvent, ForwardedRef, useCallback, useEffect, useState} from "react";
import {Button, Dropdown, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {isMobileDevice} from "../../../utils/metronic/_utils";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import Drawer from "react-modern-drawer";
import {genVariantCode, searchInString} from "../../../utils/string";
import {useIntl} from "react-intl";
import _ from "lodash"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas, faChevronRight, faAngleRight, faSearch} from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare, faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import allActions from "../../../redux/actions";
import {useDispatch} from "react-redux";

library.add( fas, faCheckSquare, faChevronRight, faSquareMinus, faAngleRight, faSearch)
type shipping = {
    length?: number|string,
    width?: number|string,
    height?: number|string,
    weight?: number|string,
}

type propsProductShipping = {
    default_shipping ?: shipping
}
const ProductShippingBlock: (props: propsProductShipping) => JSX.Element = (props: propsProductShipping) => {
    const {default_shipping} = {...props}
    const intl = useIntl()
    const dispatch = useDispatch()

    const [defaultWidth, setDefaultWidth]   = useState<number|string>('')
    const [defaultLength, setDefaultLength] = useState<number|string>('')
    const [defaultHeight, setDefaultHeight] = useState<number|string>('')
    const [defaultWeight, serDefaultWeight] = useState<number|string>('')

    useEffect(()=>{
        console.log('default_shipping',default_shipping, !_.isNil(default_shipping))
        if(!_.isNil(default_shipping)){
            if(_.isEmpty(default_shipping.width)){
                setDefaultWidth(default_shipping.width??'')
            }
            if(_.isEmpty(default_shipping.length)){
                setDefaultLength(default_shipping.length??'')
            }
            if(_.isEmpty(default_shipping.height)){
                setDefaultHeight(default_shipping.height??'')
            }
            if(_.isEmpty(default_shipping.weight)){
                serDefaultWeight(default_shipping.weight??'')
            }
        }
    }, [default_shipping])
    return (
        <div className="card card-flush mt-5">
            <div className="card-body">
                <div className="row mb-5">
                    <h2>5. {intl.formatMessage({id: 'LANGUAGE.SHIPPING'})}</h2>
                    <div className={"col-sm-4 mb-5"}>
                        <label
                            className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.SHIPPING_NOTICE'})}</label>
                        <InputGroup size="sm">
                            <FormControl
                                placeholder={intl.formatMessage({id: 'LANGUAGE.WEIGHT'})}
                                aria-label={intl.formatMessage({id: 'LANGUAGE.WEIGHT'})}
                                defaultValue={defaultWeight}
                                aria-describedby="label-product-shipping-weight"
                                onChange={_.debounce(
                                    (e: ChangeEvent<HTMLInputElement>) => {
                                        e.target.value = e.target.value.replace(/[^\d.,]/g, '') // gives "12,345.50"
                                        dispatch(allActions.products.weight(parseFloat(e.target.value)))
                                    }, 300
                                )}
                            />
                            <InputGroup.Text id={`label-product-shipping-weight`}>kg</InputGroup.Text>
                        </InputGroup>
                    </div>
                    <div className="row mb-5">
                        <label
                            className="fs-6 form-label fw-bolder text-dark">{intl.formatMessage({id: 'PRODUCT.DIMENSION_NOTICE'})}
                        </label>
                        <div className={"col-sm-4 mb-5"}>
                            <InputGroup size="sm">
                                <FormControl
                                    placeholder={intl.formatMessage({id: 'LANGUAGE.LENGTH'})}
                                    aria-label={intl.formatMessage({id: 'LANGUAGE.LENGTH'})}
                                    defaultValue={defaultLength}
                                    aria-describedby="label-product-shipping-length"
                                    onChange={_.debounce(
                                        (e: ChangeEvent<HTMLInputElement>) => {
                                            e.target.value = e.target.value.replace(/[^\d.,]/g, '') // gives "12,345.50"
                                            dispatch(allActions.products.length(parseFloat(e.target.value)))
                                        }, 300
                                    )}
                                />
                                <InputGroup.Text id={`label-product-shipping-length`}>cm</InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div className={"col-sm-4 mb-5"}>
                            <InputGroup size="sm">
                                <FormControl
                                    placeholder={intl.formatMessage({id: 'LANGUAGE.WIDTH'})}
                                    aria-label={intl.formatMessage({id: 'LANGUAGE.WIDTH'})}
                                    defaultValue={defaultWidth}
                                    aria-describedby="label-product-shipping-width"
                                    onChange={_.debounce(
                                        (e: ChangeEvent<HTMLInputElement>) => {
                                            e.target.value = e.target.value.replace(/[^\d.,]/g, '') // gives "12,345.50"
                                            dispatch(allActions.products.width(parseFloat(e.target.value)))
                                        }, 300
                                    )}
                                />
                                <InputGroup.Text id={`label-product-shipping-width`}>cm</InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div className={"col-sm-4 mb-5"}>
                            <InputGroup size="sm">
                                <FormControl
                                    placeholder={intl.formatMessage({id: 'LANGUAGE.HEIGHT'})}
                                    aria-label={intl.formatMessage({id: 'LANGUAGE.HEIGHT'})}
                                    defaultValue={defaultHeight}
                                    aria-describedby="label-product-shipping-height"
                                    onChange={_.debounce(
                                        (e: ChangeEvent<HTMLInputElement>) => {
                                            e.target.value = e.target.value.replace(/[^\d.,]/g, '') // gives "12,345.50"
                                            dispatch(allActions.products.height(parseFloat(e.target.value)))
                                        }, 300
                                    )}
                                />
                                <InputGroup.Text id={`label-product-shipping-height`}>cm</InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export {ProductShippingBlock}
