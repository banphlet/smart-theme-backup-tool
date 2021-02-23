'use strict'
'use strict'
import { validate } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'
import platforms from '../../platforms'
import joi, { objectId } from '../../../lib/joi'
import config from '../../../config'
import { SupportedSocialLoginPlatforms } from '../../../models/shops/schema'

const schema = joi.object({
    shop_id: objectId().required(),
    charge_id: joi.string().required()
})


export default async function upgrade(payload) {
    const validated = validate(schema, payload)
    const shop = await shopModel().getById(validated.shop_id)
    const confirmCharge = await platforms(shop.platform).confirmCharge({ accessToken: shop.external_access_token, platformDomain: shop.platform_domain, chargeId: validated.charge_id })
    await shopModel().updateById(shop.id, {
        plan: {
            name: confirmCharge.name,
            external_id: confirmCharge.id,
            platforms: Object.values(SupportedSocialLoginPlatforms),
            price: confirmCharge.price
        }
    })
    return {
        url: `https://${shop.platform_domain}/admin/apps/${config.get('NEXT_PUBLIC_SHOPIFY_CLIENT_ID')}`
    }
}


