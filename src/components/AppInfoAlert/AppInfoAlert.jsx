/* eslint-disable react/destructuring-assignment */
import React from 'react';
import './AppInfoAlert.scss';

class AppInfoAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      alertActive: true
    };
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Closing the alert by conditional rendering on
   * @param  {} e
   */
  handleClick(e) {
    e.preventDefault();
    this.setState({
      alertActive: false
    });
    setInterval(
      () =>
        this.setState({
          clicked: true
        }),
      200
    );
  }

  render() {
    if (this.state.clicked === true) {
      return null;
    }
    return (
      <div
        className={`appinfo d-flex justify-content-center ${
          !this.state.alertActive ? 'appinfo--disabled' : ''
        }`}
      >
        <div className="appinfo__alert alert alert-info alert-dismissible fade show" role="alert">
          <div className="appinfo__row row flex-nowrap align-items-center m-0">
            <div className="appinfo__iconcontainer">
              <i className="fas fa-info-circle icon" />
            </div>
            <div className="appinfo__text">
              <h6 className="alert-heading appinfo__heading">
                Do you need help or have problems with your purchase?
                <br />
                You can ask Mark whatever you need ...
              </h6>
            </div>
          </div>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={this.handleClick}
          >
            <span aria-hidden="true" className="appinfo__close">
              &times;
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default AppInfoAlert;
