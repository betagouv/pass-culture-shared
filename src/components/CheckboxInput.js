import React from 'react'

import BasicInput from './BasicInput'

const CheckboxInput = props => {

  const onInputChange = e => props.onChange(e.target.checked)

  return (
    <BasicInput {...props}
      className='input'
      onChange={onInputChange}
      type='checkbox' />
  )

}

export default CheckboxInput
