import PropTypes from 'prop-types'
import React from 'react'

import { ROOT_PATH } from '../utils/config'

export const Icon = ({ svg, ...imgProps }) => {
  if (!Icon.rootPath) {
    console.warn('You need to define a rootPath for your Icon')
  }
  return (
    <img alt={svg} src={`${Icon.rootPath}/icons/${svg}.svg`} {...imgProps} />
  )
}

Icon.propTypes = {
  svg: PropTypes.string.isRequired
}

Icon.rootPath = ROOT_PATH

export default Icon
