import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CheckboxButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction = ev => {
    const { action } = this.props;
    this.setState(prevState => ({
      disabled: !prevState.disabled
    }));
    action(ev);
  };

  render() {
    const { checkboxData } = this.props;
    const { disabled } = this.state;
    return (
      <button
        className="btn-group-toggle"
        tabIndex="0"
        type="button"
        data-text={checkboxData.text}
        data-toggle="buttons"
        data-payload={checkboxData.payload}
        onClick={this.handleAction}
        onKeyUp={this.handleAction}
        disabled={disabled}
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
  checkboxData: PropTypes.shape({
    checkboxData: PropTypes.string
  }),
  action: PropTypes.func
};

/**
 * Good practices - defaultProps setter.
 */
CheckboxButton.defaultProps = {
  checkboxData: null,
  action: null
};

export default CheckboxButton;
