'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { compact } from 'lodash'

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

const getBasedOnCriteria = ({ shopId = required('shopId'), field, value }) =>
  BackupModal.get({
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

export default () => ({
  ...BackupModal,
  createOrUpdate,
  create,
  getByEmail,
  getById,
  updateById,
  fetchByShopId,
  getBasedOnCriteria,
  paginateByShopId
})
