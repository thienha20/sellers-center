import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLang} from "../i18n/Metronici18n";
import {Obj} from "../../utils/types";
import Select from "react-select";

import _ from "lodash";
import {fnCurrentApiUrl} from "../../utils/url";

type propsSelectProductCategories = {
    defaultValue?: any,
    handleSelect: Function
}

const SelectProductCategory: (props: propsSelectProductCategories) => JSX.Element = (props: propsSelectProductCategories) => {
    const {defaultValue, handleSelect} = {...props}
    const lang: string = useLang() ?? "vi"
    const [defaultSelected, setDefaultSelected] = useState<any>({value: defaultValue})
    const [data, setData] = useState<Obj[]>([])

    useEffect(() => {
        setDefaultSelected(data.filter((item: Obj) => item.value === defaultValue))
    }, [defaultValue, data])

    useEffect(() => {
        const loadCategories = async () => {
            return await axios.post(fnCurrentApiUrl("/api/categories"), {
                lang_code: lang,
            }).then(response => {
                const api_respone = response.data.data
                let _cate: Obj[] = []
                const addSubCateDropDown = (subcate: any, path: string, text: string) => {
                    for (let k in subcate) {
                        const select = {
                            value: subcate[k].category_id,
                            label: text + '' + subcate[k].category
                        }
                        _cate.push(select)
                        if (defaultValue == subcate[k].category_id) {
                            setDefaultSelected(select)
                        }
                        subcate[k].subcategories ? addSubCateDropDown(subcate[k].subcategories, k, text + '' + subcate[k].category + ' > ') : ''
                    }
                }
                for (const category in api_respone) {
                    const select = {
                        value: api_respone[category].category_id.toString(),
                        label: api_respone[category].category
                    }
                    _cate.push(select)
                    api_respone[category].subcategories ? addSubCateDropDown(api_respone[category].subcategories, api_respone[category].category_id, api_respone[category].category + ' > ') : ''
                }
                setData(_cate)
            })
        }
        loadCategories()
        return () => setData([])
    }, [])

    return (<Select options={data}
                    value={defaultSelected}
                    isClearable={true}
                    onChange={(e: any) => {
                        handleSelect(_.isNil(e) ? '' : e.value)
                     }}
    />)
}

export {SelectProductCategory}
