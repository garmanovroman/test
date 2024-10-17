import React from 'react';
import './ie.polyfills';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Router';
import './fonts.css';
import './normalize.css';
import './milligram.min.css';
import './index.css';
import axios from 'axios';
import { globalConfig, globalConfigUrl, defaultConfig } from './configuration/config';
import { Provider } from 'react-redux';
import { store } from './store/store';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker зарегистрирован с областью:', registration.scope);
      })
      .catch((error) => {
        console.error('Регистрация Service Worker не удалась:', error);
      });
  });
}

axios
  .get(`${window.location.origin}/${globalConfigUrl}`)
  .then((response) => {
    globalConfig.config = response.data;
    return App();
  })
  .catch((e) => {
    globalConfig.config = defaultConfig;
    return App();
  })
  .then((reactElement) => {
    console.log(globalConfig.config);
    render(reactElement, document.getElementById('root'));
  });

const App = () => (
  <div>
    <Provider store={store}>
      <Router>
        <Routes />
      </Router>
    </Provider>
  </div>
);
