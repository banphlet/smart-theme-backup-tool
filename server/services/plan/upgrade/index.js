'use strict'

import { validate } from '../../../lib/utils'
import {
  themes as themeModel,
  shops as shopModel,
  activityModel
} from '../../../models'
import platforms from '../../platforms'
import joi, { objectId } from '../../../lib/joi'
import config from '../../../config'
import themesService from '../../themes-sync'
import * as agendaJobs from '../../../lib/agenda'
import { BackUpTypes } from '../../../models/backups/schema'

const schema = joi.object({
  shop_id: objectId().required(),
  charge_id: joi.string().required(),
  theme_id: objectId().required()
})

export default async function upgrade (payload) {
  const validated = validate(schema, payload)
  const shop = await shopModel().getById(validated.shop_id)
  await themeModel().getById(validated.theme_id)
  const confirmCharge = await platforms(shop.platform).confirmCharge({
    accessToken: shop.external_access_token,
    platformDomain: shop.platform_domain,
    chargeId: validated.charge_id
  })
  const updatedTheme = await themeModel().updateById(validated.theme_id, {
    external_payment_id: confirmCharge.id,
    payment_price: confirmCharge.price,
    payment_name: confirmCharge.name,
    is_subscribed: true
  })

  agendaJobs.addJob({
    theme: updatedTheme,
    handlerName: 'syncTheme',
    syncType: BackUpTypes.AUTOMATIC
  })

  activityModel().create({
    shop: updatedTheme.shop.id,
    theme_id: updatedTheme.id,
    action: 'Subscribed'
  })

  return {
    url: `https://${shop.platform_domain}/admin/apps/${config.get(
      'NEXT_PUBLIC_SHOPIFY_CLIENT_ID'
    )}`
  }
}
