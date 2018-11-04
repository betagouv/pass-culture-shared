import classnames from 'classnames'
import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { Icon } from '../Icon'

class Field extends Component {

  componentDidMount() {
    const { value } = this.props
    if (typeof value !== 'undefined' && value !== '') {
      this.onChange(value, { isMounting: true })
    }
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    if (prevProps.value !== value) {
      this.onChange(value)
    }
  }

  onChange = (value, config) => {
    const { InputComponent, onChange: formOnChange, storeValue, value: propsValue } = this.props

    const localOrParentStoreValue = get(InputComponent, 'storeValue', storeValue)

    const isValueChangedToEmptyString = value === '' && propsValue

    const newStoreValue = isValueChangedToEmptyString ? ' ' : value

    const storedValue = localOrParentStoreValue(newStoreValue, this.props)

    formOnChange(storedValue, Object.assign({}, this.props, config))
  }

  renderErrors = () => {
    const { id, errors } = this.props

    if (get(errors, 'length')) {
      return errors.map((error, index) => (
        <p
          className="help is-danger columns is-vcentered"
          id={`${id}-error`}
          key={index}
        >
          <span className="column is-narrow">
            <Icon svg="picto-warning" alt="Attention" />
          </span>
          <span className="column is-paddingless is-narrow">
            {error}
          </span>
        </p>
      ))
    }
    return (
      <p className="help is-danger columns" id={`${id}-error`}>
        <Icon
          className="column is-1 is-invisible is-paddingless"
          svg="picto-warning"
          alt="Attention"
        />
      </p>
    )
  }

  renderInput = () => {
    const { displayValue, id, InputComponent, readOnly, required, value } = this.props

    const localOrParentDisplayValue = displayValue ||
      get(InputComponent, 'displayValue')

    const inputProps = Object.assign({}, this.props, {
      'aria-describedby': `${id}-error`,
      onChange: this.onChange,
      required: required && !readOnly,
      value: localOrParentDisplayValue(value, this.props),
    })

    return InputComponent && <InputComponent {...inputProps} />
  }

  renderDisplayLength = () => {
    const { displayMaxLength, maxLength, value } = this.props
    if (!displayMaxLength) {
      return null
    }

    return (
      <span className="has-text-weight-light is-size-7">
        {get(value, 'length', 0)}
        {' '}
        /
        {' '}
        {maxLength}
        {' '}
        caractères
      </span>
    )
  }

  renderLayout() {
    const {
      className,
      id,
      isExpanded,
      label,
      layout,
      required,
      readOnly,
      size,
      sublabel,
      type,
    } = this.props
    const $input = this.renderInput()

    if (type === 'hidden') return $input

    const $errors = this.renderErrors()
    const $displayLength = this.renderDisplayLength()

    if (layout === 'horizontal') {
      return (
        <div
          className={classnames(
            `field field-${type} is-horizontal`,
            {
              readonly: readOnly,
            },
            className
          )}
        >
          {label && (
            <div
              className={classnames(`field-label is-${size}`, {
                readonly: readOnly,
              })}
            >
              <label htmlFor={id} className="label">
                <span
                  className={`subtitle ${classnames({ readOnly, required})}`}
                >
                  {label}
                  &nbsp;:
                </span>
              </label>
              {$displayLength}
            </div>
          )}
          <div className="field-body">
            <div
              className={classnames(`control control-${type}`, {
                'is-expanded': isExpanded,
              })}
            >
              {$input}
              {sublabel && (
                <p className="has-text-weight-light is-size-7">{sublabel}</p>
              )}
            </div>
            {$errors}
          </div>
        </div>
      )
    }

    if (layout === 'vertical') {
      if (type === 'checkbox') {
        return (
          <div className={classnames('field field-checkbox', className)}>
            <label className={classnames({ required })} htmlFor={id}>
              {$input}
              {label}
            </label>
            {$displayLength}
          </div>
        )
      }

      return (
        <div className={classnames(`field field-${type}`, className)}>
          {label && (
            <label className="label" htmlFor={id}>
              <h3
                className={classnames({ required, 'with-subtitle': sublabel })}
              >
                {label}
              </h3>
              {sublabel && (
                <p>
                  ...&nbsp;
                  {sublabel}
                  &nbsp;:
                </p>
              )}
            </label>
          )}
          <div className="control">{$input}</div>
          <ul className="help is-danger" id={`${id}-error`}>
            {$errors}
          </ul>
        </div>
      )
    }
    return $input
  }

  render() {
    return this.renderLayout()
  }
}

Field.defaultProps = {
  displayValue: v => v || '',
  layout: 'horizontal',
  size: 'normal',
  storeValue: v => v,
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
}

// NEEDED FOR MINIFY BUILD TIME
// BECAUCE c.type.displayName DISAPPEAR OTHERWISE
Field.displayName = 'Field'

export default Field
