import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CheckboxButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  render() {
    const { checkboxData } = this.props;
    const { checked } = this.state;
    return (
      <button
        className="btn-group-toggle"
        tabIndex="0"
        checked={checked}
        key={`button${checkboxData.payload}`}
        type="button"
        data-text={checkboxData.text}
        data-toggle="buttons"
        data-payload={checkboxData.payload}
        onClick={this.updatePayloads}
        onKeyUp={this.updatePayloads}
      >
        {checkboxData.text}
      </button>
    );
  }
}

/**
 * Good practices - propTypes setter.
 */
CheckboxButton.propTypes = {
  checkboxData: PropTypes.objectOf
};

/**
 * Good practices - defaultProps setter.
 */
CheckboxButton.defaultProps = {
  checkboxData: null
};

export default CheckboxButton;
