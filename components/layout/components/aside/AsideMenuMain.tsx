/* eslint-disable react/jsx-no-target-blank */
import React, {useEffect, useState, memo, useMemo} from 'react'
import {useIntl} from 'react-intl'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import {Obj} from "../../../../utils/types"
import {menuTree} from "../../../../utils/tree"
import {useSelector} from "react-redux"
import {ReducerInterFace} from "../../../../redux/reducers"
import CryptoJS from "crypto-js"
import {asideMenu} from "../../../../utils/menu"



const AsideMenuMain: React.FC = () => {
    const intl = useIntl()
    const [menuListing, setMenuListing] = useState<Obj[]>(asideMenu)
    const user = useSelector((state: ReducerInterFace) => state.auth?.currentUser)

    const permission: string[] | null | undefined = useMemo<string[] | null | undefined>(() => {
        if (user?.permission){
            let per: string = CryptoJS.AES.decrypt(user.permission, process.env.CRYPTO ?? "scTAT").toString(CryptoJS.enc.Utf8)
            return JSON.parse(per)
        }
    }, [user?.permission])

    useEffect(() => {
        if (permission) {
            setMenuListing(menuTree(asideMenu, permission))
        }
    }, [setMenuListing, permission])

    return (
        <>
            {menuListing && menuListing.map((i: Obj, idx: number) => {
                return (
                    <React.Fragment key={`p${idx}`}>
                        {
                            i.header && <div className='menu-item'>
                                <div className='menu-content pt-8 pb-2'>
                                    <span
                                        className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({id: i.header})}</span>
                                </div>
                            </div>
                        }
                        {i.children && i.children.map((c1: Obj, i1: number) => {
                            return (<React.Fragment key={`c1${i1}`}>
                                    {c1.children && c1.children.length > 0 ?
                                        <AsideMenuItemWithSub
                                            to={c1.url ?? ""}
                                            icon={c1.icon ?? ""}
                                            title={intl.formatMessage({id: c1.title})}
                                            fontIcon={c1.fontIcon ?? ""}
                                        >
                                            {c1.children.map((c2: Obj, i2: number) => {
                                                return <AsideMenuItem key={`c2${i2}`}
                                                                      to={c2.url ?? ""}
                                                                      icon={c2.icon ?? ""}
                                                                      title={intl.formatMessage({id: c2.title})}
                                                                      fontIcon={c2.fontIcon ?? ""}
                                                                      hasBullet={c2.hasBullet ?? true}
                                                />
                                            })}
                                        </AsideMenuItemWithSub>
                                        : <AsideMenuItem
                                            to={c1.url ?? ""}
                                            icon={c1.icon ?? ""}
                                            title={intl.formatMessage({id: c1.title})}
                                            fontIcon={c1.fontIcon ?? ""}
                                        />
                                    }
                                </React.Fragment>
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </>
    )
}
export default memo(AsideMenuMain)