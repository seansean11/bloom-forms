import React from 'react';
import PropTypes from 'prop-types';

import { requiredPropsLogger } from '../required-props-logger'

import '../styles/inputs.scss';
import '../styles/checkbox.scss';

class Checkbox extends React.Component {
  componentDidMount() {
    const requiredProps = ['checked', 'label', 'name']
    const recommendedProps = ['onChange']

    requiredPropsLogger(this.props, requiredProps, recommendedProps)
  }

  render() {
    let {
      checked, className, error, formData,
      name, label, labelClass,
      showLabel, showLabelBeforeCheckbox,
      validateAs, ...props } = this.props;
    let labelTextClasses = `Input-label-text ${ labelClass ? labelClass : '' } ${ showLabel ? '' : ' u-sr-only' }`;
    let attr = {}

    if (props.required) {
      attr['aria-required'] = true;
      attr.required = true;
    }

    let err = error
    if (Object.keys(this.props).indexOf('checked') === -1 && formData && (Object.keys(formData).indexOf(name) > -1)) {
      attr.checked = formData[name].value
      err = formData[name].error || error
    } else {
      attr.checked = checked
    }

    if (!props.onChange) {
      attr.readOnly = true
    }

    const labelText = (
      <span className={ labelTextClasses }>
        { label }{ attr.required && <span>{ '\u00A0' }*<span className='u-sr-only'> required field</span></span> }
      </span>
    )

    return (
      <label style={{paddingBottom: '2px'}} className='Input-label Input-label--inline Input--checkbox'
        id={ `${name}-label` }>
        { showLabelBeforeCheckbox && labelText }
        <div className={ `non-sr-only Input--checkbox-placeholder ${ attr.checked ? 'glyphicon glyphicon-ok is-checked' : '' }` }></div>
        <input
          className={ `u-sr-only Input Input--text ${ className ? className : '' } ${ err ? 'Input--invalid' : '' }` }
          data-validate={ validateAs }
          id={ name }
          name={ name } onChange={ props.onChange }
          type='checkbox' { ...attr } />
        { !showLabelBeforeCheckbox && labelText }
        { err &&
          <div className='Input-error'>{ err }</div>
        }
      </label>
    )
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
  formData: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
  labelClass: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,
  showLabelBeforeCheckbox: PropTypes.bool,
  validateAs: PropTypes.string
};

export default Checkbox;
