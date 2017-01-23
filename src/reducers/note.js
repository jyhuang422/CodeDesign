import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
  SELECT_SUBCATEGORY, INVALIDATE_SUBCATEGORY,
  POSTS_REQUEST, POSTS_SUCCESS, POSTS_FAIL,
  POST_SUCCESS, EDIT_POST,
  POST_UPDATE_SUCCESS, POST_UPDATE_NOCHANGE,
  SELECT_POST, ADD_NEW_POST, POST_CREATE_SUCCESS,
  POST_DELETE_SUCCESS
} from '../actions/noteAction'

import deepAssign from 'deep-assign';
//import { reducer as formReducer } from 'redux-form'
import { modelReducer, formReducer, modeled, actionTypes } from 'react-redux-form';


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
      return {
        ...state,
        didInvalidate: true
      }
    case POSTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.response.result,
        lastUpdated: Date.now()//action.receivedAt
      }
    case POST_CREATE_SUCCESS:
      return {
        ...state,
        items: [...state.items, action.response.result],
        lastUpdated: Date.now()
      }
    case POST_DELETE_SUCCESS:
      let id = action.response.result
      let index = state.items.indexOf(id)
      state.items.splice(index, 1)
      return {
        ...state,
        items: state.items,
        lastUpdated: Date.now()
      }
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

function entities(state = {}, action) {
    switch (action.type) {
      case INVALIDATE_SUBCATEGORY:
      case POSTS_SUCCESS:
      case POST_SUCCESS:
      case POST_UPDATE_SUCCESS:
      case POST_CREATE_SUCCESS:
        if(action.response && action.response.entities) {
          return deepAssign({}, state, {
            posts: action.response.entities.posts
          })
        }
      case POST_DELETE_SUCCESS:
        return state
      default:
        return state
    }
}

function postsBySubcategory(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBCATEGORY:
    case POSTS_REQUEST:
    case POSTS_SUCCESS:
      return {
        ...state,
        [action.subcategory]: posts(state[action.subcategory], action)
      }
    case POST_CREATE_SUCCESS:
    case POST_DELETE_SUCCESS:
      let updated = {}
      action.subcategory.forEach((ctg) => {
        updated[ctg] = posts(state[ctg], action)
      })
      return {
        ...state,
        ...updated
      }
    default:
      return state
  }
}

function selectedPost(state = {}, action) {
  switch (action.type) {
    case POST_UPDATE_SUCCESS:
    case POST_UPDATE_NOCHANGE:
    case POST_SUCCESS:
    case SELECT_POST:
      return {
        id: action.id,
        isNewPost: false,
        isEditing: false
      }
    case EDIT_POST:
      return {
        ...state,
        id: action.id,
        isNewPost: false,
        isEditing: true
      }
    case ADD_NEW_POST:
      return {
        id: null,
        isEditing: true,
        isNewPost: true,
        updatedTitle: "",
        updatedContent: ""
      }
    case POST_CREATE_SUCCESS:
      return {
        ...state,
        id: action.response.result,
        isCreated: true,
        isNewPost: false,
        isEditing: false
      }
    case POST_DELETE_SUCCESS:
      return {
        id: action.response.result,
        isDeleted: true
      }
    case actionTypes.CHANGE:
      switch(action.model) {
        case 'noteModel.title':
          return {
            ...state,
            updatedTitle: action.value
          }
        case 'noteModel.content':
          return {
            ...state,
            updatedContent: action.value
          }
        default:
          return state
      }
    default:
      return state
  }
}

const notes = combineReducers({
  postsBySubcategory,
  selectedSubcategory,
  entities,
  selectedPost
  //form: formReducer
  //routing: routerReducer
})

export default notes