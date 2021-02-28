'use strict'

import joi, { objectId } from '../../../lib/joi'

const schema = joi.object({
  shop_id: objectId().required(),
  theme_id: objectId().required()
})

export default function downgrade (payload) {}
