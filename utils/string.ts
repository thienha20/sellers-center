import {IntlShape} from "react-intl/src/types";
import {Obj} from "./types";

export const removeAccents = (str: string): string => {
    var AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
        var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        var char = AccentsMap[i][0];
        str = str.replace(re, char);
    }
    return str;
}

export const searchInString = (str: string ='', keyword: string ='') => {
    let _keyword = removeAccents(keyword)
    let _str = removeAccents(str.toString().toLowerCase())
    return _str.search(_keyword)
}

export const genVariantCode = (): string => {
    let crypto = require("crypto");
    let id = crypto.randomBytes(32).toString('hex');
    return id
}

export const validURL = (str: string) => {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

export const fnListOrderStatus: (intl: IntlShape) => Obj[] = (intl: IntlShape) => {
    return [
        // {value: 'orders_waiting', label: intl.formatMessage({id: 'LANGUAGE.UNPAID'})},
        {value: 'orders_in_process', label: intl.formatMessage({id: 'LANGUAGE.PROCESSING'})},
        {value: 'orders_packing_handing_over', label: intl.formatMessage({id: 'LANGUAGE.PACKING_AND_HANDING_OVER'})},
        {value: 'orders_on_delivery', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY'})},
        {value: 'orders_success', label: intl.formatMessage({id: 'LANGUAGE.SUCCESS'})},
        {value: 'orders_cancelled', label: intl.formatMessage({id: 'LANGUAGE.CANCELLED'})},
        {value: 'orders_delivery_failed', label: intl.formatMessage({id: 'LANGUAGE.DELIVERY_FAILED'})},
        {value: 'orders_return_or_refund', label: intl.formatMessage({id: 'LANGUAGE.RETURNS'})}
    ]
}
export const fnListProductStatus: (intl: IntlShape) => Obj[] = (intl: IntlShape) => {
    return [
        {value: 'active', label: intl.formatMessage({id: 'LANGUAGE.ACTIVE'})},
        {value: 'inactive', label: intl.formatMessage({id: 'LANGUAGE.INACTIVE'})},
        {value: 'draft', label: intl.formatMessage({id: 'LANGUAGE.DRAFT'})},
        {value: 'waiting_approve', label: intl.formatMessage({id: 'LANGUAGE.WAITING_APPROVE'})},
        {value: 'suspended', label: intl.formatMessage({id: 'LANGUAGE.SUSPENDED'})},
    ]
}
