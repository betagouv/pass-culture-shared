import React from 'react'

import BasicInput from './BasicInput'

const HiddenInput = props => (
  <BasicInput {...props} type="hidden" />
)

export default HiddenInput
