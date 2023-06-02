import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import clsx from 'clsx'
import {useLayout} from '../core'
import {DrawerComponent} from "../../../utils/metronic/components";

const Content: React.FC = ({children}) => {
  const {classes} = useLayout()
  const location = useRouter()
  useEffect(() => {
    DrawerComponent.hideAll()
  }, [location])
  return (
    <div id='kt_content_container' className={clsx('container-xxl',classes.contentContainer.join(''), 'p-4')}>
      {children}
    </div>
  )
}
export {Content}
