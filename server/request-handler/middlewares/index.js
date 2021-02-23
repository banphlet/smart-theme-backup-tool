'use strict'

import pino from 'express-pino-logger'
import { compact } from 'lodash'
import userAgent from 'express-useragent'

import { connect } from '../../lib/db'
import attachLocation from './attach-location'

const createPinoLogger = pino()

const expressMiddlewares = [
  connect,
  userAgent.express,
  createPinoLogger,
  attachLocation
]

// simple function to allow using express middlewares
const middlewareCreator = customMiddleware => async (req, res) => {
  const middlewares = compact([...expressMiddlewares, customMiddleware])
  const errorThrower = err => {
    if (err) {
      throw err
    }
  }
  for (const middleware of middlewares) {
    await middleware(req, res, errorThrower)
  }
}

export default middlewareCreator
