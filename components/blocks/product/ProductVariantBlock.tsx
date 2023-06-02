import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import {Button, FormCheck, FormControl, InputGroup, Table} from "react-bootstrap";
import allActions from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {VariantGroup} from "../../../utils/type/Product/Variant.type";
import {ReducerInterFace} from "../../../redux/reducers";
import {genVariantCode} from "../../../utils/string";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Obj} from "../../../utils/types";
import _ from "lodash"
import {useIntl} from "react-intl";
import {fnFormatNumber} from "../../../utils/number";


type propsProductVariant = {
    defaultVariations ?: any,
    defaultVariationsGroup?: any
}


const ProductVariantBlock: (props: propsProductVariant) => JSX.Element = (props: propsProductVariant) => {

    // component config
    const isDragDisabled:boolean = true; //FIXME: Variant table không gen lại bị empty khi drag-n-drop
    const variantGroupAllowed = 2;
    const variantGroupItemLimit = 10;

    const {defaultVariations,defaultVariationsGroup } = {...props}
    const dispatch = useDispatch()
    const intl = useIntl()

    // VariantGroup
    const status = useSelector((state: ReducerInterFace) => state.products?.status) == 'A' ? true : false
    const price = useSelector((state: ReducerInterFace) => state.products?.price) ?? ''
    const sku = useSelector((state: ReducerInterFace) => state.products?.sku) ?? ''
    const list_price = useSelector((state: ReducerInterFace) => state.products?.list_price) ?? ''
    const amount = useSelector((state: ReducerInterFace) => state.products?.amount) ?? ''

    const variations = useSelector((state: ReducerInterFace) => state.products?.variations)
    let variantGroupData = useMemo(() => {
        //State cho các LOẠI BIẾN THỂ của sản phẩm
        return variations ? [...variations] : []
    }, [variations])

    const refreshVariantGroup = () => {
        dispatch(allActions.products.variations(variantGroupData))
    }

    // TABLE
    // const variation_groups: Obj = useSelector((state: ReducerInterFace) => state.products.variation_groups)

    useEffect(() => {
        if (!_.isEmpty(variations)) {
            if (status) {
                dispatch(allActions.products.status('D'))
            }

            if (price) {
                dispatch(allActions.products.price(''))
            }
            if (list_price) {
                dispatch(allActions.products.list_price(''))
            }
            if (sku) {
                dispatch(allActions.products.sku(''))
            }
            if (amount) {
                dispatch(allActions.products.amount(''))
            }
        }
    }, [variations])

    const [variationGroupData, setVariationGroupData] = useState<Obj>({}) // state cho CÁC BIẾN THỂ của sản phẩm

    useEffect(()=>{
        setVariationGroupData(defaultVariationsGroup)
    },[defaultVariationsGroup])

    const saveVariationGroupToState = () => {
        dispatch(allActions.products.variation_groups(variationGroupData))
    }

    // const [currentCodeA, setCurrentCodeA] = useState('')
    // const [currentCodeB, setCurrentCodeB] = useState('')
    // const [currentKey, setCurrentKey] = useState('')
    // const [currentValue, setCurrentValue] = useState('')

    // VariantTable
    const inti_t_head = useMemo(() => [
        (<th key={4} scope="col">{intl.formatMessage({id: 'LANGUAGE.PRICE'})}</th>),
        (<th key={5} scope="col">{intl.formatMessage({id: 'PRODUCT.LIST_PRICE'})}</th>),
        (<th key={6} scope="col">{intl.formatMessage({id: 'LANGUAGE.PRODUCT_AMOUNT'})}
        </th>),
        (<th key={7} scope="col">{intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}
        </th>),
        (<th key={8} scope="col">{intl.formatMessage({id: 'LANGUAGE.SHOW'})}
        </th>)
    ], [])

    const update = (codeA: string, codeB: string, key: string, value: any) => {
        if ( !_.isEmpty(codeA)) {
            let _variationGroupData = variationGroupData
            if(_.isEmpty(_variationGroupData )){
                _variationGroupData = {}
            }
            if (!(codeA in _variationGroupData)) {
                _variationGroupData[codeA] = {}
            }

            if (!_.isEmpty(codeB) ) {

                if (!(key in _variationGroupData[codeA])) {
                    // delete _variationGroupData[codeA][key]
                }
                if (!("variations" in _variationGroupData[codeA])) {
                    _variationGroupData[codeA].variations = {}
                }
                if (!(codeB in _variationGroupData[codeA].variations)) {
                    _variationGroupData[codeA].variations[codeB] = {}
                }
                _variationGroupData[codeA].variations[codeB] = {
                    ..._variationGroupData[codeA].variations[codeB],
                    [key]: value
                }

            } else {

                if (codeA == undefined) {
                    _variationGroupData[codeA] = {}
                }

                _variationGroupData[codeA][key] = value
            }
            setVariationGroupData(_variationGroupData)
        }
    }
    const handleChangeVariationGroupData = (codeA: string, codeB: string, key: string, value: any) => {
        if (!codeA && !codeB) {
            switch (key) {
                case 'price':
                    dispatch(allActions.products.price(value))
                    break;
                case 'sku':
                    dispatch(allActions.products.sku(value))
                    break;
                case 'amount':
                    dispatch(allActions.products.amount(value))
                    break;
                case 'status':
                    dispatch(allActions.products.status(value))
                    break;
                case 'list_price':
                    dispatch(allActions.products.list_price(value))
                    break;
                default:
                    break;
            }
        } else {
            update(codeA, codeB, key, value)
        }

    }

    // useEffect(() => {
    //     handleChangeVariationGroupData(currentCodeA, currentCodeB, currentKey, currentValue)
    // }, [currentCodeA, currentCodeB, currentKey, currentValue])

    const init_t_row_cols = (codeA = '', codeB = '') => {
        let _key = genVariantCode()

        let _price = ''
        let _list_price = ''
        let _sku = ''
        let _amount = ''
        let _status = 'D'

        if(!_.isNil(variationGroupData)){
            if(!_.isEmpty(codeA) && !_.isNil(variationGroupData[codeA])){
                if(!_.isEmpty(codeB) && !_.isNil(variationGroupData[codeA].variations) && !_.isNil(variationGroupData[codeA].variations[codeB])){
                    _price = variationGroupData[codeA].variations[codeB].hasOwnProperty('price') ?
                        variationGroupData[codeA].variations[codeB].price : ''

                    _list_price = variationGroupData[codeA].variations[codeB].hasOwnProperty('list_price') ?
                        variationGroupData[codeA].variations[codeB].list_price : ''

                    _sku = variationGroupData[codeA].variations[codeB].hasOwnProperty('sku') ?
                        variationGroupData[codeA].variations[codeB].sku : ''

                    _amount = variationGroupData[codeA].variations[codeB].hasOwnProperty('amount') ?
                        variationGroupData[codeA].variations[codeB].amount : ''

                    _status = variationGroupData[codeA].variations[codeB].hasOwnProperty('status') ?
                        variationGroupData[codeA].variations[codeB].status : 'D'

                } else {
                    _price = variationGroupData[codeA].hasOwnProperty('price') ?
                        variationGroupData[codeA].price : ''

                    _list_price = variationGroupData[codeA].hasOwnProperty('list_price') ?
                        variationGroupData[codeA].list_price : ''

                    _sku = variationGroupData[codeA].hasOwnProperty('sku') ?
                        variationGroupData[codeA].sku : ''

                    _amount = variationGroupData[codeA].hasOwnProperty('amount') ?
                        variationGroupData[codeA].amount : ''

                    _status = variationGroupData[codeA].hasOwnProperty('status') ?
                        variationGroupData[codeA].status : 'D'

                }
            } else {
                if(!_.isNil(price)){
                    _price = price
                }
                if(!_.isNil(list_price)){
                    _list_price = list_price
                }
                if(!_.isNil(sku)){
                    _sku = sku
                }
                if(!_.isNil(amount)){
                    _amount = amount
                }
                if (!_.isNil(status)) {
                    _status = status ? 'A' : 'D'
                }
            }
        } else {
            if(!_.isNil(price)){
                _price = price
            }
            if(!_.isNil(list_price)){
                _list_price = list_price
            }
            if(!_.isNil(sku)){
                _sku = sku
            }
            if(!_.isNil(amount)){
                _amount = amount
            }
            if (!_.isNil(status)) {
                _status = status ? 'A' : 'D'
            }
        }

        return [
            (<td key={`price-${_key}`}>
                <InputGroup size="sm">
                    <FormControl
                        type={'number'} min={0}
                        placeholder={intl.formatMessage({id: 'LANGUAGE.PRICE'})}
                        defaultValue={_price ? (parseFloat(_price)) : ''}
                        aria-describedby="label-product-variant-PRICE"
                        onChange={
                            (e:any) => {
                                handleChangeVariationGroupData(codeA, codeB, 'price', (e.target.value))

                            }
                        }
                    />
                    <InputGroup.Text id={`label-product-variant-PRICE`}>đ</InputGroup.Text>
                </InputGroup>
            </td>),
            (<td key={`list-price-${_key}`}>

                <InputGroup size="sm">
                    <FormControl
                        type={'number'} min={0}
                        placeholder={intl.formatMessage({id: 'PRODUCT.LIST_PRICE'})}
                        defaultValue={_list_price ? (parseFloat(_list_price)) : ''}
                        aria-describedby="label-product-variant-LIST_PRICE"
                        onChange={
                            (e: any) => {
                                handleChangeVariationGroupData(codeA, codeB, 'list_price', (e.target.value))

                            }
                        }
                    />
                    <InputGroup.Text id={`label-product-variant-LIST_PRICE`}>đ</InputGroup.Text>
                </InputGroup>
            </td>),
            (<td key={`amount-${_key}`}>
                <input type="number" required={true} className="form-control form-control" name=""
                       placeholder={intl.formatMessage({id: 'LANGUAGE.PRODUCT_AMOUNT'})}
                       defaultValue={_amount ? parseInt(_amount) : ''}
                       onChange={
                           (e: any) => {
                               handleChangeVariationGroupData(codeA, codeB, 'amount', e.target.value)

                           }
                       }/>
            </td>),
            (<td key={`sku-${_key}`}>
                <input type="text" required={true} className="form-control form-control" name=""
                       placeholder={intl.formatMessage({id: 'LANGUAGE.PRODUCT_SSKU'})}
                       defaultValue={_sku}
                       onChange={
                           (e: any) => {
                               handleChangeVariationGroupData(codeA, codeB, 'sku', e.target.value)

                           }
                       }/>
            </td>),
            (<td key={`available-${_key}`}>
                <FormCheck type={'switch'}
                           defaultChecked={_status == 'A'}
                           onChange={
                               (e: ChangeEvent<HTMLInputElement>) => {
                                   const checked = e.target.checked ? 'A' : 'D'
                                   handleChangeVariationGroupData(codeA, codeB, 'status', checked)

                               }
                           }/>
            </td>)]
    }

    const init_t_row = (<tr key={String(Math.floor(Math.random() * 1000))}>{init_t_row_cols()}</tr>)


    const [theadValue, setTheadValue] = useState<JSX.Element[]>(inti_t_head)
    const [tbodyValue, setTbodyValue] = useState<JSX.Element>(init_t_row)


    // useEffect(() => {s
    useEffect(() => {
        if (variantGroupData[0]?.name) {
            let _t_head = [...inti_t_head]
            let _t_rows: any = []

            //Generate Header
            if (variantGroupData[1]?.name) {
                _t_head = [
                    (<th key={2} scope="col">{variantGroupData[1].name}</th>),
                    ..._t_head]
            }
            _t_head = [
                (<th key={1} scope="col">{variantGroupData[0].name}</th>),
                ..._t_head]

            //Generate Body
            for (let index_row = 0; index_row < variantGroupData[0].variants.length; index_row++) {
                let _t_cols = []
                let rowSpan = 1
                if (variantGroupData[1]?.name) {
                    for (let index_col = 0; index_col < variantGroupData[1].variants.length; index_col++) {
                        rowSpan = variantGroupData[1]?.variants.length
                        _t_cols = [
                            (<td className={'p-2 text-center'}
                                 key={genVariantCode()}>{variantGroupData[1].variants[index_col].name ?? ''} </td>),
                            ...init_t_row_cols(variantGroupData[0].variants[index_row].code, variantGroupData[1].variants[index_col].code)]
                        if (index_col == 0) {
                            _t_cols = [(
                                <td key={genVariantCode()} className={'p-2 text-center'}
                                    rowSpan={rowSpan}>{variantGroupData[0].variants[index_row].name ?? ''}</td>),
                                ..._t_cols]
                        }
                        let _t_row = (<tr key={genVariantCode()}>
                            {_t_cols}
                        </tr>)
                        _t_rows.push(_t_row)
                    }

                } else {
                    _t_cols = [
                        ...init_t_row_cols(variantGroupData[0]?.variants[index_row]?.code), null]
                    _t_cols = [(
                        <td key={genVariantCode()}
                            rowSpan={rowSpan}
                            className={'p-2 text-center'}>{variantGroupData[0].variants[index_row].name}</td>),
                        ..._t_cols]
                    let _t_row = (<tr key={genVariantCode()}>
                        {_t_cols}
                    </tr>)

                    _t_rows.push(_t_row)
                }
            }
            setTheadValue(_t_head)
            setTbodyValue(_t_rows)

        } else {
            setTheadValue(inti_t_head)
            setTbodyValue(init_t_row)
        }
    }, [variations, variationGroupData, status, price, list_price, sku])

    // Variant Group Block
    const blockVariantGroup = () => {
        return variantGroupData?.map((variantItem: VariantGroup, index: number) => {
            const handleChangeGroupName = (name: string) => {
                variantGroupData[index].name = name
            }

            const handleChangeItem = (index: number, item_index: number | null, code: string, name: string, refresh: boolean = false) => {
                if (item_index != null) {
                    variantGroupData[index].variants[item_index].code = code
                    variantGroupData[index].variants[item_index].name = name
                } else {
                    variantGroupData[index].variants.push({code: code, name: name})
                }

                if (refresh) {
                    dispatch(allActions.products.variations(variantGroupData))
                }
            }

            const handleOnDragEnd = (result: any) => {
                if (!result.destination) return;
                const items = Array.from(variantItem?.variants);
                const [reorderedItem] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, reorderedItem);
                variantItem.variants = items
                dispatch(allActions.products.variations(variantGroupData))
                dispatch(allActions.products.variation_groups([]))

            }

            const handleDeleteVariant = (index: number, item_index: number) => {
                variantGroupData[index].variants.splice(item_index, 1)
                dispatch(allActions.products.variations(variantGroupData))
                dispatch(allActions.products.variation_groups([]))
            }

            return (
                <div key={`VariationsGroup-${genVariantCode()}-${index}`}
                     className={' p-5 bg-light mt-5 mb-5 rounded border-1'}>
                    <div className={'d-flex justify-content-between'}>
                        <h3>
                            {intl.formatMessage({id: 'PRODUCT.VARIANT_GROUP'})} {index + 1}
                        </h3>
                        <a onClick={e => {
                            variantGroupData.splice(index, 1)
                            dispatch(allActions.products.variations(variantGroupData))
                            dispatch(allActions.products.variation_groups([]))

                        }}>
                            <span
                                className="svg-icon svg-icon-3">
                                <svg width="24" height="24" viewBox="0 0 24 24"
                                     fill="none" xmlns="http://www.w3.org/2000/svg"
                                     className="mh-50px">
                                    <path
                                        d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                                        fill="black"/>
                                    <path opacity="0.5"
                                          d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                                          fill="black">

                                    </path>
                                    <path opacity="0.5"
                                          d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                                          fill="black">
                                    </path>
                                </svg>
                            </span>
                        </a>
                    </div>
                    <div className="row p-8">
                        <label className="fs-6 form-label fw-bolder text-dark"><span
                            className="text-danger">* </span>{intl.formatMessage({id: 'LANGUAGE.NAME'})}</label>
                        <input type="text" required={true} className="form-control form-control"
                               name="variant_group_name"
                               placeholder={intl.formatMessage({id: 'PRODUCT.VARIANT_GROUP_NAME'})}
                               defaultValue={variantItem?.name ?? ""}
                               onBlur={refreshVariantGroup}
                               onKeyUp={
                                   (e: any) => {
                                       handleChangeGroupName(e.target.value)
                                   }
                               }/>
                    </div>

                    <div className={' bg-white p-5 mt-5 mb-5 rounded border-1'}>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="variants">
                                {(provided) => (
                                    <div className="variants " {...provided.droppableProps}
                                         ref={provided.innerRef}>
                                        {variantItem?.variants?.length > 0 ? variantItem?.variants?.map((v, item_index) => {
                                            return (
                                                <Draggable isDragDisabled={isDragDisabled}  key={`${item_index}-${v["code"]}`} draggableId={v["code"]}
                                                           index={item_index}>
                                                    {(provided) => (
                                                        <div className={'row m-2 p-1'}
                                                             ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <div className={'col-11'}>
                                                                <input type="text" required={true}
                                                                       className="form-control form-control"
                                                                       name={intl.formatMessage({id: 'PRODUCT.VARIANT_NAME'})}
                                                                       defaultValue={v["name"]}
                                                                       placeholder={intl.formatMessage({id: 'LANGUAGE.PLEASE_SELECT_OR_FILL_IN'})}
                                                                       onBlur={refreshVariantGroup}
                                                                       onChange={
                                                                           (e: any) => {
                                                                               handleChangeItem(index, item_index, v["code"], e.target.value)
                                                                           }
                                                                       }/>
                                                            </div>
                                                            <div
                                                                className={'col-1 d-flex justify-content-around align-items-center '}>
                                                                <a onClick={e => {
                                                                    handleDeleteVariant(index, item_index)
                                                                }}>
                                                                    <span
                                                                        className="svg-icon svg-icon-3">
                                                                        <svg width="24" height="24" viewBox="0 0 24 24"
                                                                             fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                             className="mh-50px">
                                                                            <path
                                                                                d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                                                                                fill="black"/>
                                                                            <path opacity="0.5"
                                                                                  d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                                                                                  fill="black">

                                                                            </path>
                                                                            <path opacity="0.5"
                                                                                  d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                                                                                  fill="black">
                                                                            </path>
                                                                        </svg>
                                                                    </span>
                                                                </a>
                                                                <span className="svg-icon svg-icon-3">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                                                         width="30" height="30"
                                                                         viewBox="0 0 30 30"
                                                                         style={{fill: '#a1a5b7'}}><path
                                                                        d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"/></svg>
                                                                </span>

                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        }) : ''}
                                        {provided.placeholder}
                                        <div className={'row p-8'}>
                                            <Button className={'m-1 btn-sm'}
                                                    onClick={(e) => {
                                                        let _id = genVariantCode()
                                                        handleChangeItem(index, null, _id, '', true)
                                                    }}>{intl.formatMessage({id: 'LANGUAGE.ADD'})}</Button>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            )
        })
    }
    return (
        <div>
            {blockVariantGroup()}

            {
                (variantGroupData.length < variantGroupAllowed) ? (<div className={'row p-2 pt-5 pb-5  '}>
                    <Button className={'m-1 btn-sm'}
                            onClick={(e) => {
                                let index = variantGroupData.length
                                if (!variantGroupData[index] && index < variantGroupAllowed) {
                                    variantGroupData[index] = {name: '', variants: [
                                            {code: genVariantCode(), name: ''}
                                        ]}
                                    dispatch(allActions.products.variations(variantGroupData))
                                }
                            }}>{intl.formatMessage({id: 'PRODUCT.VARIANT_GROUP_ADD'})} ({variantGroupData.length} /2
                        )</Button>
                </div>) : ''
            }
            <div className={'pt-5 pb-5'}
                 style={{'overflow': 'scroll'}}
                 onMouseLeave={(e:any) => {
                     saveVariationGroupToState()
                 }}
            >
                <Table className={'table table-dashed align-middle'}
                >
                    <thead>
                    <tr>
                        {theadValue}
                    </tr>
                    </thead>
                    <tbody className={'border-top-0'}>
                    {tbodyValue}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export {ProductVariantBlock}
