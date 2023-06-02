import moment from "moment-timezone"

moment.tz.setDefault("Asia/Ho_Chi_Minh")
export default moment

export function fnCovertDateEn(dateVn: string | string[] | null | undefined) {
    if (!dateVn) return ""
    if(Array.isArray(dateVn)) dateVn = dateVn[0]
    let ex: string[] = dateVn.split("/")
    return ex[1] + "/" + ex[0] + "/" + ex[2]
}