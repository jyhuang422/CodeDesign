import fetch from 'isomorphic-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
function requestPosts(subcategory) {
  return {
    type: REQUEST_POSTS,
    subcategory
  }
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
function receivePosts(subcategory, json) {
  return {
    type: RECEIVE_POSTS,
    subcategory,
    posts: json,
    receivedAt: Date.now()
  }
}

export function fetchPosts(subcategory) {

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestPosts(subcategory))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(`http://localhost:3000/${subcategory}.json`)
      .then(response => {
        return response.json()
      }).then(json =>

        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receivePosts(subcategory, json))
      )

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}

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


export const SELECT_SUBCATEGORY = 'SELECT_SUBCATEGORY'
export function selectSubcategory(subcategory) {
  return {
    type: SELECT_SUBCATEGORY,
    subcategory
  }
}

export const INVALIDATE_SUBCATEGORY = 'INVALIDATE_SUBCATEGORY'
export function invalidateSubcategory(subcategory) {
  return {
    type: INVALIDATE_SUBCATEGORY,
    subcategory
  }
}



