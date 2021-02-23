'use strict'

import { curry } from 'lodash/fp'
import request from 'got'

const got = request.extend({
  retry: 4
})

const handleError = gotR =>
  gotR.catch(err => {
    console.error(err)
    throw err.response
  })

export const put = curry(async (url, { body, headers }) => {
  return handleError(
    got
      .put(url, {
        headers,
        json: body
      })
      .json()
  )
})

export const post = curry(async (url, { body, headers }) => {
  return handleError(
    got
      .post(url, {
        headers,
        json: body
      })
      .json()
  )
})

export const get = curry(async (url, options) => {
  return handleError(got.get(url, options).json())
})

export default got
