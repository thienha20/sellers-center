import React, {useEffect, useRef} from 'react'
import {useRouter} from 'next/router'
import {
  DrawerComponent,
  MenuComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent
} from "../../../utils/metronic/components";
import {KTSVG} from "../../images/KTSVG";

export function ScrollTop() {
  const {asPath} = useRouter()
  const isFirstRun = useRef(true)

  const pluginsReinitialization = () => {
    setTimeout(() => {
      // ScrollTopComponent.reinitialization()
      MenuComponent.reinitialization()
      StickyComponent.reInitialization()
      setTimeout(() => {
        ToggleComponent.reinitialization()
        DrawerComponent.reinitialization()
        // ScrollComponent.reinitialization()
      }, 70)
    }, 140)
  }

  const scrollTop = () => {
    ScrollTopComponent.goTop()
  }

  const updateHeaderSticky = () => {
    const stickyHeader = document.body.querySelectorAll(`[data-kt-sticky-name="header"]`)
    if (stickyHeader && stickyHeader.length > 0) {
      const sticky = StickyComponent.getInstance(stickyHeader[0] as HTMLElement)
      if (sticky) {
        sticky.update()
      }
    }
  }

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
    } else {
      pluginsReinitialization()
    }

    updateHeaderSticky()
    setTimeout(() => {
      scrollTop()
    }, 0)
  }, [asPath])

  return (
    <div id='kt_scrolltop' className='scrolltop' data-kt-scrolltop='true'>
      <KTSVG path='/media/icons/duotune/arrows/arr066.svg' />
    </div>
  )
}
