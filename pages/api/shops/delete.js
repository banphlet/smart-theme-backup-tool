'use strict'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import shopService from '../../../server/services/shops'

const deleteShopAndDetails = (req, res) =>
  shopService()
    .deleteShopAndDetails(Object.assign({}, req.body, { platform: 'shopify' }))
    .then(respond({ res, req }))

export default customServerHandler({
  handler: deleteShopAndDetails,
  method: 'POST'
})
