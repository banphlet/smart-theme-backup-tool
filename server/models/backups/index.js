'use strict'
import mongoose from 'mongoose'
import { compact } from 'lodash'
import moment from 'moment'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const Model = mongoose.models.Backup || mongoose.model('Backup', schema)
const BackupModal = BaseModel(Model)

const customErrorMessage = 'backup does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  BackupModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  BackupModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  BackupModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const updateById = (id, update) =>
  BackupModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const fetchByShopId = shopId =>
  BackupModal.fetch({
    query: {
      shop: shopId
    },
    select: '-access_token'
  })

const createOrUpdate = ({
  shopId = required('shopId'),
  ip,
  email,
  geo_location
}) =>
  BackupModal.upsert({
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

const paginateByShopId = ({ shopId, page, limit = 20, sort, isBlocked }) => {
  const aggregate = Model.aggregate([
    {
      $match: {
        shop: new mongoose.Types.ObjectId(shopId),
        ...(isBlocked && {
          is_blocked: isBlocked
        })
      }
    }
  ])
  const options = {
    limit,
    sort: sort ?? { _id: -1 },
    page
  }
  return Model.aggregatePaginate(aggregate, options).then(
    ({ docs, ...rest }) => {
      return {
        docs: docs.map(doc => {
          doc.id = doc._id
          return doc
        }),
        ...rest
      }
    }
  )
}
const upsertBaseOn24HourRange = ({
  shopId = required('shopId'),
  themeId = required('themeId'),
  syncType = required('theme')
}) =>
  BackupModal.upsert({
    query: {
      created_at: {
        $lte: moment()
          .endOf('day')
          .toDate(),
        $gte: moment()
          .startOf('day')
          .toDate()
      },
      shop: shopId,
      theme_id: themeId,
      type: syncType
    },
    update: {
      shop: shopId,
      theme_id: themeId,
      type: syncType
    }
  })

const fetchByPrevious24HourRange = ({ shopId, themeId }) =>
  BackupModal.fetch({
    query: {
      created_at: {
        $lte: moment()
          .add(1, 'days')
          .endOf('day')
          .toDate(),
        $gte: moment()
          .add(1, 'days')
          .startOf('day')
          .toDate()
      },
      shop: shopId,
      theme_id: themeId
    }
  })

export default () => ({
  ...BackupModal,
  fetchByPrevious24HourRange,
  createOrUpdate,
  create,
  getByEmail,
  getById,
  updateById,
  fetchByShopId,
  paginateByShopId
})
