'use strict'
import rawBody from 'raw-body'
import customServerHandler from '../../../server/request-handler'
import authService from '../../../server/services/auth'
import Cors from 'cors'
import respond from '../../../server/request-handler/respond'
import { createHmac, parseString } from '../../../server/lib/utils'
import configHelper from '../../../server/config'
import errors from '../../../server/lib/errors'

const verifyHmac = async req => {
  const buffer = await rawBody(req)
  const hmac = createHmac({
    secret: configHelper.get('SHOPIFY_CLIENT_SECRET'),
    data: buffer,
    digest: 'base64'
  })
  if (hmac !== req.headers['x-shopify-hmac-sha256']) {
    throw errors.throwError({
      name: errors.InvalidHmacError,
      message: 'invalid hmac'
    })
  }
  return parseString(buffer.toString())
}

const uninstallStore = async (req, res) => {
  const body = await verifyHmac(req)
  return authService.uninstall(body).then(respond({ req, res }))
}

export default customServerHandler({
  handler: uninstallStore,
  method: 'POST',
  middleware: Cors()
})

export const config = {
  api: {
    bodyParser: false
  }
}
