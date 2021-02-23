'use strict'
import { cond, propEq, T } from 'lodash/fp'
import customServerHandler from '../../../server/request-handler'
import shopService from '../../../server/services/shops'
import respond from '../../../server/request-handler/respond'
import errors from '../../../server/lib/errors'
import Cors from 'cors'

const getShopHandler = (req, res) =>
  shopService()
    .getByShopId(req.query?.shop_id)
    .then(respond({ req, res }))

const updateShopHandler = (req, res) =>
  shopService()
    .updateShopById(req.body)
    .then(respond({ req, res }))

export default cond([
  [
    propEq('method', 'GET'),
    customServerHandler({ handler: getShopHandler, middleware: Cors() })
  ],
  [
    propEq('method', 'PUT'),
    customServerHandler({ handler: updateShopHandler, method: 'PUT' })
  ],
  [
    T,
    _ =>
      errors.throwError({
        name: errors.RequestNotFound,
        message: 'not found'
      })
  ]
])
