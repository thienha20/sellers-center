import axios from "axios";

export class Ajax {

    private header: any = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    public apiDomain: string = ''

    constructor(domain: string | null = null) {
        if (domain != null) {
            this.apiDomain = domain
        }
    }

    get = (url: string, data: any | null = null, header: string[] | null = null, cb: (obj: any | null) => void | null): any | boolean => {
        url = this.apiDomain + url;
        let params: string = ''
        if (data) {
            for (const i in data) {
                if (typeof data[i] === "object") {
                    for (const j in data[i]) {
                        params += `${i}[${j}]=${data[i][j]}&`
                    }
                } else {
                    params += `${i}=${data[i]}&`
                }

            }
        }
        if (params !== "") {
            params = params.substr(0, params.length - 1);
        }
        if (url.indexOf("?") > -1) {
            url += '&' + params;
        } else {
            url += '?' + params;
        }
        if (header != null) {
            this.header = {...this.header.headers, ...header}
        }
        return axios.get(url)
            .then(function (response) {
                // handle success
                if (cb && typeof cb === "function") {
                    cb(response.data);
                }
                return response.data;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return false
            });
    }

    post = (url: string, data: any | null = null, header: any | null = null, cb: (obj: any | null) => void | null): any | boolean => {
        url = this.apiDomain + url;
        if (header != null) {
            this.header = {...this.header.headers, ...header}
        }
        return axios.post(url, data, this.header)
            .then(function (response) {
                // handle success
                if (cb && typeof cb === "function") {
                    cb(response.data);
                }
                return response.data;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return false
            });
    }

    put = (url: string, data: any | null = null, header: any | null = null, cb: (obj: any | null) => void | null): any | boolean => {
        url = this.apiDomain + url;
        if (header != null) {
            this.header = {...this.header.headers, ...header}
        }
        return axios.put(url, data, this.header)
            .then(function (response) {
                // handle success
                if (cb && typeof cb === "function") {
                    cb(response.data);
                }
                return response.data;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return false
            });
    }

    delete = (url: string, data: any | null = null, header: any | null = null, cb: (obj: any | null) => void | null): any | boolean => {
        url = this.apiDomain + url;
        if (header != null) {
            this.header = {...this.header.headers, ...header}
        }
        return axios.delete(url, this.header)
            .then(function (response) {
                // handle success
                if (cb && typeof cb === "function") {
                    cb(response.data);
                }
                return response.data;
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return false
            });
    }
}