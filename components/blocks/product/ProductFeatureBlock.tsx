import React, {useCallback, useEffect, useMemo, useState} from "react";
import axios from "axios";
import Select from "react-select";
import {useDispatch, useSelector} from "react-redux";
import allActions from "../../../redux/actions";
import {ReducerInterFace} from "../../../redux/reducers";
import {genVariantCode} from "../../../utils/string";
import {Obj} from "../../../utils/types";
import {useIntl} from "react-intl";
import {fnCurrentApiUrl} from "../../../utils/url";
import _ from "lodash"

const customStyles = {
    control: () => ({
        height: 40,
        display: 'flex',
        border: '1px solid #e4e6ef',
        borderRadius: '0.475rem',
        boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 8%)',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    }),
}
type propsProductFeature = {
    featureList: any
}

type featureType = {
    feature_id: string,
    description: string,
    full_description: string,
    // variants: { [key: string]: any },
    variants: any,
    feature_type: string,
    feature_style: string,
    display_on_product: string,
    purpose: string,
    feature_unit_code: string
}

const ProductFeatureBlock: (props: propsProductFeature) => JSX.Element = (props: propsProductFeature) => {
    const {featureList} = {...props}
    const intl = useIntl()

    const [selected, setSelected] = useState<Obj>({})
    const [curentFeatureList, setCurentFeatureList] = useState<string[]>([])
    const [truncate, setTruncate] = useState('d-none')
    const dispatch = useDispatch()
    const [featureForm, setFeatureForm] = useState([])
    const features = useSelector((state: ReducerInterFace) => state.products.features)
    let featureFormData = {...features}
    const handleTruncate = () => {
        setTruncate(truncate ? '' : 'd-none')
    }
    useEffect(() => {
        let _featureForm: any = []
        let count = 1
        Object.keys(featureList).forEach(f => {
            if ((featureList[`${f}`] != 'T' && !_.isEmpty(fieldsData[`${featureList[`${f}`].feature_id}`]))) {
                _featureForm.push(
                    genFeatureField({...featureList[`${f}`]}, count)
                );
                count++
            }
        })
        if (count > 10) {
            _featureForm.push(
                <button key={genVariantCode()} className={'btn btn-link'} onClick={handleTruncate}>
                    {!truncate ? intl.formatMessage({id: 'LANGUAGE.SHOW_LESS'}) : intl.formatMessage({id: 'LANGUAGE.SHOW_MORE'})}
                </button>
            );
        }
        setFeatureForm(_featureForm)
    }, [features, selected])

    // Mapping Feature Variant ready to use w Select-2
    const mappingFeatureVariant = useCallback((variants: any) => {
        let options: { value: any; label: any; }[] = []
        if (variants) {
            Object.keys(variants).forEach((v: any) => {
                options.push({'value': variants[v].variant_id, 'label': variants[v].variant})
            })
        }
        return options;
    }, [])

    const fieldsData = useMemo(() => {
        let fieldData: Obj = []
        Object.keys(featureList).forEach(f => {
            fieldData[f] = mappingFeatureVariant(featureList[f].variants)
        })
        return fieldData
    }, [featureList])

    const genFeatureField = (props: featureType, index: number) => {
        if ((props.display_on_product == 'Y' || props.display_on_product == 'N') &&
            (props.purpose != 'group_catalog_item' && props.purpose != 'group_variation_catalog_item')) {
            // props.feature_unit_code ? console.log('props.feature_unit_code',props.feature_unit_code ):''
            switch (props.feature_type) {
                case 'T':
                    return (<div className={`col-12 col-xl-6  mb-5 ${index <= 10 ? '' : truncate}`}
                                 key={`feature-${genVariantCode()}`}>
                        <label
                            className="fs-6 form-label fw-bolder text-dark ">{props.description} {props.feature_unit_code ? `(` + props?.feature_unit_code + `)` : ``}</label>
                        <input type="text" required={true} className="form-control form-control custom-form-control"
                               name=""
                               placeholder={props.description}
                               onBlur={
                                   (e: any) => {
                                       dispatch(allActions.products.features(featureFormData))
                                   }
                               }
                               defaultValue={features[`${props.feature_id}`]}
                               onChange={
                                   (e: any) => {
                                       featureFormData[`${props.feature_id}`] = featureFormData[`${props.feature_id}`] ?? {}
                                       featureFormData[`${props.feature_id}`]['value'] = e.target.value
                                   }
                               }/>
                    </div>)
                default: {
                    if (props.variants) {
                        switch (props.feature_style) {
                            case 'multiple_checkbox':
                                return (<div className={`col-12 col-xl-6 mb-5 ${index <= 10 ? '' : truncate}`}
                                             key={`feature-${genVariantCode()}`}>
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">  {props?.description} {props?.feature_unit_code ? `(` + props?.feature_unit_code + `)` : ``}</label>
                                    {/*<small>{props.full_description}</small>*/}
                                    <Select options={fieldsData[`${props.feature_id}`]}
                                            isMulti isClearable styles={customStyles}
                                            defaultValue={selected[`${props.feature_id}`]}
                                            onChange={(selectedOptions: any) => {
                                                featureFormData[`${props.feature_id}`] = featureFormData[`${props.feature_id}`] ?? {}
                                                featureFormData[`${props.feature_id}`]['variant_ids'] = []
                                                let _selected = {...selected}
                                                _selected[props.feature_id] = []
                                                selectedOptions.map((selectedOption: Obj) => {
                                                    featureFormData[`${props.feature_id}`]['variant_ids'].push(selectedOption.value)
                                                    _selected[props.feature_id].push(
                                                        {
                                                            value: selectedOption.value,
                                                            label: selectedOption.label
                                                        }
                                                    )
                                                })
                                                setSelected(_selected)
                                                dispatch(allActions.products.features(featureFormData))
                                            }
                                            }
                                    />
                                </div>)
                            default:
                                return (<div className={`col-12 col-xl-6 mb-5 ${index <= 10 ? '' : truncate}`}
                                             key={`feature-${genVariantCode()}`}>
                                    <label
                                        className="fs-6 form-label fw-bolder text-dark">  {props?.description} {props?.feature_unit_code ? `(` + props?.feature_unit_code + `)` : ``}</label>
                                    {/*<small>{props.full_description}</small>*/}
                                    <Select options={fieldsData[`${props.feature_id}`]}
                                            isClearable
                                            styles={customStyles}
                                            defaultValue={selected[props.feature_id]}
                                            onChange={(e: any) => {
                                                featureFormData[`${props.feature_id}`] = featureFormData[`${props.feature_id}`] ?? {}
                                                featureFormData[`${props.feature_id}`]['variant_ids'] = featureFormData[`${props.feature_id}`]['variant_ids'] ?? []
                                                let _selected = {...selected}
                                                if (!_.isNil(e)) {
                                                    featureFormData[`${props.feature_id}`]['variant_ids'] = [e.value]
                                                    _selected[props.feature_id] = {
                                                        value: e.value,
                                                        label: props.variants[e.value].variant
                                                    }
                                                } else {
                                                    featureFormData[`${props.feature_id}`]['variant_ids'] = []
                                                    _selected[props.feature_id] = null

                                                }
                                                setSelected(_selected)
                                                dispatch(allActions.products.features(featureFormData))
                                            }
                                            }/>
                                </div>)
                        }
                    } else {
                        return (<div className={`col-12 col-xl-6  mb-5 ${index <= 10 ? '' : truncate} `}
                                     key={`feature-${genVariantCode()}`}>
                            <label
                                className="fs-6 form-label fw-bolder text-dark">  {props.description} {props?.feature_unit_code ? `(` + props?.feature_unit_code + `)` : ``}</label>
                            {/*<small>{props.full_description}</small>*/}
                        </div>)
                    }
                }
            }
        }
    }

    useEffect(() => {
        let _featureForm: any = []
        let count = 1

        Object.keys(featureList).forEach(f => {
            if ((featureList[`${f}`] != 'T' && !_.isEmpty(fieldsData[`${featureList[`${f}`].feature_id}`]))) {
                _featureForm.push(
                    genFeatureField({...featureList[`${f}`]}, count)
                );
                count++
            }
        })
        if (count > 10) {
            _featureForm.push(
                <button className={'btn btn-link'} key={genVariantCode()} onClick={handleTruncate}>
                    {!truncate ? intl.formatMessage({id: 'LANGUAGE.SHOW_LESS'}) : intl.formatMessage({id: 'LANGUAGE.SHOW_MORE'})}
                </button>
            );
        }
        setFeatureForm(_featureForm)

    }, [featureList, truncate, selected])


    useEffect(() => {
        let _featureSelected: Obj = {}
        if (String(typeof (features)) == 'object') {
            if (Object.keys(features).length > 0 && Object.keys(featureList).length > 0) {
                Object.keys(features).map(_feature_id => {
                    if (typeof (featureList[_feature_id]) != undefined && !_.isNil(features[_feature_id]?.variant_ids)) {
                        if (features[_feature_id]?.variant_ids?.length == 1) {
                            _featureSelected[_feature_id] = {
                                "label": featureList[_feature_id]?.variants[`${features[_feature_id].variant_ids[0]}`]?.variant,
                                "value": features[_feature_id].variant_ids[0]
                            }
                        } else if (features[_feature_id]?.variant_ids?.length > 1) {
                            _featureSelected[_feature_id] = []
                            features[_feature_id].variant_ids.map((variant_id: string, index: number) => {
                                _featureSelected[_feature_id].push(
                                    {
                                        "label": featureList[_feature_id]?.variants[`${features[_feature_id].variant_ids[index]}`]?.variant,
                                        "value": features[_feature_id].variant_ids[index]
                                    }
                                )
                            })

                        }
                    }
                })
            }
        }
        setSelected(_featureSelected)
    }, [featureList])

    return (
        <div className={'row'} key={`product-feature-${genVariantCode()}`}>
            {featureForm}
        </div>
    )
}

export {ProductFeatureBlock}
