import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import AppRouter from 'components/AppRouter'
import {cdeStore} from 'reducers'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

require('scss/main.scss')

const loggerMiddleware = createLogger();

const preloadedState = window.__PRELOADED_STATE__ || {}
const store = createStore(
  cdeStore,
  preloadedState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById('root')
)