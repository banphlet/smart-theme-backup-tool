'use strict'
import { signJwt } from '../../../server/lib/utils'
import customServerHandler from '../../../server/request-handler'
import authService from '../../../server/services/auth'

const acceptPermissionHandler = (req, res) =>
  authService.installShop(req.query).then(async data => {
    const token = await signJwt({ data: { shopId: data.shop.id } })
    res.redirect(
      `${data.url}?token=${token}&shop_id=${data.shop.id}&platform_domain=${data.shop.platform_domain}`
    )
  })

export default customServerHandler({ handler: acceptPermissionHandler })
