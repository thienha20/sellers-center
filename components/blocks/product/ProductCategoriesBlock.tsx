import React, {ForwardedRef, useCallback, useEffect, useState} from "react";
import {Button, Dropdown, FormControl, FormGroup} from "react-bootstrap";
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

library.add( fas, faCheckSquare, faChevronRight, faSquareMinus, faAngleRight, faSearch)
type propsSelectProductCategories = {
    categoriesList: any,
    selectedCate?: number,
    selectedHandler: Function,
}
const ProductCategoriesBlock: (props: propsSelectProductCategories) => JSX.Element = (props: propsSelectProductCategories) => {
    const {categoriesList, selectedHandler, selectedCate} = {...props}
    const {height, width} = useWindowDimensions();
    const intl = useIntl()

    const [defaultSelectedCate, setDefaultSelectedCate] = useState(selectedCate)
    const [categories, setCategories] = useState(categoriesList)

    useEffect(() => {
        setDefaultSelectedCate(selectedCate)
    }, [selectedCate])

    useEffect(() => {
        setCategories(categoriesList)
    }, [categoriesList])

    // Commons state
    const [txtSelectedCategories, setTxtSelectedCategories] = useState('')

    //
    const [selectedCateM, setSelectedCateM] = useState('');
    const [componentCateM, setComponentCateM] = useState();

    const [isOpen, setIsOpen] = useState(false)
    const [catePath, setCatePath] = useState('')

    const [componentCateA, setComponentCateA] = useState<any>();
    const [componentCateB, setComponentCateB] = useState<any>();
    const [componentCateC, setComponentCateC] = useState<any>();

    const [selectedCateA, setSelectedCateA] = useState<any>('');
    const [selectedCateB, setSelectedCateB] = useState<any>('');
    const [selectedCateC, setSelectedCateC] = useState<any>('');
    const [value, setValue] = useState<string>('');
    const [valueB, setValueB] = useState<string>('');
    const [valueC, setValueC] = useState<string>('');
    const [valueM, setValueM] = useState<string>('');

    // Custom Dropdown
    const CustomMenu = React.forwardRef<any, ForwardedRef<any>>(
        ({children}, ref) => {
            // @ts-ignore
            return (
                <div
                    className={'show'}
                    aria-labelledby={'aria-labelledby'}
                >
                    <ul className="list-unstyled">
                        {children && React.Children.toArray(children).filter(
                            (child: any) => {
                                // console.log('child',child.props.children)
                                return !value
                                    || (_.isArray(child.props.children)? searchInString(child.props.children[0], value) != -1 : searchInString(child.props.children, value) != -1) // search không dấu
                            }
                        )}
                    </ul>
                </div>
            );
        },
    )
    CustomMenu.displayName = 'CustomSelectCategory'

    const CustomMenuB = React.forwardRef<any, ForwardedRef<any>>(
        ({children}, ref) => {
            // @ts-ignore
            return (
                <div
                    className={'show'}
                    aria-labelledby={'aria-labelledby'}
                >
                    <ul className="list-unstyled">
                        {children && React.Children.toArray(children).filter(
                            (child: any) => {
                                return !valueB
                                    || (_.isArray(child.props.children)? searchInString(child.props.children[0], value) != -1 : searchInString(child.props.children, value) != -1) // search không dấu
                            }
                        )}
                    </ul>
                </div>
            );
        },
    )
    CustomMenuB.displayName = 'CustomSelectCategoryB'

    const CustomMenuC = React.forwardRef<any, ForwardedRef<any>>(
        ({children}, ref) => {
            // @ts-ignore
            return (
                <div
                    className={'show'}
                    aria-labelledby={'aria-labelledby'}
                >
                    <ul className="list-unstyled">
                        {children && React.Children.toArray(children).filter(
                            (child: any) => {
                                return !valueC
                                    || (_.isArray(child.props.children)? searchInString(child.props.children[0], value) != -1 : searchInString(child.props.children, value) != -1) // search không dấu
                            }
                        )}
                    </ul>
                </div>
            );
        },
    )
    CustomMenuC.displayName = 'CustomSelectCategoryC'

    const CustomMenuM = React.forwardRef<any, ForwardedRef<any>>(
        ({children}, ref) => {
            // @ts-ignore
            return (
                <div
                    className={'show'}
                    aria-labelledby={'aria-labelledby'}
                >
                    <ul className="list-unstyled">
                        {children && React.Children.toArray(children).filter(
                            (child: any) => {
                                return !valueM
                                    || searchInString(child.props.children, valueM) != -1 // search không dấu
                            }
                        )}
                    </ul>
                </div>
            );
        },
    )
    CustomMenuM.displayName = 'CustomSelectCategoryM'

    const getSelectedText = useCallback(() => {
        let text = '';
        if (catePath && !_.isNil(categories)) {
            const path = ('' + catePath).split('/')
            const pathLength = path.length - 1
            let _path
            if (pathLength > 0) {
                let i = 0
                _path = categories[`${path[i]}`];
                _path && _path.category ? text += _path.category : text
                do {
                    ++i
                    if (_path) {

                        if (_path.subcategories && _path.subcategories[`${path[i]}`]) {
                            _path = _path.subcategories[`${path[i]}`]
                            _path.category ? text += " \\ " + _path.category : text
                        } else {
                            _path.category ? text += " \\ " + _path.category : text
                        }

                    }

                } while (i < pathLength)

            }

        }
        setTxtSelectedCategories(text)
    }, [catePath, setTxtSelectedCategories, categories])

    useEffect(() => {
        getSelectedText()
        // console.log('categories',categories)
        // console.log('catePath', catePath)
    }, [catePath, getSelectedText, categories])


    // useEffect for Mobile
    useEffect(() => {
        if (categories && isMobileDevice()) {
            let _componentCateM = []

            const addSubCateDropDown = (subcate: any, path: string, text: string) => {
                for (let k in subcate) {
                    _componentCateM.push(
                        <Dropdown.Item
                            key={genVariantCode()}
                            className={'p-3 text-wrap'}
                            eventKey={`${path}/${k}`}
                            active={selectedCateM == subcate[k].category_id ? true : false}
                        >{text + '' + subcate[k].category}</Dropdown.Item>
                    )
                    subcate[k].subcategories ? addSubCateDropDown(subcate[k].subcategories, `${path}/${k}`, text + '' + subcate[k].category + ' > ') : ''

                }
            }

            for (const category in categories) {
                _componentCateM.push(
                    <Dropdown.Item
                        key={genVariantCode()}
                        eventKey={categories[category].category_id}
                        active={selectedCateM == categories[category].category_id ? true : false}
                        className={'p-3 text-wrap'}
                    >{categories[category].category}</Dropdown.Item>
                )

                categories[category].subcategories ? addSubCateDropDown(categories[category].subcategories, categories[category].category_id, categories[category].category + ' > ') : ''
            }
            // @ts-ignore
            setComponentCateM(_componentCateM)
            selectedHandler(selectedCateM)
        }
    }, [categories, selectedCateM])

    useEffect(() => {
        if (categories) {
            let _componentCateA = []
            for (const category in categories) {
                _componentCateA.push(
                    <Dropdown.Item
                        className={'d-flex justify-content-between m-1'}
                        key={genVariantCode()}
                        eventKey={categories[category].category_id}
                        active={selectedCateA == categories[category].category_id}
                    >
                            {categories[category].category} { !_.isNil(categories[category].subcategories) && <FontAwesomeIcon className={'m-1'} icon={['fas', 'chevron-right']} size="xs"/> }

                    </Dropdown.Item>
                )
            }
            // @ts-ignore
            setComponentCateA(_componentCateA)
        }
    }, [categories, selectedCateA])

    // useEffect for Desktop

    useEffect(() => {
        if (selectedCateA) {
            if(_.isEmpty(selectedCateB)){
                selectedHandler(selectedCateA)
                setCatePath(selectedCateA)
            }
            if (categories[`${selectedCateA}`]) {
                if (categories[`${selectedCateA}`].subcategories) {
                    let _categoriesB = []
                    for (let k in categories[`${selectedCateA}`].subcategories) {
                        _categoriesB.push(
                            <Dropdown.Item
                                className={'d-flex justify-content-between m-1'}
                                key={genVariantCode()}
                                eventKey={k}
                                active={selectedCateB == k}
                            >{categories[`${selectedCateA}`].subcategories[k].category}  { !_.isNil(categories[`${selectedCateA}`].subcategories[k].subcategories) && <FontAwesomeIcon size="xs" className={'m-1'} icon={['fas', 'chevron-right']}/> }</Dropdown.Item>
                        )
                    }
                    // console.log(' component _categoriesB',_categoriesB)
                    setComponentCateB(_categoriesB)
                }
            }
        }

    }, [categories,selectedCateA, selectedCateB])

    useEffect(() => {
        setCatePath(selectedCateA + '/' + selectedCateB)
        if (selectedCateB)
            if (categories[`${selectedCateA}`]?.subcategories[`${selectedCateB}`]) {
                selectedHandler(categories[`${selectedCateA}`].subcategories[`${selectedCateB}`].category_id)
                let _categoriesC = []
                for (let k in categories[`${selectedCateA}`].subcategories[`${selectedCateB}`].subcategories) {
                    _categoriesC.push(
                        <Dropdown.Item
                            className={'d-flex justify-content-between m-1'}
                            key={genVariantCode()}
                            eventKey={k}
                            active={selectedCateC == k}
                        >{categories[`${selectedCateA}`].subcategories[`${selectedCateB}`].subcategories[k].category}</Dropdown.Item>
                    )
                }
                setComponentCateC(_categoriesC)

            }
    }, [categories, selectedCateB, selectedCateC])

    useEffect(() => {
        if (selectedCateC) {
            if (categories[`${selectedCateA}`]?.subcategories[`${selectedCateB}`]) {
                selectedHandler(categories[`${selectedCateA}`].subcategories[`${selectedCateB}`].subcategories[`${selectedCateC}`].category_id)
                // @ts-ignore
                setCatePath(selectedCateA + '/' + selectedCateB + '/' + selectedCateC)
            }
        }
    }, [selectedCateC,categories])

    useEffect(() => {
        // console.log('defaultSelectedCate', defaultSelectedCate)
        if (defaultSelectedCate != undefined && defaultSelectedCate > -1) {
            // console.log('12')
            for (const categoryA in categories) {
                // console.log(categoryA)
                if (parseInt(categoryA) == (defaultSelectedCate)) {

                    // // selectedCateA(defaultSelectedCate)
                    // console.log('categoryA ', categoryA)
                    // console.log('defaultSelectedCate ', defaultSelectedCate)
                    setSelectedCateA(categoryA)
                    break;
                } else {
                    // console.log('34')
                    let bool = true
                    if (!_.isNil(categories[categoryA]?.subcategories)) {
                        for (const categoryB in categories[categoryA]?.subcategories) {
                            // console.log('categoryB ', categoryB)
                            // console.log('categoryB', categories[categoryA]?.subcategories[categoryB].category_id)

                            if (categories[categoryA]?.subcategories[categoryB].category_id == defaultSelectedCate) {
                                // console.log('CateB idi', categories[categoryA]?.subcategories[categoryB].category_id)
                                setSelectedCateA(categoryA)
                                setSelectedCateB(categoryB)
                                bool = false
                                break;

                            } else {
                                if (!_.isNil(categories[categoryA]?.subcategories[categoryB].subcategories)) {
                                    for (const categoryC in categories[categoryA]?.subcategories[categoryB].subcategories) {
                                        // console.log('categoryC',categoryC)
                                        // console.log('categoryC ', categoryC, categories[categoryA]?.subcategories[categoryB].subcategories[categoryC].category_id)
                                        if (categories[categoryA]?.subcategories[categoryB].subcategories[categoryC].category_id == defaultSelectedCate) {
                                            // console.log('afound',categories[categoryA]?.subcategories[categoryB].subcategories[categoryC].category_id, defaultSelectedCate)
                                            setSelectedCateA(categoryA)
                                            setSelectedCateB(categoryB)
                                            setSelectedCateC(categoryC)
                                            bool=false
                                            break;
                                        }
                                        // console.log(categories[categoryA]?.subcategories[categoryB]?.subcategories[categoryC].category_id)
                                    }
                                }
                            }
                        }
                        if(!bool){
                            break;
                        }
                    }

                }

            }
        }
    }, [defaultSelectedCate, categories])
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    return (!isMobileDevice()) ? (
            // Cate for Desktop
            <div className={'productCategories'}>
                <div className="row mb-3">
                    <div className={'col-md-2'}>
                        <label className="fs-6 form-label fw-bolder text-dark"><span className="text-danger">* </span>
                            <span>{intl.formatMessage({id: 'LANGUAGE.CATEGORY'})}
                    </span></label>
                    </div>
                    <div className={'col-md-9'}>
                        <span className={"text-danger fw-bold"}>{txtSelectedCategories}</span>
                    </div>
                </div>
                <div className="row">
                    <div className={'col-sm-4 pe-0'}>
                        <div className={'border-primary p-3'}>
                            <FormGroup className={'formGroup'}>
                                <FormControl
                                    className="mb-3 pe-12"
                                    placeholder="Type to filter..."
                                    onChange={(e) => {
                                        setValue(e.target.value)
                                    }}
                                />
                                <FontAwesomeIcon icon={faSearch} />
                            </FormGroup>
                            <Dropdown onSelect={(e) => {
                                if(e != selectedCateA) {
                                    setComponentCateC('')
                                    setSelectedCateC('')
                                    setSelectedCateB('')
                                    setComponentCateB('')
                                    setSelectedCateA(e)
                                }

                            }}>
                                <Dropdown.Menu as={CustomMenu} show
                                >
                                    {componentCateA}
                                </Dropdown.Menu>

                            </Dropdown>
                        </div>
                    </div>
                    <div className={'col-sm-4 p-0'}>
                            {componentCateB ? (
                                <div className={' p-3 border-primary-no-left'}>
                                    <FormGroup className={'formGroup'}>
                                        <FormControl
                                            className="mb-3 pe-12"
                                            placeholder="Type to filter..."
                                            onChange={(e) => {
                                                setValueB(e.target.value)
                                            }}
                                        />
                                        <FontAwesomeIcon icon={faSearch} />
                                    </FormGroup>
                                    <Dropdown onSelect={(e) => {
                                        if(e != selectedCateB) {
                                            setComponentCateC('')
                                            setSelectedCateC('')
                                            setSelectedCateB(e)
                                        }

                                    }}>
                                        <Dropdown.Menu as={CustomMenuB} show>
                                            {componentCateB}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            ) : ''}
                    </div>
                    <div className={'col-sm-4 ps-0'}>
                        {componentCateC ? (
                            <div className={' p-3 border-primary-no-left'}>
                                <FormGroup className={'formGroup'}>
                                    <FormControl
                                        className="mb-3 pe-12"
                                        placeholder="Type to filter..."
                                        onChange={(e) => {
                                            setValueC(e.target.value)
                                        }}
                                    />
                                    <FontAwesomeIcon icon={faSearch} />
                                </FormGroup>
                                <Dropdown onSelect={(e) => setSelectedCateC(e)}>
                                    <Dropdown.Menu as={CustomMenuC} show>
                                        {componentCateC}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        ) : ''}
                    </div>
                </div>
            </div>)
        :
        // Cate for Mobile
        (<div>
            <div className="row mb-5">
                <div className={'col-md-2'}>
                    <label className="fs-6 form-label fw-bolder text-dark"><span className="text-danger">* </span>
                        <span>{intl.formatMessage({id: 'LANGUAGE.CATEGORY'})}</span></label>
                </div>
                <div className={'col-md-9'}>
                    <span>{txtSelectedCategories}</span>
                </div>
            </div>
            <div className="row mb-5">
                <Button className={'btn btn-primary m-1 btn-sm'} onClick={toggleDrawer}>{intl.formatMessage({id: 'LANGUAGE.SELECT'})}</Button>
                <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction='right'
                    size={Number(width) ?? +250}
                >

                    <div className={'container-fluid p-0 m-0'}
                         style={{width: width ?? '100%', height: height ?? '100%', overflow: 'scroll'}}>
                        <nav
                            className="navbar sticky-top shadow p-5 mb-5 bg-white rounded d-flex justify-content-between">
                            <div>
                                <label className="fs-6 form-label fw-bolder text-dark"><span
                                    className="text-danger">* </span>
                                    <span>{intl.formatMessage({id: 'LANGUAGE.CATEGORY'})}</span></label>
                            </div>
                            <div><i className="fas fa-times" onClick={toggleDrawer}></i></div>
                        </nav>
                        <div className={'p-5'}>
                            <FormControl
                                className="mb-3"
                                placeholder="Type to filter..."
                                onChange={(e) => {
                                    setValueM(e.target.value)
                                }}
                            />
                            <Dropdown onSelect={(e: string | null) => {
                                setCatePath(e ?? '')
                                setSelectedCateM(e ?? '')
                                toggleDrawer()
                            }}>
                                <Dropdown.Menu as={CustomMenuM} show>
                                    {componentCateM}
                                </Dropdown.Menu>

                            </Dropdown>
                            <div className={'row p-6 fixed-bottom'}>
                                <Button className={'btn btn-primary btn-sm'} onClick={toggleDrawer}>{intl.formatMessage({id: 'LANGUAGE.CLOSE'})}</Button>
                            </div>
                        </div>
                    </div>
                </Drawer>
            </div>
        </div>)
}

export {ProductCategoriesBlock}
