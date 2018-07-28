import classnames from 'classnames'
import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Icon from './Icon'

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
    displayValue: v => (v || ''),
    storeValue: v => v,
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const {
      value,
    } = this.props
    typeof value !== 'undefined' && this.onChange(value, { isMounting: true })
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props
    if (prevProps.value !== value) {
      this.onChange(value)
    }
  }

  onChange = (value, config) => {

    const {
      InputComponent,
      onChange,
      type
    } = this.props

    const storeValue = get(InputComponent, 'storeValue', this.props.storeValue)

    onChange(
      storeValue(value, this.props),
      Object.assign({}, this.props, config)
    )
  }

  renderInput = () => {

    const {
      id,
      InputComponent,
      readonly,
      required,
      value
    } = this.props

    const displayValue = get(InputComponent, 'displayValue', this.props.displayValue)

    const inputProps = Object.assign({}, this.props, {
      'aria-describedby': `${id}-error`,
      onChange: this.onChange,
      required: required && !readonly,
      value: displayValue(value, this.props),
    })

    return InputComponent && <InputComponent {...inputProps} />
  }

  renderLayout() {
    const {
      errors,
      id,
      isExpanded,
      label,
      layout,
      required,
      readOnly,
      size,
      type,
    } = this.props
    const $input = this.renderInput()

    if (type === 'hidden') return $input

    if (layout === 'horizontal') {
      return (
        <div className='field is-horizontal'>
          {
            label && (
              <div className={`field-label is-${size}`}>
                <label htmlFor={id} className='label'>
                  <span className={`subtitle ${classnames({required, readOnly})}`}>
                    {label} :
                  </span>
                </label>
              </div>
            )
          }
          <div className='field-body'>
            <div className={classnames('field', {
              'checkbox': type === 'checkbox',
              'is-expanded': isExpanded
            })}>
              {$input}
            </div>
            {
              errors && errors.map((e, i) => (
                <p className='help is-danger columns' id={`${id}-error`} key={i}>
                  <Icon className='column is-1' svg="picto-warning" alt="Warning" />
                  <span className='column'> {e} </span>
                </p>
              ))
            }
          </div>
        </div>
      )
    }

    if (layout === 'vertical') {

      if (type === 'checkbox') {
        return (
          <div className='field checkbox'>
            <label
              className={classnames({ required })}
              htmlFor={id}>
              {$input}
              {label}
            </label>
          </div>
        )
      }

      const { sublabel } = this.props
      return (
        <div className="field">
          {
            label && (
              <label className='label' htmlFor={id}>
                <h3 className={classnames({required, 'with-subtitle': sublabel})}>{label}</h3>
                {sublabel && <p>... {sublabel} :</p>}
              </label>
            )
          }
          <div className="control">
            {$input}
          </div>
          <ul className="help is-danger" id={`${id}-error`}>
            {
              errors && errors.map((e, i) => (
                <li className="columns" key={i}>
                  <Icon className="column is-1" svg="picto-warning" alt="Warning" />
                  <p className="column"> {e} </p>
                </li>
              ))
            }
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
Field.displayName = "Field"

export default Field
