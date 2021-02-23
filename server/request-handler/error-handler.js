'use strict'

import errors from '../lib/errors'

export const httpStatusCodes = {
  OK: 200,
  CREATED: 201,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORISED: 401,
  TOO_MANY_REQUESTS: 429,
  SERVICE_UNAVAILABLE: 503,
  UNPROCESSABLE_ENTITY: 401,
  INTERNAL_SERVER_ERROR: 500
}

export default {
  [errors.InvalidHmacError]: httpStatusCodes.FORBIDDEN,
  [errors.LimitNotANumber]: httpStatusCodes.INTERNAL_SERVER_ERROR,
  [errors.MissingFunctionParamError]: httpStatusCodes.BAD_REQUEST,
  [errors.ResourceDoesNotExistsError]: httpStatusCodes.BAD_REQUEST,
  [errors.ValidationError]: httpStatusCodes.BAD_REQUEST,
  [errors.RequestNotFound]: httpStatusCodes.NOT_FOUND,
  [errors.UserAlreadyExistsError]: httpStatusCodes.BAD_REQUEST,
  [errors.InvalidUserOrPasswordError]: httpStatusCodes.FORBIDDEN,
  [errors.InvalidTokenError]: httpStatusCodes.UNAUTHORISED,
  [errors.ResourceAlreadyExistsError]: httpStatusCodes.FORBIDDEN
}
