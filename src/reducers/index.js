import { combineReducers } from 'redux'
import { NAV_TO } from 'actions'
import { routerReducer } from 'react-router-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'


const pageData = {
  current: 'index',
  pages: {
    'index': {},
    'note': {},
    'aboutme': {}
  }
};

const page = (state = pageData, action) => {
  switch (action.type) {
    case NAV_TO:
      let actionId = action.id || 'index';
      window.history.pushState({current: actionId}, 'change', actionId)
      return Object.assign({}, pageData, {current: action.id})
    default:
      return state
  }
}

export const cdeStore = combineReducers({
  page,
  routing: routerReducer
})

const loggerMiddleware = createLogger()

const preloadedState = typeof(window) !== 'undefined' ? window.__PRELOADED_STATE__ : {};

const store = createStore(
  cdeStore,
  preloadedState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

export default store;