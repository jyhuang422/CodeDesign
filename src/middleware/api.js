import { normalize, schema } from 'normalizr'

const API_ROOT = `http://localhost:3000/api/`;

const callApi = (endpoint, apiData, schema) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  const options = apiData || { method: "GET" }

  return fetch(fullUrl, options)
    .then(response => {
      if(response.status == 404) throw new Error('Not Found')
      return response.json().then(json => {
        return normalize(json, schema)
      })
    });
};

export const CALL_API = Symbol('Call API')

const postSchema = new schema.Entity('posts', {}, {idAttribute: '_id'})

export const Schemas = {
    POST: postSchema,
    POSTS: [postSchema]
}


export default store => next => action => {
  const callAPI = action[CALL_API]
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, apiData } = callAPI
  const { schema, types } = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  /*if (!schema) {
    throw new Error('Specify one of the exported Schemas.')
  }*/
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  return callApi(endpoint, apiData, schema).then(
    response => next(actionWith({
      type: successType,
      response
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}