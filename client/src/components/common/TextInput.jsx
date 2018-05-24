import React from 'react';
import PropTypes from 'prop-types';
import Display from './Display';

const TextInput = ({
  name, type, value, required, className, onChange, error, placeholder,
}) => (
    <div>
      <Display check={placeholder}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required={required}
          className={className}
          onChange={onChange}
          placeholder={placeholder} />
      </Display>
      <Display check={!placeholder}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required={required}
          className={className}
          onChange={onChange} />
      </Display>
      {error && <span className="red-text errors" id={`${name}-error`}>{error}</span>}
    </div>
);

// set proptypes
TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
};

// set default values for non required props
TextInput.defaultProps = {
  required: false,
  error: '',
  placeholder: '',
};

export default TextInput;