import * as reactIconPack from 'react-icons/lib/md'
import React from 'react'

const Icon = ({ svg, name, ...imgProps }) => {
  if (!Icon.rootPath) {
    console.warn('You need to define a rootPath for your Icon')
  }
  if (svg) {
    return <img src={`${Icon.rootPath}/icons/${svg}.svg`} alt={svg} {...imgProps} />
  }
  const iconName =
    'Md' + name.replace(/(^|-)(\w)/g, (m0, m1, m2) => m2.toUpperCase())
  return reactIconPack[iconName]()
}

export default Icon
