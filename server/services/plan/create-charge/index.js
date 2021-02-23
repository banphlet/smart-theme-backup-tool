'use strict'
import { required } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'
import platforms from '../../platforms'


export default async function createCharge(shopId = required('shopId')) {
    const shop = await shopModel().getById(shopId)
    return platforms(shop.platform).createCharge({ accessToken: shop.external_access_token, platformDomain: shop.platform_domain, shopId: shop.id })
}