import fetch from 'isomorphic-fetch'
import { CALL_API, Schemas } from 'middleware/api'

export const POSTS_REQUEST = 'POSTS_REQUEST'
export const POSTS_SUCCESS = 'POSTS_SUCCESS'
export const POSTS_FAIL = 'POSTS_FAIL'

const fetchPosts = subcategory => ({
  [CALL_API]: {
    types: [ POSTS_REQUEST, POSTS_SUCCESS, POSTS_FAIL ],
    endpoint: `notes/${subcategory}`,
    schema: Schemas.POSTS,
  },
  subcategory
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

export const POST_REQUEST = 'POST_REQUEST'
export const POST_SUCCESS = 'POST_SUCCESS'
export const POST_FAIL = 'POST_FAIL'

const fetchPost = id => ({
  [CALL_API]: {
    types: [ POST_REQUEST, POST_SUCCESS, POST_FAIL ],
    endpoint: `note/${id}`,
    schema: Schemas.POST,
  },
  id
})

function shouldFetchPost(state, id) {
  const post = state.entities.posts ? state.entities.posts[id] : null
  if (!post) {
    return true
  } else if (post.isFetching) {
    return false
  } else {
    return post.didInvalidate
  }
}

export function fetchPostIfNeeded(id) {
  return (dispatch, getState) => {
    if (shouldFetchPost(getState().notes, id)) {
      return dispatch(fetchPost(id))
    }
  }
}


export const POST_CREATE_REQUEST = 'POST_CREATE_REQUEST'
export const POST_CREATE_SUCCESS = 'POST_CREATE_SUCCESS'
export const POST_CREATE_FAIL = 'POST_CREATE_FAIL'

export const createPost = (data) => {
  const updatedFields = {
    title: data.updatedTitle,
    content: data.updatedContent,
    subcategory: data.updatedSubcategory || ['code'],
    updatedTime: Date.now()
  }
  return {
    [CALL_API]: {
      types: [POST_CREATE_REQUEST, POST_CREATE_SUCCESS, POST_CREATE_FAIL],
      endpoint: `note/`,
      schema: Schemas.POST,
      apiData: {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      }
    },
    subcategory: updatedFields.subcategory
  }
}


export const POST_UPDATE_REQUEST = 'POST_UPDATE_REQUEST'
export const POST_UPDATE_SUCCESS = 'POST_UPDATE_SUCCESS'
export const POST_UPDATE_FAIL = 'POST_UPDATE_FAIL'
export const POST_UPDATE_NOCHANGE = 'POST_UPDATE_NOCHANGE'

const updatePost = (id, data) => ({
  [CALL_API]: {
    types: [POST_UPDATE_REQUEST, POST_UPDATE_SUCCESS, POST_UPDATE_FAIL],
    endpoint: `note/${id}`,
    schema: Schemas.POST,
    apiData: {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  },
  id
})

function getUpdatedPost(state, id, data) {
  const origPost = state.entities.posts[id]
  let updatedFields = {}
  if(data.updatedTitle && origPost.title !== data.updatedTitle) updatedFields.title = data.updatedTitle
  if(data.updatedContent && origPost.Content !== data.updatedContent) updatedFields.content = data.updatedContent
  
  return updatedFields
}

export function updatePostNoChange(id) {
  return {
    type: POST_UPDATE_NOCHANGE,
    id
  }
}

export function updatePostIfNeeded(id, data) {
  return (dispatch, getState) => {
    const updatedFields = getUpdatedPost(getState().notes, id, data)
    if(Object.keys(updatedFields).length > 0) {
      updatedFields.updatedTime = Date.now()
      return dispatch(updatePost(id, updatedFields))
    } else {
      return dispatch(updatePostNoChange(id))
    }
  }
}

export const ADD_NEW_POST = 'ADD_NEW_POST'
export function addNewPost() {
  return {
    type: ADD_NEW_POST
  }
}

export const POST_DELETE_REQUEST = 'POST_DELETE_REQUEST'
export const POST_DELETE_SUCCESS = 'POST_DELETE_SUCCESS'
export const POST_DELETE_FAIL = 'POST_DELETE_FAIL'

export const deletePost = (id, subcategory) => ({
  [CALL_API]: {
    types: [POST_DELETE_REQUEST, POST_DELETE_SUCCESS, POST_DELETE_FAIL],
    endpoint: `note/${id}`,
    schema: Schemas.POST,
    apiData: {
      method: "DELETE"
    }
  },
  id,
  subcategory
})


export const SELECT_SUBCATEGORY = 'SELECT_SUBCATEGORY'
export const SELECT_POST = 'SELECT_POST'
export const EDITOR_CHANGE = 'EDITOR_CHANGE'
export const INVALIDATE_SUBCATEGORY = 'INVALIDATE_SUBCATEGORY'
export const EDIT_POST = 'EDIT_POST'

export function selectSubcategory(subcategory) {
  return {
    type: SELECT_SUBCATEGORY,
    subcategory
  }
}

export function selectPost(id) {
  return {
    type: SELECT_POST,
    id
  }
}

export function editorChange(editorState) {
  return {
    type: EDITOR_CHANGE,
    editorState
  }
}

export function invalidateSubcategory(subcategory) {
  return {
    type: INVALIDATE_SUBCATEGORY,
    subcategory
  }
}

export function editPost(id) {
  return {
    type: EDIT_POST,
    id
  }
}



