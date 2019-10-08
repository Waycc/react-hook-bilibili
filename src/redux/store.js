import {applyMiddleware, createStore, compose} from "redux";
import reducer from './reducers'
import mySaga from './saga/index'
import createSagaMiddleware from 'redux-saga'

let sagaMiddleware = createSagaMiddleware();
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
  )

sagaMiddleware.run(mySaga);
