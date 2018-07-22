import React from 'react'

import { BasicInput } from './BasicInput'

export const HiddenInput = props => {
  return <BasicInput {...props} type='hidden'/>
}
