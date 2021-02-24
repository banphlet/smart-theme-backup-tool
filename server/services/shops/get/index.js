'use strict'

import { required } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'

export async function getByShopId (shopId = required('shopId')) {
  const {
    external_access_token,
    __v,
    _id,
    ...shop
  } = await shopModel().getById(shopId)
  return shop
}
