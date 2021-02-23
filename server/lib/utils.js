'use strict'
import { curry } from 'lodash/fp'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import util from 'util'
import { serialize } from 'cookie'
import crypto from 'crypto'
import config from '../config'
import errors from './errors'

const cookieName = 'digistore_frontent'

const signJwtPromise = util.promisify(jwt.sign)
const verifyJwtPromise = util.promisify(jwt.verify)

const saltRounds = 10
const jwtAlgorithm = 'HS256'

export const required = data => {
  throw errors.throwError({
    name: errors.MissingFunctionParamError,
    message: `${data} is required`
  })
}

export const createHmac = ({
  secret,
  data,
  algorithm = 'sha256',
  digest = 'hex'
}) =>
  crypto
    .createHmac(algorithm, secret)
    .update(Buffer.from(data), 'utf8')
    .digest(digest)

export const createMd5Hash = (data = '') => crypto.createHash('md5').update(Buffer.from(data)).digest("hex");

export const validate = curry((schema, data) => {
  const { error, value } = schema.validate(data, { stripUnknown: true })
  if (error) {
    throw errors.throwError({
      name: errors.ValidationError,
      message: error.message,
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    })
  }
  return value
})

async function ensureAsync(predicate, errorFunc, value) {
  if (await predicate(value)) return value
  else throw errorFunc(value)
}

export const makeSure = curry(ensureAsync)

export const hashPassword = (
  password = required('password'),
  salt = saltRounds
) => bcrypt.hash(password, salt)

export const comparePassword = ({
  hashedPassword = required('hashedPassword'),
  password = required('password')
}) => bcrypt.compare(password, hashedPassword)

export const signJwt = ({ data, expiresIn = '30days' }) =>
  signJwtPromise(data, config.get('APP_KEY'), {
    expiresIn,
    algorithm: jwtAlgorithm
  })

export const parseString = str => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return str
  }
}

export const verifyJwt = (token = required('token')) =>
  verifyJwtPromise(parseString(token), config.get('APP_KEY'), {
    algorithm: jwtAlgorithm
  })

export const addCookie = ({
  res,
  value,
  options = {
    path: '/',
    sameSite: true,
    httpOnly: true
  }
}) => {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }
  res.setHeader(
    'Set-Cookie',
    serialize(cookieName, String(stringValue), options)
  )
}

export const getCookie = req => {
  const cookies = req.cookies[cookieName]
  return cookies
}

export function asyncPipe(...fns) {
  return function innerAsyncPipe(params) {
    return fns.reduce(async function (result, next) {
      return next(await result)
    }, params)
  }
}
