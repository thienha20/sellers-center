import Types from "../types"

const settings = () => {
    return {
        type: Types.SETTINGS
    }
}

const securityHash = (security_hash: string) => {
    return {
        type: Types.SECURITYHASH,
        payload: security_hash
    }
}

const timePhoneLimiter = (time: number, type: string) => {
    return {
        type: Types.TIME_LIMITER,
        payload: {time, type}
    }
}

const timeEmailLimiter = (time: number, type: string) => {
    return {
        type: Types.TIME_EMAIL_LIMITER,
        payload: {time, type}
    }
}

const codePhone = (code: string, type: string) => {
    return {
        type: Types.CODE_SMS,
        payload: {code, type}
    }
}

const codeEmail = (code: string, type: string) => {
    return {
        type: Types.CODE_EMAIL,
        payload: {code, type}
    }
}

const stopScrollNav = (bol: boolean) => {
    return {
        type: Types.STOP_SCROLL_NAV,
        payload: bol
    }
}


let actions = {
    settings,
    securityHash,
    timePhoneLimiter,
    codePhone,
    codeEmail,
    timeEmailLimiter,
    stopScrollNav
}
export default actions