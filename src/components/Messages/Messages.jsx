/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import * as Landbot from '@landbot/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import PropTypes from 'prop-types';

import './Messages.scss';

import CheckboxButton from '../CheckboxButton/CheckboxButton';

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
      constant: 1,
      max_delay: 2,
      average_human_reading_speed: 300
    }
  }
});

class Messages extends Component {
  /**
   * Converts special characters to expected HTML
   * @param {String} string - string to replace special characters to html tags
   */
  //  TODO:  add more in case we need them
  static convertToHTMLOnText(string) {
    const myString = string.replace(/\*(.*?)\*/gim, '<b>$1</b>');
    return myString;
  }

  /**
   * Scrolls to the bottom of the messages container.
   * Triggered when component is updated
   * @param  {Object} container
   */
  static scrollToBottom(container) {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }

  /**
   * Prepares message for template. Sets specific properties like 'author'
   * @param {String} message
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
      purchasePayloads: [],
      purchaseText: []
    };
    this.sendMultiAnswer = this.sendMultiAnswer.bind(this);
    this.ckeckboxHandler = this.ckeckboxHandler.bind(this);

    core.init().then(data => {
      const myMessages = Object.values(data.messages)
        .filter(this.messagesFilter)
        .sort((a, b) => a.timestamp - b.timestamp);
      myMessages.forEach((element, index) => {
        const newMessage = Messages.addPropertiesToMessage(element);
        myMessages[index] = newMessage;
      });

      this.setState({
        messages: myMessages
      });
    });

    /**
     * Listener to add new Message
     */
    core.pipelines.$readableSequence.subscribe(message => {
      if (message.type !== 'referral' || (message.type === 'text' && message.mesage.length > 0)) {
        const newMessage = Messages.addPropertiesToMessage(message);
        this.onAddMessage(newMessage);
      }
    });
  }

  /**
   * scroll to bottom when components updates
   */
  componentDidUpdate() {
    const container = document.getElementsByClassName('chatbot__body')[0];
    Messages.scrollToBottom(container);
  }

  /**
   * Adding message to state
   * {Object} - message
   */
  onAddMessage = message => {
    const { messages } = this.state;
    const myMessages = [...messages, message];
    this.setState({ messages: myMessages });
  };

  /**
   * Sends Button Type Message
   * {Object} - event
   */
  sendButtonAnswer = ev => {
    core.sendMessage({
      message: ev.target.dataset.message,
      text: ev.target.dataset.message,
      payload: ev.target.dataset.payload,
      type: 'button'
    });
  };

  /**
   * Basic Messages Filter
   * {Object} - element
   */
  messagesFilter = element =>
    element.type !== 'referral' || (element.type === 'text' && element.mesage.length > 0);

  /**
   * Updates State's PayLoads and Texts from checkboxes
   * {Object} - ev
   */
  ckeckboxHandler = ev => {
    const { purchasePayloads } = this.state;
    const { purchaseText } = this.state;
    let myPayloads = purchasePayloads;
    let mypurchaseText = purchaseText;

    if (myPayloads.indexOf(ev.target.dataset.payload) > -1) {
      myPayloads = myPayloads.filter(item => item !== ev.target.dataset.payload);
      mypurchaseText = mypurchaseText.filter(item => item !== ev.target.dataset.text);
    } else {
      myPayloads.push(ev.target.dataset.payload);
      mypurchaseText.push(ev.target.dataset.text);
    }
    this.setState({ purchasePayloads: myPayloads, purchaseText: mypurchaseText });
  };

  /**
   * sends multi answer message
   */
  sendMultiAnswer() {
    const { purchasePayloads } = this.state;
    const { purchaseText } = this.state;
    const myPayloads = purchasePayloads.toString();
    const myPurchaseText = purchaseText.toString();
    core.sendMessage({
      type: 'button',
      message: myPurchaseText,
      payload: myPayloads,
      text: myPurchaseText
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

  /**
   * Prepares HTML for rendering Basic Messages
   * {Object} - message
   */
  renderTextType = message => (
    <div>
      <p
        data-type={message.type}
        className="messages__text"
        dangerouslySetInnerHTML={{ __html: message.text }}
      />
    </div>
  );

  /**
   * Prepares HTML for rendering Image Messages
   * {Object} - message
   */
  renderImageType = message => (
    <img
      data-type={message.type}
      className="messages__image"
      src={message.url}
      alt={message.text}
    />
  );

  /**
   * Prepares HTML for rendering Video Messages
   * {String} - url
   */
  renderVideoIframeType = url => (
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe
      width="560"
      height="315"
      src={url}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );

  /**
   * Prepares HTML for rendering Multi Buttons Messages
   * {Object} - message
   */
  renderMultiButtonsType = message => {
    const { buttons } = message;
    const { payloads } = message;
    const buttonsPayloads = buttons.map((button, i) => {
      return {
        text: button,
        payload: payloads[i]
      };
    });

    const myButtons = Object.keys(buttonsPayloads).map(key => (
      <CheckboxButton
        action={this.ckeckboxHandler}
        checkboxData={buttonsPayloads[key]}
        key={`button${buttonsPayloads[key].payload + buttonsPayloads[key].text}`}
      />
    ));

    const sendMultiOption = (
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

    const myHTML = (
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

    return myHTML;
  };

  /**
   * Prepares HTML for rendering Buttons Messages
   * {Object} - message
   */
  renderButtonsType = message => {
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
          data-text={buttonsPayloads[key].text}
          data-payload={buttonsPayloads[key].payload}
          onClick={this.updatePayloads}
        >
          {buttonsPayloads[key].text}
        </button>
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

    const myHTML = (
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

    return myHTML;
  };

  render() {
    const { messages } = this.state;

    messages.forEach((message, index) => {
      if (message.type === 'image') {
        messages[index].myHTML = this.renderImageType(messages[index]);
      } else if (
        message.buttons &&
        message.extra &&
        message.extra.buttons &&
        message.extra.buttons.multi === true
      ) {
        messages[index].myHTML = this.renderMultiButtonsType(messages[index]);
      } else if (message.buttons) {
        messages[index].myHTML = this.renderButtonsType(messages[index]);
      } else if (message.type === 'iframe') {
        const youtubeURL = message.message.replace('/watch?v=', '/embed/');
        messages[index].myHTML = this.renderVideoIframeType(youtubeURL);
      } else {
        messages[index].myHTML = this.renderTextType(messages[index]);
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

/**
 * Good practices - propTypes setter.
 */
Messages.propTypes = {
  message: PropTypes.string
};

/**
 * Good practices - defaultProps setter.
 */
Messages.defaultProps = {
  message: null
};

export default Messages;
