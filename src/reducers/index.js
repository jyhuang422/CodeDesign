import { combineReducers } from 'redux'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {browserHistory} from 'react-router'

const pageData = {
  'index': {},
  'note': {},
  'aboutme': {}
};

const page = (state = pageData, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const cdeStore = combineReducers({
  page,
  routing: routerReducer
})

const loggerMiddleware = createLogger()
//const routerHistoryMiddleware = routerMiddleware(browserHistory)

const appStoreCreate = function(preloadedState) {
  return createStore(
    cdeStore,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
      //routerHistoryMiddleware
    )
  )
}

export default appStoreCreate;