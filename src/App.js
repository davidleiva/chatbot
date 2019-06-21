import React from 'react';
import './App.scss';
// import AppInfoAlert from './components/AppInfoAlert/AppInfoAlert';
import ChatBot from './components/ChatBot/ChatBot';

export const App = () => {
  return (
    <div className="container app__container">
      <header className="header__wrapper d-flex justify-content-center align-items-stretch">
        <img className="header__logo" src="/img/ikea-logo.svg" alt="Ikea's Logo" />
        <p className="lead w-100 text-center verdana">
          Thanks
          <span> for your purchase!</span>
        </p>
        <p>
          Do you have any problem?
          <b> ask our assistant</b>
        </p>
      </header>
      {/* <AppInfoAlert /> */}
      <ChatBot />
    </div>
  );
};

export default App;
