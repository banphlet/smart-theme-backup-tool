'use strict'
import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { activityModel, backupModel } from '../../../models'

export function fetchBackups (payload) {
  const schema = joi.object({
    shop_id: objectId().required(),
    theme_id: objectId().required(),
    page: joi.number().default(1),
    per_page: joi.number()
  })
  const validated = validate(schema, payload)
  return backupModel().paginateByShopIdAndThemeId({
    shopId: validated.shop_id,
    themeId: validated.theme_id,
    page: validated.page,
    limit: validated.per_page
  })
}

export function fetchTimeLines (payload) {
  const schema = joi.object({
    shop_id: objectId().required(),
    theme_id: objectId().required(),
    cursor: objectId(),
    limit: joi.number()
  })
  const validated = validate(schema, payload)
  return activityModel().paginateByShopId({
    shopId: validated.shop_id,
    themeId: validated.theme_id,
    cursor: validated.cursor,
    limit: validated.limit
  })
}
