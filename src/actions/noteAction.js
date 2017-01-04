import fetch from 'isomorphic-fetch'
import { CALL_API } from 'middleware/api'

export const POSTS_REQUEST = 'POST_REQUEST'
export const POSTS_SUCCESS = 'POST_SUCCESS'
export const POSTS_FAIL = 'POST_FAIL'

export const SELECT_SUBCATEGORY = 'SELECT_SUBCATEGORY'
export const INVALIDATE_SUBCATEGORY = 'INVALIDATE_SUBCATEGORY'


/*function requestPosts(subcategory) {
  return {
    type: REQUEST_POSTS,
    subcategory
  }
}

function receivePosts(subcategory, json) {
  return {
    type: RECEIVE_POSTS,
    subcategory,
    posts: json,
    receivedAt: Date.now()
  }
}*/

const fetchPosts = subcategory => ({
  [CALL_API]: {
    types: [ POSTS_REQUEST, POSTS_SUCCESS, POSTS_FAIL ],
    endpoint: `notes/${subcategory}`,
    subcategory
  }
})

function shouldFetchPosts(state, subcategory) {
  const posts = state.postsBySubcategory[subcategory]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subcategory) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState().notes, subcategory)) {
      return dispatch(fetchPosts(subcategory))
    }
  }
}

export function selectSubcategory(subcategory) {
  return {
    type: SELECT_SUBCATEGORY,
    subcategory
  }
}

export function invalidateSubcategory(subcategory) {
  return {
    type: INVALIDATE_SUBCATEGORY,
    subcategory
  }
}



