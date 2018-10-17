import React, { Fragment, PureComponent } from 'react'

class FileInput extends PureComponent {
  constructor () {
    super()
    this.state = {
      fileName: null
    }
  }

  getFileName(input) {
    if (input.files.length === 0) {
      return ""
    }

    return input.files[0].name
  }

  onChange = event => {
    const { onChange: onFieldChange } = this.props
    event.persist()

    const fileName = this.getFileName(event.target)
    this.setState({ fileName })
    onFieldChange(event.target.files[0], { event })
  }

  render() {
    const { readOnly, uploaded } = this.props
    const { fileName } = this.state

    if (readOnly) {
      return (
        <input className="input" readOnly value={uploaded
        ? "[enregistré]"
        : "[pas enregistré]"}/>
      )
    }

    return (
      <Fragment>
        <label className="button is-primary is-outlined mr12">
          Choisir un {uploaded && 'autre'} fichier{' '}
          <input
            hidden
            onChange={this.onChange}
            ref={$element => (this.$uploadInput = $element)}
            type="file"
          />
        </label>
        <span>
          {fileName}
        </span>
      </Fragment>
    )
  }
}

export default FileInput
