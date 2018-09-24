import React from 'react'

import { ROOT_PATH } from '../utils/config'

const Icon = ({ svg, name, ...imgProps }) => {
  if (!Icon.rootPath) {
    console.warn('You need to define a rootPath for your Icon')
  }
  return <img
    alt={svg}
    src={`${Icon.rootPath}/icons/${svg}.svg`}
    {...imgProps}
  />
}

Icon.rootPath = ROOT_PATH

export default Icon
