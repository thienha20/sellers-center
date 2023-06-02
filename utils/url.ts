export const toAbsoluteUrl = (pathname: string) => process.env.PUBLIC_URL + pathname
export const fnUrl = (dispatch: string) => process.env.API_DOMAIN + "/index.php?dispatch=" + dispatch
export const fnApiUrl = (dispatch: string) => process.env.API_DOMAIN + "/api/" + dispatch
export const fnCurrentApiUrl = (path: string) => {
    let url: string = process.env.PUBLIC_URL + path
    if (url.indexOf("?") >= 0) {
        url += "&is_ajax=1"
    }else{
        url += "?is_ajax=1"
    }
    return url
}
export const fnUrlQueryBuilder = (dispatch: string, query: { [key: string]: any }) => {
    if (Object.keys(query).length > 0) {
        let content = ''
        for (const property in query) {
            //FIXME: chia type string, number - array
            if (property && query[property] != '' && query[property] != undefined) {
                content += `&${property}=${query[property]}`
            }
        }
        if(content === "") return `/${dispatch}`
        if (content[0] == '&') {
            content = content.substring(1);
        }
        return `/${dispatch}?${content}`
    }
    return `/${dispatch}`
}
export const fnUrlMain = (dispatch: string) => process.env.PUBLIC_URL + "/" + dispatch

export function getCurrentUrl(pathname: string): string {
    return pathname.split(/[?#]/)[0]
}

export function getCurrentLink(): string {
    if (typeof window === "undefined") return ""
    return window.location.pathname + window.location.hash + window.location.search
}

export function checkIsActive(pathname: string, url: string): boolean {
    const current = getCurrentUrl(pathname)
    if (!current || !url) {
        return false
    }

    if (current === url) {
        return true
    }

    // if (current.indexOf(url) > -1) {
    //     return true
    // }

    return false
}


