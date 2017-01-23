import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import AppRouter from 'components/AppRouter'
import appStoreCreate from 'reducers'
import { syncHistoryWithStore } from 'react-router-redux'

//require('scss/main.scss')

const preloadedState = window.__PRELOADED_STATE__ || {}
const store = appStoreCreate(preloadedState);

render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById('root')
)