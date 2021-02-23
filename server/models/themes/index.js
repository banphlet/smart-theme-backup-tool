'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { compact } from 'lodash'

const Model = mongoose.models.Theme || mongoose.model('Theme', schema)
const ThemeModal = BaseModel(Model)

const customErrorMessage = 'customer does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  ThemeModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  ThemeModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  ThemeModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const updateById = (id, update) =>
  ThemeModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const fetchByShopId = shopId =>
  ThemeModal.fetch({
    query: {
      shop: shopId
    },
    select: '-access_token'
  })

const getBasedOnCriteria = ({ shopId = required('shopId'), field, value }) =>
  ThemeModal.get({
    query: {
      shop: shopId,
      [field]: value
    }
  })

const createOrUpdate = ({
  shopId = required('shopId'),
  ip,
  email,
  geo_location
}) =>
  ThemeModal.upsert({
    query: {
      shop: shopId,
      $or: compact([ip && { ip }, email && { email }])
    },
    update: {
      ip,
      shop: shopId,
      email,
      $inc: { attempts: 1 },
      geo_location
    }
  })

const upsertMultiple = (themes = []) =>
  Promise.all(
    themes.map(theme =>
      ThemeModal.upsert({
        query: {
          shop: theme.shop,
          external_theme_id: theme.external_theme_id
        },
        update: theme
      })
    )
  )

export default () => ({
  ...ThemeModal,
  createOrUpdate,
  create,
  getByEmail,
  getById,
  updateById,
  fetchByShopId,
  getBasedOnCriteria,
  upsertMultiple
})
