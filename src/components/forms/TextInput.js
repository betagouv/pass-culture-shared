import React from 'react'

import BasicInput from './BasicInput'

const TextInput = props => {
  const { onChange: fieldOnChange } = props

  const onInputChange = event =>
    fieldOnChange(event.target.value, { event })

  const guessAutoComplete = () => {
    if (props.name === 'email') return 'email'
  }

  return (
    <BasicInput
      {...props}
      onChange={onInputChange}
      autoComplete={guessAutoComplete()}
    />
  )
}

export default TextInput
