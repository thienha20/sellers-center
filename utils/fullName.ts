import _ from 'lodash'
import {User} from "../pages/api/me";

export const fnFullName = (firstname: string, lastname: string): string => {
    let full_name = '';
    if (!_.isEmpty(lastname)) {
        full_name += lastname;
    }
    if (!_.isEmpty(firstname)) {
        if (!_.isEmpty(full_name)) {
            full_name += " ";
        }
        full_name += firstname;
    }
    return full_name;
}

export const fnFirstLast = (name: string, language: string) => {
    if (!name || name === "") return null
    let arr = name.split(" ")
    if (language === "vi") {
        return {
            userData: {
                lastname: arr.pop(),
                firstname: arr.join(" ")
            }
        } as User
    }
    return {
        userData: {
            firstname: arr.pop(),
            lastname: arr.join(" ")
        }
    } as User
}