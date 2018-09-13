import classnames from 'classnames'
import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Icon from '../Icon'

class Field extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  static defaultProps = {
    layout: 'horizontal',
    size: 'normal',
    displayValue: v => v || '',
    storeValue: v => v,
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { value } = this.props
    typeof value !== 'undefined' &&
      value !== '' &&
      this.onChange(value, { isMounting: true })
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    if (prevProps.value !== value) {
      this.onChange(value)
    }
  }

  onChange = (value, config) => {

    const { InputComponent, onChange: formOnChange } = this.props

    const storeValue = get(InputComponent, 'storeValue', this.props.storeValue)

    const storedValue = storeValue(
      value === '' && this.props.value ? ' ' : value,
      this.props
    )

    formOnChange(storedValue, Object.assign({}, this.props, config))
  }

  renderErrors = () => {
    const {
      id,
      errors,
    } = this.props

    if (get(errors, 'length')) {
      return errors.map((e, index) => (
        <p
          className="help is-danger columns is-vcentered"
          id={`${id}-error`}
          key={index}>
          <span className="column">
            <Icon
              svg="picto-warning"
              alt="Attention"
            />
          </span>
          <span className="column is-paddingless is-narrow"> {e} </span>
        </p>
      ))
    }
    return (
      <p
        className="help is-danger columns"
        id={`${id}-error`}>
        <Icon
          className="column is-1 is-invisible is-paddingless"
          svg="picto-warning"
          alt="Attention"
        />
      </p>
    )
  }

  renderInput = () => {
    const { id, InputComponent, readOnly, required, value } = this.props

    const displayValue =
      this.props.displayValue || get(InputComponent, 'displayValue')

    const inputProps = Object.assign({}, this.props, {
      'aria-describedby': `${id}-error`,
      onChange: this.onChange,
      required: required && !readOnly,
      value: displayValue(value, this.props),
    })

    return InputComponent && <InputComponent {...inputProps} />
  }

  renderDisplayLength = () => {
    const {
      displayMaxLength,
      maxLength,
      value
    } = this.props
    if (!displayMaxLength) {
      return
    }

    return (
      <span className="has-text-weight-light is-size-7" >
        {get(value, 'length', 0)} / {maxLength} caractères
      </span>
    )
  }

  renderLayout() {
    const {
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
        <div className={classnames(`field field-${type} is-horizontal`, {
          'readonly': readOnly
        })}>
          {label && (
            <div className={classnames(`field-label is-${size}`, {
              'readonly': readOnly
            })}>
              <label htmlFor={id} className="label">
                <span
                  className={`subtitle ${classnames({ required, readOnly })}`}>
                  {label}&nbsp;:
                </span>
              </label>
              {$displayLength}
            </div>
          )}
          <div className="field-body">
            <div
              className={classnames(`control control-${type}`, {
                'is-expanded': isExpanded,
              })}>
              {$input}
              {sublabel && <p className="has-text-weight-light is-size-7">{sublabel}</p>}
            </div>
            {$errors}
          </div>
        </div>
      )
    }

    if (layout === 'vertical') {
      if (type === 'checkbox') {
        return (
          <div className="field field-checkbox">
            <label className={classnames({ required })} htmlFor={id}>
              {$input}
              {label}
            </label>
            {$displayLength}
          </div>
        )
      }

      const { sublabel } = this.props
      return (
        <div className={`field field-${type}`}>
          {label && (
            <label className="label" htmlFor={id}>
              <h3
                className={classnames({ required, 'with-subtitle': sublabel })}>
                {label}
              </h3>
              {sublabel && <p>...&nbsp;{sublabel}&nbsp;:</p>}
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

// NEEDED FOR MINIFY BUILD TIME
// BECAUCE c.type.displayName DISAPPEAR OTHERWISE
Field.displayName = 'Field'

export default Field
