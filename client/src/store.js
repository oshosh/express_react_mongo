import { createStore, applyMiddleware } from 'redux';
import Reducer from './_reducer'
import ReduxThunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise'
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(Reducer,
    composeWithDevTools(applyMiddleware(promiseMiddleware, ReduxThunk)));

export default store;