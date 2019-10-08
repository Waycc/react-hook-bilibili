import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './public/style/global.scss'
import './public/style/normalize.scss'
import * as serviceWorker from './serviceWorker';
import {StoreContext} from 'redux-react-hook';
import store from './redux/store'

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
