import { combineReducers } from 'redux'
import {
  SELECT_SUBCATEGORY, INVALIDATE_SUBCATEGORY,
  POSTS_REQUEST, POSTS_SUCCESS, POSTS_FAIL
} from '../actions/noteAction'

const deepAssign = require('deep-assign');


function selectedSubcategory(state = 'code', action) {
  switch (action.type) {
    case SELECT_SUBCATEGORY:
      return action.subcategory
    default:
      return state
  }
}

function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_SUBCATEGORY:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case POSTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case POSTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: Object.keys(action.posts),
        lastUpdated: Date.now()//action.receivedAt
      })
    default:
      return state
  }
}

const testdata = {
    selectedSubcategory: 'code',
    entities: {
        authors: {
            1: {
                id: 1,
                name: 'jyhuang'
            }
        },
        posts: {}
    },
    postsByCategory: {
        code: {
            isFetching: false,
            didInvalidate: false,
            items: []
        },
        design: {
            isFetching: false,
            didInvalidate: false,
            items: []
        }
    }
}

function entities(state = {authors: {}, posts: {}}, action) {
    if(action.posts) {
      return deepAssign({}, state, {
        posts: action.posts
      })
    }
    return state
}

function postsBySubcategory(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBCATEGORY:
    case POSTS_REQUEST:
    case POSTS_SUCCESS:
      return Object.assign({}, state, {
        [action.subcategory]: posts(state[action.subcategory], action)
      })
    default:
      return state
  }
}

const notes = combineReducers({
  postsBySubcategory,
  selectedSubcategory,
  entities
})

export default notes