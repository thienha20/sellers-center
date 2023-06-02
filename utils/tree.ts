import {Obj} from "./types"
import {WhiteListPermission} from "./permission"

export const menuTree = (menu: Obj[], permission: string[] | null | undefined): Obj[] => {
    if (!permission || permission.length === 0) return menu
    let newMenu: Obj[] = []
    let item: Obj[] = []
    for (let i of menu) {
        if (i.children && i.children.length > 0) {
            item = menuTree(i.children, permission)
            if (i.url && i.url !== "") {
                if (permission.includes(i.url) || WhiteListPermission.includes(i.url)) {
                    if (item.length > 0) {
                        newMenu.push({
                            ...i, children: item
                        })
                    } else {
                        newMenu.push({
                            ...i, children: []
                        })
                    }
                } else {
                    if (item.length > 0) {
                        newMenu.push({
                            ...i, children: item, url: ""
                        })
                    }
                }
            } else {
                if (item.length > 0) {
                    newMenu.push({
                        ...i, children: item
                    })
                }
            }
        } else {
            if (i.url && i.url !== "") {
                if (permission.includes(i.url) || WhiteListPermission.includes(i.url)) {
                    newMenu.push({
                        ...i
                    })
                }
            }
        }

    }
    return newMenu
}