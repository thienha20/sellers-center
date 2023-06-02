import React, {useEffect, useState} from "react";
import axios from "axios";
import _ from "lodash"
import {Obj} from "../../utils/types";
import {fnCurrentApiUrl} from "../../utils/url";
import {useLang} from "../i18n/Metronici18n";
import Select from "react-select";


type propsSelectProductBrand = {
    defaultValue ?: any
    handleSelect : Function
}

const SelectProductBrand: (props: propsSelectProductBrand) => JSX.Element = (props: propsSelectProductBrand) => {
    const lang: string = useLang() ?? "vi"
    const {defaultValue, handleSelect} = {...props}
    const [defaultSelected, setDefaultSelected] = useState<any>({value: defaultValue})
    const [data, setData] = useState<Obj[]>([])

    useEffect(() => {
        setDefaultSelected(data.filter((item: Obj) => item.value === defaultValue))
    }, [defaultValue, data])

    useEffect(() => {
        const loadBrands = async () => {
            return await axios.post(fnCurrentApiUrl(`/api/brand?needMap=true`), {lang_code: lang}).then(response => {
                const api_respone = response.data.data
                let _brand: Obj[] = []
                for (const brand of api_respone) {
                    _brand.push(brand)
                }
                setData(_brand)
            })
        }
        loadBrands()
        return () => setData([])
    }, [])

    return (
        <Select options={data}
             value={defaultSelected}
             isClearable={true}
             onChange={(e: any) => {
                 handleSelect( _.isNil(e) ? '' : e.value )
             }}
        />
    )
}

export {SelectProductBrand}
