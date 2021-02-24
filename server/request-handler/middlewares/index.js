'use strict'
import { compact } from 'lodash'

// simple function to allow using express middlewares
const middlewareCreator = customMiddleware => async (req, res) => {
  const middlewares = compact([customMiddleware])
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
