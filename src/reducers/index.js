import { combineReducers } from 'redux'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import {browserHistory} from 'react-router'
import notes from 'reducers/note'
import api from 'middleware/api'

const index = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

const aboutme = (state = {}, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const cdeStore = combineReducers({
  index,
  notes,
  aboutme,
  routing: routerReducer
})

const loggerMiddleware = createLogger()
const routerHistoryMiddleware = routerMiddleware(browserHistory)

const appStoreCreate = function(preloadedState) {
  return createStore(
    cdeStore,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      api,
      routerHistoryMiddleware,
      loggerMiddleware
    )
  )
}

export default appStoreCreate;