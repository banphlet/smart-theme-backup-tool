'use strict'
import { validate } from '../../../lib/utils'
import { shops as shopModel, themes as themeModel } from '../../../models'
import platforms from '../../platforms'
import joi, { objectId } from '../../../lib/joi'

const price = 2.99

const schema = joi.object({
  shop_id: objectId().required(),
  theme_id: objectId().required()
})

export default async function createCharge (payload) {
  const validated = validate(schema, payload)
  const shop = await shopModel().getById(validated.shop_id)
  const theme = await themeModel().getById(validated.theme_id)
  const planName = `Subscription of ${theme.external_theme_name} Theme`
  return platforms(shop.platform).createCharge({
    accessToken: shop.external_access_token,
    platformDomain: shop.platform_domain,
    shopId: shop.id,
    planName,
    price,
    themeId: theme.id
  })
}
