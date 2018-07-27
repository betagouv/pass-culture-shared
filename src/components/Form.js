import debounce from 'lodash.debounce'
import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { requestData } from '../reducers/data'
import { removeErrors } from '../reducers/errors'
import { mergeForm } from '../reducers/form'
import { showNotification } from '../reducers/notification'
import { recursiveMap } from '../utils/react'
import { pluralize } from '../utils/string'

class Form extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      method: null,
      patch: {},
    }

    this.onDebouncedMergeForm = debounce(
      this.onMergeForm,
      props.debounceTimeout
    )
  }

  static defaultProps = {
    debounceTimeout: 300,
    errorsPatch: {},
    failNotification: 'Formulaire non validé',
    formatPatch: data => data,
    formPatch: {},
    successNotification: 'Formulaire non validé',
    TagName: 'form',
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    action : PropTypes.string.isRequired,
    patch: PropTypes.object,
  }

  static inputsByType = {}

  static getDerivedStateFromProps = (props, prevState) => {
    const isEditing = typeof get(props, 'patch.id') !== 'undefined'
    return {
      isEditing,
      method: props.method || (isEditing ? 'PATCH' : 'POST'),
    }
  }

  onMergeForm = (config) => {
    const {
      formPatch,
      mergeForm,
      name,
      removeErrors
    } = this.props
    const { patch } = this.state

    this.setState({ patch: {} })

    // no need to go further if patch is actually equal to formPatch
    Object.keys(patch).forEach(key => {
      if (formPatch[key] === patch[key]) {
        delete patch[key]
      }
    })
    if (Object.keys(patch).length === 0) {
      return
    }

    removeErrors(name)
    mergeForm(name, patch, config)

  }

  onSubmit = e => {
    e.preventDefault()
    const {
      action,
      formPatch,
      formatPatch,
      handleSuccess,
      name,
      requestData,
      storePath,
    } = this.props

    requestData(
      this.state.method,
      action.replace(/^\//g, ''),
      {
        body: formatPatch(formPatch),
        encode: formPatch instanceof FormData ? 'multipart/form-data' : null,
        handleFail: this.handleFail,
        handleSuccess: this.handleSuccess,
        key: storePath, // key is a reserved prop name
        name,
      }
    )
  }

  handleFail = () => {
    const {
      failNotification,
      failRedirect,
      handleFail,
      history,
      showNotification
    } = this.props
    if (handleFail) {
      handleFail()
      return
    }
    failNotification && showNotification({
      text: failNotification,
      type: 'danger'
    })
    failRedirect && history.push(failRedirect)
  }

  handleSuccess = () => {
    const {
      handleSuccess,
      history,
      successNotification,
      successRedirect,
      showNotification
    } = this.props
    if (handleSuccess) {
      handleSuccess()
      return
    }
    successNotification && showNotification({
      text: successNotification,
      type: 'success'
    })
    successRedirect && history.push(successRedirect)

  }

  childrenWithProps = () => {
    const {
      children,
      formPatch,
      errorsPatch,
      history,
      layout,
      name,
      patch: storePatch,
      readOnly,
      size,
    } = this.props
    const { isEditing } = this.state

    let requiredFields = []

    return recursiveMap(children, c => {
      if (c.type.displayName === 'Field') {
        const patchKey = c.props.patchKey || c.props.name // name is unique, patchKey may not
        const formValue = get(formPatch, patchKey)
        const storeValue = get(storePatch, patchKey)
        const type = c.props.type || 'text'
        const InputComponent = Form.inputsByType[type]
        if (!InputComponent) console.error('Component not found for type:', type)

        const onChange = (value, config) => {
          const newPatch = typeof value === 'object'
            ? value
            : {[patchKey]: value}
          this.setState({
            patch: Object.assign(this.state.patch, newPatch)
          })
          // this.onDebouncedMergeForm() // Not working for now, concurrency issue ...
          this.onMergeForm(config)
        }

        const newChild =  React.cloneElement(c,
          Object.assign({
            errors: [].concat(errorsPatch)
              .filter(e => get(e, c.props.name))
              .map(e => get(e, c.props.name)),
            id: `${name}-${c.props.name}`,
            InputComponent,
            layout,
            onChange,
            patchKey,
            readOnly: c.props.readOnly || readOnly,
            size,
            type,
            value: formValue || storeValue || '',
          },
          get(InputComponent, 'extraFormPatch', [])
            .reduce((result, k) =>
              Object.assign(result, {[k]: get(formPatch, k)}), {}))
        )

        if (newChild.props.required) {
          requiredFields = requiredFields.concat(newChild)
        }

        return newChild
      } else if (c.type.displayName === 'SubmitButton') {
        return React.cloneElement(c, Object.assign({
          name,
          getDisabled: () => {
            if (isEditing) {
              return false
            }
            const missingFields = requiredFields.filter(f =>
              !get(formPatch, f.props.patchKey))
            return missingFields.length > 0
          },
          getTitle: () => {
            const missingFields = requiredFields.filter(f =>
              !get(formPatch, f.props.patchKey))
            if (missingFields.length === 0) return
            return `Champs ${pluralize('non-valide', missingFields.length)} : ${missingFields.map(f => (f.props.label || f.props.title || '').toLowerCase()).join(', ')}`
          }
        }, this.props.TagName !== 'form' ? {
          // If not a real form, need to mimic the submit behavior
          onClick: this.onSubmit,
          type: 'button',
        } : {}))
      } else if (c.type.displayName === 'CancelButton') {
        return React.cloneElement(c, {
          onClick: () => {
            const { to } = c.props
            to && history.push(to)
            this.resetPatch()
          },
          type: 'button' })
      }
      return c
    })
  }

  resetPatch = () => {
    const {
      name,
      patch,
      mergeForm,
      removeErrors
    } = this.props
    removeErrors(name)
    mergeForm(name, patch)
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
    if (!TagName) {
      return this.childrenWithProps()
    }
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

export default compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      formPatch: get(state, `form.${ownProps.name}`),
      errorsPatch: get(state, `errors.${ownProps.name}`),
    }),
    {
      mergeForm,
      removeErrors,
      requestData,
      showNotification
    }
  )
)(Form)
