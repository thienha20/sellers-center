import React from 'react'
import {useLayout} from '../../core/LayoutProvider'
import {Toolbar1} from './Toolbar1'
import {PageLink} from "../../core"

type ToolbarParams = {
  breadcrumb?: PageLink[]
}

const Toolbar: (properties: ToolbarParams) => JSX.Element = (props: ToolbarParams) => {
  const {config} = useLayout()

  switch (config.toolbar.layout) {
    case 'toolbar1':
      return <Toolbar1 {...props} />

    default:
      return <Toolbar1 {...props} />
  }
}

export {Toolbar}
