import React, {useEffect, useState, memo, useMemo} from 'react'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {useIntl} from 'react-intl'
import _ from "lodash"
import {useSelector} from "react-redux";
import {ReducerInterFace} from "../../../../redux/reducers"
import {Obj} from "../../../../utils/types"
import {menuTree} from "../../../../utils/tree"
import CryptoJS from "crypto-js"
import {menuHeader} from "../../../../utils/menu"



const MenuInner: React.FC = () => {
    const intl = useIntl()
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)
    const [menuListing, setMenuListing] = useState<Obj[]>(menuHeader)

    const permission: string[] | null | undefined = useMemo<string[] | undefined | null>(() => {
        if (user?.permission){
            let per: string = CryptoJS.AES.decrypt(user.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(per)
        }
   }, [user?.permission])

    useEffect(() => {
        //luot permission cho menu
        //user permission có dang ["/users", "/products/[id]", "/products/create", ...] => string[] (mang link)
        if (permission) {
            setMenuListing(menuTree(menuHeader, permission))
        }
    }, [permission, setMenuListing])

    return (
        <>
            {menuListing.map((menuItem: Obj, i: number) => {
                return (
                    (!('children' in menuItem) || _.isEmpty(menuItem.children)) ?
                        <MenuItem key={`sub1${i}`} title={intl.formatMessage({id: menuItem.name})}
                                  to={menuItem.url ?? ""}/> :
                        <MenuInnerWithSub
                            key={`sub1${i}`}
                            title={intl.formatMessage({id: menuItem.name})}
                            to={menuItem.url ?? ""}
                            hasArrow={true}
                            hasBullet={false}
                            menuPlacement='right-start'
                            menuTrigger={`{default:'click', lg: 'hover'}`}
                        >
                            {menuItem.children.map((subItem1: Obj, i: number) => {
                                return (
                                    (!('children' in subItem1) || _.isEmpty(subItem1.children)) ?
                                        <MenuItem key={`sub2${i}`} title={intl.formatMessage({id: subItem1.name})}
                                                  to={subItem1.url ?? ""} hasBullet={true}/> :
                                        <MenuInnerWithSub
                                            key={`sub2${i}`}
                                            title={intl.formatMessage({id: subItem1.name})}
                                            to={subItem1.url ?? ""}
                                            hasArrow={(('children' in subItem1) && subItem1?.children) ? true : false}
                                            hasBullet={(('children' in subItem1) && subItem1?.children) ? false : true}
                                            menuPlacement='right-start'
                                            menuTrigger={`{default:'click', lg: 'hover'}`}
                                        >
                                            {'children' in subItem1 && subItem1.children?.map((subItem2: Obj, i: number) => {
                                                return (
                                                    (!('children' in subItem2) || _.isEmpty(subItem2.children)) ?
                                                        <MenuItem key={`sub3${i}`}
                                                                  title={intl.formatMessage({id: subItem2.name})}
                                                                  to={subItem2.url ?? ""} hasBullet={true}/> :
                                                        <MenuInnerWithSub
                                                            key={`sub3${i}`}
                                                            title={intl.formatMessage({id: subItem2.name})}
                                                            to={subItem2.url ?? ""}
                                                            hasArrow={(('children' in subItem2) && subItem2?.children) ? true : false}
                                                            hasBullet={(('children' in subItem2) && subItem2?.children) ? false : true}
                                                            menuPlacement='right-start'
                                                            menuTrigger={`{default:'click', lg: 'hover'}`}
                                                        >
                                                            {'children' in subItem2 && subItem2.children?.map((subItem3: { [key: string]: any }, i: number) => {
                                                                return (
                                                                    <MenuItem key={`sub4${i}`}
                                                                              to={subItem3.url ?? ""}
                                                                              title={intl.formatMessage({id: subItem3.name})}
                                                                              hasBullet={true}/>
                                                                )
                                                            })}
                                                        </MenuInnerWithSub>

                                                )
                                            })}
                                        </MenuInnerWithSub>
                                )
                            })}
                        </MenuInnerWithSub>
                )
            })}
        </>
    )
}

export default memo(MenuInner)