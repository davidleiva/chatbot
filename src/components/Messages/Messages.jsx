/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as Landbot from '@landbot/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import './Messages.scss';

const core = new Landbot.Core({
  firebase,
  brandID: 8662,
  channelToken: 'H-199805-UM74VH86ENOUE8HW',
  welcomeUrl: 'https://welcome.landbot.io/',
  welcome: [
    {
      samurai: -1,
      type: 'text',
      message: 'Type something to start a conversation with this landbot.'
    }
  ],
  typing_options: {
    block_custom: false,
    delay: {
      is_constant: true,
      constant: 0.5,
      max_delay: 2,
      average_human_reading_speed: 300
    }
  }
});

class Messages extends Component {
  /**
   *
   * @param {String} string - string to replace special characters to html tags
   */
  //  TODO:  add more cases in cas we need them
  static convertToHTMLOnText(string) {
    const myString = string.replace(/\*(.*?)\*/gim, '<b>$1</b>');
    return myString;
  }

  /**
   * Scrolls to the bottom of the messages container.
   * Triggered when component is updated
   * @param  {} container
   */
  static scrollToBottom(container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }

  /**
   * Prepares message for template. Sets specific properties like 'author'
   * @param  {} message
   */
  static addPropertiesToMessage(message) {
    const newMessage = message;
    newMessage.text = message.title || message.message;
    newMessage.text = Messages.convertToHTMLOnText(newMessage.text);
    newMessage.author = message.samurai !== undefined ? 'bot' : 'user';
    return newMessage;
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      payloads: []
    };
    this.sendMultiAnswer = this.sendMultiAnswer.bind(this);

    core.init().then(data => {
      const myMessages = Object.values(data.messages)
        .filter(this.messagesFilter)
        .sort((a, b) => a.timestamp - b.timestamp);
      myMessages.forEach((element, index) => {
        const newMessage = Messages.addPropertiesToMessage(element);
        if (newMessage.type === 'dialog') {
          console.log(newMessage);
        }
        myMessages[index] = newMessage;
      });

      this.setState({
        messages: myMessages
      });
    });

    core.pipelines.$readableSequence.subscribe(message => {
      if (message.type !== 'referral' || (message.type === 'text' && message.mesage.length > 0)) {
        const newMessage = Messages.addPropertiesToMessage(message);
        this.onAddMessage(newMessage);
      }
    });
  }

  componentDidUpdate() {
    const container = document.getElementsByClassName('chatbot__body')[0];
    Messages.scrollToBottom(container);
  }

  onAddMessage = message => {
    const { messages } = this.state;
    const myMessages = [...messages, message];
    this.setState({ messages: myMessages });
  };

  sendButtonAnswer = ev => {
    core.sendMessage({
      message: ev.target.dataset.message,
      text: ev.target.dataset.message,
      payload: ev.target.dataset.payload,
      type: 'button'
    });
  };

  messagesFilter = element =>
    element.type !== 'referral' || (element.type === 'text' && element.mesage.length > 0);

  updatePayloads = ev => {
    const { payloads } = this.state;
    const myPayloads = payloads;

    if (Object.values(myPayloads).indexOf(ev.target.dataset.payload) > -1) {
      myPayloads.remove(ev.target.dataset.payload);
    } else {
      myPayloads.push(ev.target.dataset.payload);
    }
    this.setState({
      payloads: myPayloads
    });
    console.log(this.state.payloads);
  };

  sendMultiAnswer() {
    const { payloads } = this.state;
    console.log(payloads);
    core.sendMessage({
      type: 'button',
      message: 'Nice',
      payload: ['$0', '$1'],
      text: 'Nice'
    });
  }

  /**
   * sends message coming from props on parent component
   */
  sendMessage() {
    const { message } = this.props;
    const mymessage = message;
    core.sendMessage({ message: mymessage });
  }

  render() {
    const { messages } = this.state;
    messages.forEach((message, index) => {
      if (message.type === 'image') {
        messages[index].myHTML = (
          <img
            data-type={message.type}
            className="messages__image"
            src={message.url}
            alt={message.text}
          />
        );
      } else if (message.buttons) {
        const { buttons } = message;
        const { payloads } = message;
        let sendMultiOption = null;
        const buttonsPayloads = buttons.map((button, i) => {
          return {
            text: button,
            payload: payloads[i]
          };
        });
        let myButtons = null;
        if (message.extra && message.extra.buttons && message.extra.buttons.multi === true) {
          myButtons = Object.keys(buttonsPayloads).map(key => (
            <button
              className="btn-group-toggle"
              key={`button${buttonsPayloads[key].payload}`}
              type="button"
              data-payload={buttonsPayloads[key].payload}
              onClick={this.updatePayloads}
            >
              {buttonsPayloads[key].text}
            </button>
            // <div
            //   className="btn-group-toggle"
            //   role="button"
            //   tabIndex={0}
            //   onKeyUp={this.sendMultiAnswer}
            //   key={`button${buttonsPayloads[key].payload}`}
            //   data-toggle="buttons"
            // >
            //   <label
            //     htmlFor={`input${buttonsPayloads[key].payload}`}
            //     className="btn btn-lg btn-info messages__checkboxcontainer"
            //   >
            //     <input
            //       className="messages__checkbox"
            //       id={`input${buttonsPayloads[key].payload}`}
            //       type="checkbox"
            //       autoComplete="off"
            //     />
            //     {buttonsPayloads[key].text}
            //   </label>
            // </div>
          ));
          sendMultiOption = (
            <div className="d-flex justify-content-end">
              <button
                className="messages__button messages__sendanswers btn btn-lg btn-info"
                type="button"
                onClick={this.sendMultiAnswer}
              >
                Send answer
              </button>
            </div>
          );
        } else {
          myButtons = Object.keys(buttonsPayloads).map(key => (
            <button
              data-type={message.type}
              className="messages__button btn btn-lg btn-info"
              type="button"
              key={`button${buttonsPayloads[key].payload}`}
              data-message={buttonsPayloads[key].text}
              data-payload={buttonsPayloads[key].payload}
              onClick={this.sendButtonAnswer}
            >
              {buttonsPayloads[key].text}
            </button>
          ));
        }

        messages[index].myHTML = (
          <div className="w-100">
            <p
              data-type={message.type}
              className="messages__text"
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
            <div className="messages__buttons">{myButtons}</div>
            {sendMultiOption}
          </div>
        );
      } else if (message.type === 'iframe') {
        const youtubeURL = message.message.replace('/watch?v=', '/embed/');
        messages[index].myHTML = (
          // eslint-disable-next-line jsx-a11y/iframe-has-title
          <iframe
            width="560"
            height="315"
            src={youtubeURL}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else {
        messages[index].myHTML = (
          <p
            data-type={message.type}
            className="messages__text"
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        );
      }
    });
    const messageItems = messages.map(message => (
      <article data-author={message.author} className="messages__message" key={message.key}>
        {message.myHTML}
      </article>
    ));
    return <div className="chatbot__body">{messageItems}</div>;
  }
}

Messages.propTypes = {
  message: PropTypes.string
};

Messages.defaultProps = {
  message: null
};

export default Messages;
