'use strict'

import errors from '../lib/errors'
import errorMap, { httpStatusCodes } from './error-handler'
import middlewareCreator from './middlewares'

const requestHandler = ({ handler, method = 'GET', middleware, allowAllMethods = false }) => async (
  req,
  res
) => {
  try {
    if (!allowAllMethods) {
      if (method !== req.method && req.method !== 'OPTIONS') {
        throw errors.throwError({
          name: errors.RequestNotFound,
          message: 'not found'
        })
      }
    }
    await middlewareCreator(middleware)(req, res)
    if (req.method === 'OPTIONS') return
    await handler(req, res)
  } catch (error) {
    console.log(error, req.method)
    error.status = errorMap[error.name]
    const {
      code,
      details,
      name,
      message,
      status: statusCode = httpStatusCodes.INTERNAL_SERVER_ERROR
    } = error
    return res.status(statusCode).json(
      statusCode === 500
        ? { error: { message: 'An error occurred', code: 500 } }
        : {
          error: {
            code,
            details,
            message,
            name
          }
        }
    )
  }
}

export default requestHandler
