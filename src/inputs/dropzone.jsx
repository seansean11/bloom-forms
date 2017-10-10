import React from 'react'
import PropTypes from 'prop-types'

import '../styles/dropzone'

const docDrop = (e) => {
  e.preventDefault();
}

// simplified from react-dropzone
class MyDropzone extends React.Component {
  state = {
    loading: false
  }

  clearAll = (e) => {
    console.log('triggering clear all');
    if (e) {
      e.preventDefault();
    }

    this.props.onChange(this.props.formId, this.props.name, [], 'file');
  }

  onDrop = (e) => {
    e.preventDefault();
    const items = this.getDataTransferItems(e)

    if (!this.state.loading) {
      this.setState({
        loading: true
      })
    }

    if (items[0] && items[0].name) {
      this.setState({
        loading: false
      })
    }

    if (items[0] && items[0].name && items[0].type) {
      this.props.onChange(this.props.formId, this.props.name, items, 'file');
    }
  }

  getDataTransferItems(event) {
    let dataTransferItemsList = []
    if (event.dataTransfer) {
      const dt = event.dataTransfer
      if (dt.files && dt.files.length) {
        dataTransferItemsList = dt.files
      } else if (dt.items && dt.items.length) {
        // During the drag even the dataTransfer.files is null
        // but Chrome implements some drag store, which is accesible via dataTransfer.items
        dataTransferItemsList = dt.items
      }
    } else if (event.target && event.target.files) {
      dataTransferItemsList = event.target.files
    }
    // Convert from DataTransferItemsList to the native Array
    return [...dataTransferItemsList]
  }

  triggerInput = (e) => {
    console.log(e.target)
    if (e.target.id === `dropzone-${name}-clear-btn`) {
      e.preventDefault();
      this.clearAll();
      return;
    }
    let input = document.getElementById(this.props.name);
    if (e.target.getAttribute('type') === 'file') {
      return;
    }
    e.preventDefault();
    input.click();
  }

  componentDidMount() {
    document.addEventListener('dragover', docDrop, false)
    document.addEventListener('drop', this.onDrop, false)
  }

  componentWillUnmount() {
    document.removeEventListener('dragover', docDrop)
    document.removeEventListener('drop', this.onDrop)
  }

  render() {
    const { accept, files, imageStyle, label, loadingElement, name, onDrop, required } = this.props
    const dropZoneStyle = {
      border: '2px dashed #ddd',
      borderRadius: '5px',
      color: '#ddd',
      height: '310px',
      marginBottom: '0',
      marginTop: '2px',
      minHeight: '100px',
      overflow: 'hidden',
      padding: '20px',
      position: 'relative',
      width: '100%'
    }
    let requiredString = ''
    let attr = {}

    if (required) {
      requiredString = (<span>{ '\u00A0' }*<span className="u-sr-only"> required field</span></span>)
      attr['required'] = true
      attr['aria-required'] = 'true'
    }

    const defaultImageStyle = {
      height: 'auto',
      margin: '0 auto',
      maxHeight: '150px',
      maxWidth: '200px',
      minHeight: '100px',
      minWidth: '100px',
      objectFit: 'contain',
      overflow: 'hidden',
      width: `${ 1 / (files.length || 1) * 100 }%`
    }

    // const imagePreview = this.state.previews && this.state.previews[0]
    //   ? this.state.previews.map((img, i) => <img key={ `preview-image-${i}` } className='upload-img' src={ img } style={ imageStyle || defaultImageStyle } />)
    //   : null

    // console.log(files)

    const imagePreview = files && files[0]
      ? (
        files.map((item, i) => {
          if (item.type && item.type.includes('image')) {
            let src = URL.createObjectURL(item)
            return (
              <li key={ `preview-image-${name}-${i}` } className={ `preview upload-file upload-file--${ item.type }` }
                style={ { maxWidth: defaultImageStyle.width, minWidth: '150px' } }>
                <img className='upload-img' src={ src }
                  style={ imageStyle || defaultImageStyle } alt={ item.name }
                />
                <span className='upload-name'>
                  { item.name }
                </span>
              </li>
            )
          } else {
            return (
              <li className={ `preview upload-file upload-file--${ item.type }` } key={ `preview-image-${name}-${i}` }
                style={ { maxWidth: defaultImageStyle.width } }>
                <img role='presentation' aria-hidden style={ imageStyle || defaultImageStyle } />
                <span className='upload-name'>
                  { item.name }
                </span>
              </li>
            )
          }
        })
      ) : null

    return (
      <label className='input__label drop-zone'>
        { label }{ requiredString }
        <div onDragOver={ this.onDrop } multiple={ false } onClick={ this.triggerInput } style={ dropZoneStyle } className='drop-zone__box input--file'>
          <div aria-hidden role='presentation'>

            { imagePreview
              ? <ul className='preview-container'>
                  { imagePreview }
                </ul>
              : (
                <span>
                  <p className='u-text-center'>
                    Drag image or click here to select
                    { this.state.loading && (loadingElement ? loadingElement : 'Loading...') }
                  </p>
                  { accept && <p className='u-text-center'>Only ${ accept } type files accepted.</p> }
                </span>
              )
            }
            </div>
          <input type='file' className='u-sr-only' id={ name } onChange={ this.onDrop } multiple accept={ accept } />
        </div>
        <button className='btn' id={ `dropzone-${name}-clear-btn` } onClick={ this.clearAll }>
          Clear All
        </button>
      </label>
    )
  }
}

MyDropzone.propTypes = {
  accept: PropTypes.string,
  files: PropTypes.arrayOf( PropTypes.object ),
  imageStyle: PropTypes.object,
  label: PropTypes.string.isRequired,
  loadingElement: PropTypes.element,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool
}

export default MyDropzone;

