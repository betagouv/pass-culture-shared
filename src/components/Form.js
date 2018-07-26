import debounce from 'lodash.debounce'
import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestData } from '../reducers/data'
import { removeErrors } from '../reducers/errors'
import { mergeFormData } from '../reducers/form'
import { showNotification } from '../reducers/notification'
import { recursiveMap } from '../utils/react'
import { pluralize } from '../utils/string'

class Form extends Component {

  constructor(props) {
    super(props)
    this.state = {
      patch: {},
    }

    this.onDebouncedMergeForm = debounce(
      this.onMergeForm,
      props.debounceTimeout
    )
  }

  static defaultProps = {
    TagName: 'form',
    formData: {},
    formErrors: {},
    debounceTimeout: 300,
    formatData: data => data,
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    action : PropTypes.string.isRequired,
    data: PropTypes.object,
  }

  static inputsByType = {}

  static guessInputType(name) {
    switch(name) {
      case 'email':
        return 'email'
      case 'password':
        return 'password'
      case 'time':
        return 'time'
      case 'date':
        return 'date'
      case 'siret':
      case 'siren':
        return 'siren'
      case 'price':
        return 'number'
      default:
        return 'text'
    }
  }

  static getDerivedStateFromProps = (props, prevState) => {
    return {
      method: props.method || (get(props, 'data.id') ? 'PATCH' : 'POST'),
    }
  }

  onMergeForm = () => {
    const {
      formData,
      mergeFormData,
      name,
      removeErrors
    } = this.props
    const { patch } = this.state

    this.setState({ patch: {} })

    // no need to go further if patch is actually equal to formDate
    Object.keys(patch).forEach(key => {
      if (formData[key] === patch[key]) {
        delete patch[key]
      }
    })
    if (Object.keys(patch).length === 0) {
      return
    }

    removeErrors(name)
    mergeFormData(name, patch)

  }

  onSubmit = e => {
    e.preventDefault()
    const {
      action,
      formData,
      formatData,
      handleSuccess,
      name,
      requestData,
      storePath,
    } = this.props

    requestData(
      this.state.method,
      action.replace(/^\//g, ''), {
      body: formatData(formData),
      formName: name,
      handleFail: this.handleFail,
      handleSuccess,
      key: storePath, // key is a reserved prop name
      encode: formData instanceof FormData ? 'multipart/form-data' : null,
    })
  }

  handleFail = () => {
    const {
      handleFail,
      showNotification
    } = this.props
    showNotification({
      text: 'Formulaire non validé',
      type: 'danger'
    })
    handleFail && handleFail()
  }

  childrenWithProps = () => {
    const {
      children,
      formData,
      formErrors,
      data: storeData,
      layout,
      name,
      readOnly,
      size,
    } = this.props
    const { isEditing } = this.state

    let notHiddenFields = []
    let requiredFields = []

    return recursiveMap(children, c => {
      if (c.type.displayName === 'Field') {
        const dataKey = c.props.dataKey || c.props.name // name is unique, dataKey may not
        const formValue = get(formData, dataKey)
        const storeValue = get(storeData, dataKey)
        const type = c.props.type || Form.guessInputType(c.props.name) || 'text'
        const InputComponent = Form.inputsByType[type]
        if (!InputComponent) console.error('Component not found for type:', type)

        const onChange = value => {
          const newPatch = typeof value === 'object'
            ? value
            : {[dataKey]: value}
          this.setState({
            patch: Object.assign(this.state.patch, newPatch)
          })
          // this.onDebouncedMergeForm() // Not working for now, concurrency issue ...
          this.onMergeForm()
        }

        const newChild =  React.cloneElement(c,
          Object.assign({
            id: `${name}-${c.props.name}`,
            dataKey,
            onChange,
            value: formValue || storeValue || '',
            errors: [].concat(formErrors)
              .filter(e => get(e, c.props.name))
              .map(e => get(e, c.props.name)),
            readOnly: c.props.readOnly || readOnly,
            layout,
            size,
            type,
            InputComponent,
          },
          get(InputComponent, 'extraFormData', [])
            .reduce((result, k) =>
              Object.assign(result, {[k]: get(formData, k)}), {}))
        )

        if (newChild.props.required) {
          requiredFields = requiredFields.concat(newChild)
        }

        if (newChild.props.type !== 'hidden') {
          notHiddenFields = notHiddenFields.concat(newChild)
        }

        return newChild
      } else if (c.type.displayName === 'SubmitButton') {
        return React.cloneElement(c, Object.assign({
          name,
          getDisabled: () => {
            if (isEditing) {
              const oneEditedField = notHiddenFields.find(f =>
                get(formData, f.props.dataKey))
              return !oneEditedField
            }
            const missingFields = requiredFields.filter(f =>
              !get(formData, f.props.dataKey))
            return missingFields.length > 0
          },
          getTitle: () => {
            const missingFields = requiredFields.filter(f =>
              !get(formData, f.props.dataKey))
            if (missingFields.length === 0) return
            return `Champs ${pluralize('non-valide', missingFields.length)} : ${missingFields.map(f => (f.props.label || f.props.title || '').toLowerCase()).join(', ')}`
          }
        }, this.props.TagName !== 'form' ? {
          // If not a real form, need to mimic the submit behavior
          onClick: this.onSubmit,
          type: 'button',
        } : {}))
      }
      return c
    })
  }

  render() {
    const {
      action,
      className,
      name,
      TagName,
    } = this.props
    const {
      method
    } = this.state
    return (
      <TagName
        action={action}
        className={className}
        id={name}
        method={method}
        onSubmit={this.onSubmit}>
        {this.childrenWithProps()}
      </TagName>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    formData: get(state, `form.${ownProps.name}.data`),
    formErrors: get(state, `errors.${ownProps.name}`),
  }),
  {
    mergeFormData,
    removeErrors,
    requestData,
    showNotification
  }
)(Form)
