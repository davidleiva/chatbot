import React from 'react';
import './ChatBot.scss';

import Messages from '../Messages/Messages';

class ChatBot extends React.Component {
  constructor() {
    super();
    this.state = {
      newMessage: '',
      disabled: true
    };
    this.onSendNewMessage = this.onSendNewMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.myMessages = React.createRef();
  }

  /**
   * Triggers Messages.sendMessage()
   * @param {Object} event
   */
  onSendNewMessage = e => {
    e.preventDefault();
    this.myMessages.current.sendMessage();
    this.setState({
      disabled: true,
      newMessage: ''
    });
  };

  /**
   * Function Triggered when input text is changed so we can creste and update Custom State property
   * @param {Object} target
   */
  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
      disabled: false
    });
  }

  render() {
    const { disabled } = this.state;
    const { newMessage } = this.state;
    return (
      <div className="chatbot__wrapper d-flex">
        <div className="chatbot__container">
          <div className="chatbot__header">
            <div className="chatbot__avatarcontainer">
              <div className="chatbot__avatar">
                <img src="/img/mark-avatar.png" alt="Mark's Avatar - Ikea's assistant" />
              </div>
              <div className="chatbot__avatartext">
                <p className="chatbot__avatartalkingto">
                  <em>You&apos;re talking to</em>
                </p>
                <h6 className="chatbot__avatarname verdana font-weight-bold">Mark</h6>
              </div>
            </div>
          </div>
          <Messages ref={this.myMessages} message={newMessage} />
          <div className="chatbot__footer">
            <div className="chatbot__footerinput input-group">
              <input
                name="newMessage"
                value={newMessage}
                onChange={this.handleChange}
                type="text"
                className="chatbot__footerinput form-control"
                placeholder="Type you message here ..."
                aria-label="Type you message here ..."
                aria-describedby="button-addon2"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  id="button-addon2"
                  disabled={disabled === true}
                  onClick={this.onSendNewMessage}
                >
                  <span className="d-none">Button</span>
                  <i className="fas fa-paper-plane" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatBot;
