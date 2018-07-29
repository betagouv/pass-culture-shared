import * as reactIconPack from 'react-icons/lib/md'
import React from 'react'

import { ROOT_PATH } from '../utils/config'

const Icon = ({ svg, name, ...imgProps }) => {
  if (svg) {
    return <img src={`${ROOT_PATH}/icons/${svg}.svg`} alt={svg} {...imgProps} />
  }
  const iconName =
    'Md' + name.replace(/(^|-)(\w)/g, (m0, m1, m2) => m2.toUpperCase())
  return reactIconPack[iconName]()
}

export default Icon
