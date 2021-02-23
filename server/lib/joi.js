'use strict'
import joi from 'joi'

export const objectId = () => {
  return joi.string().regex(/^[0-9a-fA-F]{24}$/)
}

export default joi
